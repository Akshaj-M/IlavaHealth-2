
# Authentication Setup for ILava Platform

This document outlines the setup required for the authentication system.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_neon_database_url

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_key_here

# Session Secret (generate a random string)
SESSION_SECRET=your_session_secret_here

# Twilio SMS Service (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Apple Sign In (if needed)
APPLE_CLIENT_ID=your_apple_client_id
APPLE_KEY_ID=your_apple_key_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_PRIVATE_KEY=your_apple_private_key
```

## Setup Instructions

### 1. Database Setup
- Ensure your Neon database is configured
- Run migrations to create the user tables

### 2. Twilio Setup (for SMS OTP)
1. Create a Twilio account at https://www.twilio.com/
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number for sending SMS
4. Add these credentials to your environment variables

### 3. Google OAuth Setup
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add the Google Client ID to your environment variables

### 4. Apple Sign In Setup (Optional)
1. Go to Apple Developer Console
2. Create an App ID with Sign In with Apple capability
3. Create a Service ID for web authentication
4. Generate a private key for server-to-server authentication
5. Add the credentials to your environment variables

## Authentication Flow

### Email/Password
- Users can register with email and password
- Passwords are hashed using bcrypt
- JWT tokens are issued for authentication

### Phone/OTP
- Users enter phone number
- OTP is sent via Twilio SMS
- OTP verification creates or logs in user
- JWT tokens are issued for authentication

### Google OAuth
- Frontend integrates with Google Sign-In JavaScript library
- ID token is sent to backend for verification
- User account is created or linked
- JWT tokens are issued for authentication

### Apple Sign In
- Frontend integrates with Apple Sign In JavaScript library
- Identity token is sent to backend for verification
- User account is created or linked
- JWT tokens are issued for authentication

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- OTP expiration (10 minutes)
- Session management
- Protected routes with token verification
- Input validation with Zod schemas

## API Endpoints

- `POST /api/auth/register` - Email/password registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login/register
- `POST /api/auth/google` - Google OAuth login/register
- `POST /api/auth/apple` - Apple Sign In login/register
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user
