
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import twilio from 'twilio';
import session from 'express-session';
import cors from 'cors';

const JWT_SECRET = process.env.JWT_SECRET || 'ilava-jwt-secret-fallback-key-2024';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ilava-session-secret-fallback-key-2024';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Initialize services
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) ? 
  twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

export function registerRoutes(app: Express): Server {
  // Enable CORS for development
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? false 
      : ['http://localhost:5173', 'http://0.0.0.0:5173', 'https://*.replit.dev', 'https://*.replit.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Session middleware
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
  }));

  // Helper function to generate JWT token
  const generateToken = (userId: number, userType: string) => {
    return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: '7d' });
  };

  // Helper function to generate OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Email/Password Registration
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, userType, phone } = req.body;

      if (!email || !password || !userType) {
        return res.status(400).json({ error: 'Email, password, and user type are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        userType,
        phone,
        isEmailVerified: false
      });

      const token = generateToken(user.id, user.userType);

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Email/Password Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.userType);

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Phone/OTP - Send OTP
  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      if (!twilioClient) {
        return res.status(500).json({ error: 'SMS service not configured' });
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await storage.createOTP({
        phone,
        code: otp,
        expiresAt
      });

      // Send SMS
      await twilioClient.messages.create({
        body: `Your ILava verification code is: ${otp}`,
        from: TWILIO_PHONE_NUMBER,
        to: phone
      });

      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  });

  // Phone/OTP - Verify OTP and Login/Register
  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { phone, otp, userType, firstName, lastName } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required' });
      }

      // Verify OTP
      const isValidOTP = await storage.verifyOTP(phone, otp);
      if (!isValidOTP) {
        return res.status(401).json({ error: 'Invalid or expired OTP' });
      }

      // Check if user exists
      let user = await storage.getUserByPhone(phone);
      
      if (!user) {
        // Create new user if doesn't exist
        if (!userType) {
          return res.status(400).json({ error: 'User type is required for new registrations' });
        }
        
        user = await storage.createUser({
          phone,
          userType,
          firstName,
          lastName,
          isPhoneVerified: true
        });
      } else {
        // Update phone verification status
        await storage.updateUserPhoneVerification(user.id, true);
      }

      const token = generateToken(user.id, user.userType);

      res.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        },
        token
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Google OAuth - Verify Google token and Login/Register
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { idToken, userType } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'Google ID token is required' });
      }

      if (!googleClient || !GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google OAuth not configured' });
      }

      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ error: 'Invalid Google token' });
      }

      const { sub: googleId, email, given_name: firstName, family_name: lastName, picture } = payload;

      // Check if user exists
      let user = await storage.getUserByGoogleId(googleId);
      
      if (!user && email) {
        // Check by email if not found by Google ID
        user = await storage.getUserByEmail(email);
        if (user) {
          // Link Google account to existing user
          await storage.updateUserGoogleId(user.id, googleId);
        }
      }

      if (!user) {
        // Create new user
        if (!userType) {
          return res.status(400).json({ error: 'User type is required for new registrations' });
        }

        user = await storage.createUser({
          email,
          googleId,
          firstName,
          lastName,
          userType,
          profileImage: picture,
          isEmailVerified: true
        });
      }

      const token = generateToken(user.id, user.userType);

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          profileImage: user.profileImage
        },
        token
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  });

  // Apple Sign In - Verify Apple token and Login/Register
  app.post('/api/auth/apple', async (req, res) => {
    try {
      const { identityToken, userType, user: appleUser } = req.body;

      if (!identityToken) {
        return res.status(400).json({ error: 'Apple identity token is required' });
      }

      // For production, you would verify the Apple JWT token here
      // For now, we'll decode it (in production, use proper verification)
      const decoded = jwt.decode(identityToken) as any;
      
      if (!decoded || !decoded.sub) {
        return res.status(401).json({ error: 'Invalid Apple token' });
      }

      const appleId = decoded.sub;
      const email = decoded.email;

      // Check if user exists
      let user = await storage.getUserByAppleId(appleId);
      
      if (!user && email) {
        // Check by email if not found by Apple ID
        user = await storage.getUserByEmail(email);
        if (user) {
          // Link Apple account to existing user
          await storage.updateUserAppleId(user.id, appleId);
        }
      }

      if (!user) {
        // Create new user
        if (!userType) {
          return res.status(400).json({ error: 'User type is required for new registrations' });
        }

        user = await storage.createUser({
          email,
          appleId,
          firstName: appleUser?.name?.firstName,
          lastName: appleUser?.name?.lastName,
          userType,
          isEmailVerified: !!email
        });
      }

      const token = generateToken(user.id, user.userType);

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        },
        token
      });
    } catch (error) {
      console.error('Apple auth error:', error);
      res.status(500).json({ error: 'Apple authentication failed' });
    }
  });

  // Get current user (protected route)
  app.get('/api/auth/me', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await storage.getUserById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          profileImage: user.profileImage
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not log out' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // Health check route for database connection
  app.get('/api/health', async (req, res) => {
    try {
      // Test database connection by trying to get user count
      const users = await storage.getAllUsers();
      res.json({ 
        status: 'ok', 
        database: 'connected',
        userCount: users.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database health check failed:', error);
      res.status(500).json({ 
        status: 'error', 
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
