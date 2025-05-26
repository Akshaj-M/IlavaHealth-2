import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import styles from '../styles/Login.module.css';
import ilavaLogo from '../assets/ilava-logo.svg';
import { FaArrowLeft, FaGoogle, FaApple } from 'react-icons/fa';
import { BsPhone } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

enum LoginMethod {
  OPTIONS = 'options',
  EMAIL = 'email',
  PHONE = 'phone',
  OTP = 'otp'
}

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number')
});

const otpSchema = z.object({
  digit1: z.string().length(1),
  digit2: z.string().length(1),
  digit3: z.string().length(1),
  digit4: z.string().length(1),
  digit5: z.string().length(1),
  digit6: z.string().length(1)
});

type EmailForm = z.infer<typeof emailSchema>;
type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(LoginMethod.OPTIONS);
  const [userType, setUserType] = useState<string>('');
  const [phoneForOtp, setPhoneForOtp] = useState<string>('');

  // For Email login
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // For Phone login
  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: ''
    }
  });

  // For OTP verification
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      digit5: '',
      digit6: ''
    }
  });

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      // If no user type is set, redirect to splash screen
      setLocation('/');
    }
  }, [setLocation]);

  const handleBackToSplash = () => {
    setLocation('/');
  };

  const handleBackToOptions = () => {
    setLoginMethod(LoginMethod.OPTIONS);
  };

  const handleEmailLogin = async (data: EmailForm) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect based on user type
        const redirectPath = result.user.userType === 'farmer' ? '/farmer' : '/buyer';
        setLocation(redirectPath);
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handlePhoneLogin = async (data: PhoneForm) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: data.phoneNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        setPhoneForOtp(data.phoneNumber);
        setLoginMethod(LoginMethod.OTP);
        alert('OTP sent to your phone number');
      } else {
        alert(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleOtpVerification = async (data: OtpForm) => {
    try {
      const otp = Object.values(data).join('');
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneForOtp,
          otp,
          userType // Include userType for new user registration
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect based on user type
        const redirectPath = result.user.userType === 'farmer' ? '/farmer' : '/buyer';
        setLocation(redirectPath);
      } else {
        alert(result.error || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // For Google OAuth, you would typically use Google's JavaScript API
      // This is a simplified version - in production, you'd integrate with Google's SDK
      
      // For now, we'll simulate the Google OAuth flow
      // In a real implementation, you would:
      // 1. Load Google's JavaScript API
      // 2. Initialize the Google Auth client
      // 3. Handle the sign-in flow
      // 4. Get the ID token from Google
      
      alert('Google OAuth integration requires Google Client ID setup. Please configure GOOGLE_CLIENT_ID environment variable.');
      
      // Example of what the actual implementation would look like:
      /*
      const idToken = await getGoogleIdToken(); // This would come from Google's SDK
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          userType
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        const redirectPath = result.user.userType === 'farmer' ? '/farmer' : '/buyer';
        setLocation(redirectPath);
      } else {
        alert(result.error || 'Google login failed');
      }
      */
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login not available at this time.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // For Apple Sign In, you would typically use Apple's JavaScript API
      // This is a simplified version - in production, you'd integrate with Apple's SDK
      
      alert('Apple Sign In integration requires Apple Developer setup. Please configure Apple Sign In credentials.');
      
      // Example of what the actual implementation would look like:
      /*
      const appleAuthResult = await getAppleAuthToken(); // This would come from Apple's SDK
      
      const response = await fetch('/api/auth/apple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityToken: appleAuthResult.identityToken,
          user: appleAuthResult.user,
          userType
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        const redirectPath = result.user.userType === 'farmer' ? '/farmer' : '/buyer';
        setLocation(redirectPath);
      } else {
        alert(result.error || 'Apple login failed');
      }
      */
    } catch (error) {
      console.error('Apple login error:', error);
      alert('Apple Sign In not available at this time.');
    }
  };

  const renderLoginOptions = () => (
    <>
      <h2 className={styles.welcome}>Welcome to Ilava</h2>
      <p className={styles.welcomeSubtitle}>
        Sign in as a {userType === 'farmer' ? 'Farmer' : 'Buyer'}
      </p>

      <div className={styles.socialButtons}>
        <button 
          className={`${styles.socialButton} ${styles.emailButton}`} 
          onClick={() => setLoginMethod(LoginMethod.EMAIL)}
        >
          <MdEmail />
          <span>Continue with Email</span>
        </button>
        <button 
          className={`${styles.socialButton} ${styles.phoneButton}`} 
          onClick={() => setLoginMethod(LoginMethod.PHONE)}
        >
          <BsPhone />
          <span>Continue with Phone</span>
        </button>
        <button 
          className={`${styles.socialButton} ${styles.googleButton}`} 
          onClick={handleGoogleLogin}
        >
          <FaGoogle />
          <span>Continue with Google</span>
        </button>
        <button 
          className={`${styles.socialButton} ${styles.appleButton}`} 
          onClick={handleAppleLogin}
        >
          <FaApple />
          <span>Continue with Apple</span>
        </button>
      </div>

      <p className={styles.signupText}>
        Don't have an account?{' '}
        <a href="#signup" className={styles.signupLink} onClick={() => setLocation('/register')}>Sign up</a>
      </p>
    </>
  );

  const renderEmailLogin = () => (
    <>
      <h2 className={styles.welcome}>Sign in with Email</h2>
      <p className={styles.welcomeSubtitle}>Enter your email and password</p>

      <form className={styles.form} onSubmit={emailForm.handleSubmit(handleEmailLogin)}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input 
            type="email" 
            className={styles.input} 
            placeholder="your@email.com"
            {...emailForm.register('email')}
          />
          {emailForm.formState.errors.email && (
            <span className="text-red-500 text-sm">{emailForm.formState.errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input 
            type="password" 
            className={styles.input} 
            placeholder="••••••••••"
            {...emailForm.register('password')}
          />
          {emailForm.formState.errors.password && (
            <span className="text-red-500 text-sm">{emailForm.formState.errors.password.message}</span>
          )}
        </div>

        <a href="#forgot" className={styles.forgotPassword}>Forgot Password?</a>

        <button type="submit" className={styles.loginButton}>Sign In</button>
      </form>

      <p className={styles.backToOptions} onClick={handleBackToOptions}>
        Back to login options
      </p>
    </>
  );

  const renderPhoneLogin = () => (
    <>
      <h2 className={styles.phoneInputHeader}>Sign in with Phone</h2>
      <p className={styles.phoneInputSubtext}>We'll send a verification code to your phone</p>

      <form className={styles.phoneInputContainer} onSubmit={phoneForm.handleSubmit(handlePhoneLogin)}>
        <input 
          type="tel" 
          className={styles.phoneInputField} 
          placeholder="Enter your phone number"
          {...phoneForm.register('phoneNumber')}
        />
        {phoneForm.formState.errors.phoneNumber && (
          <span className="text-red-500 text-sm">{phoneForm.formState.errors.phoneNumber.message}</span>
        )}

        <button type="submit" className={styles.verifyButton}>Send Verification Code</button>
      </form>

      <p className={styles.backToOptions} onClick={handleBackToOptions}>
        Back to login options
      </p>
    </>
  );

  const renderOtpVerification = () => (
    <>
      <h2 className={styles.phoneInputHeader}>Verify Your Phone</h2>
      <p className={styles.phoneInputSubtext}>
        Enter the 6-digit code sent to {phoneForOtp}
      </p>

      <form className={styles.form} onSubmit={otpForm.handleSubmit(handleOtpVerification)}>
        <div className={styles.otpContainer}>
          <input 
            type="text" 
            className={styles.otpInput} 
            maxLength={1} 
            {...otpForm.register('digit1')}
          />
          <input 
            type="text" 
            className={styles.otpInput} 
            maxLength={1} 
            {...otpForm.register('digit2')}
          />
          <input 
            type="text" 
            className={styles.otpInput} 
            maxLength={1} 
            {...otpForm.register('digit3')}
          />
          <input 
            type="text" 
            className={styles.otpInput} 
            maxLength={1} 
            {...otpForm.register('digit4')}
          />
          <input 
            type="text" 
            className={styles.otpInput} 
            maxLength={1}
            {...otpForm.register('digit5')}
          />
          <input 
            type="text" 
            className={styles.otpInput} 
            maxLength={1}
            {...otpForm.register('digit6')}
          />
        </div>

        <button type="submit" className={styles.verifyButton}>Verify Code</button>
      </form>

      <p className={styles.backToOptions} onClick={() => setLoginMethod(LoginMethod.PHONE)}>
        Resend code
      </p>
    </>
  );

  const renderLoginContent = () => {
    switch (loginMethod) {
      case LoginMethod.EMAIL:
        return renderEmailLogin();
      case LoginMethod.PHONE:
        return renderPhoneLogin();
      case LoginMethod.OTP:
        return renderOtpVerification();
      default:
        return renderLoginOptions();
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackToSplash}>
          <FaArrowLeft />
        </button>
        <img src={ilavaLogo} alt="Ilava Logo" className={styles.logo} />
        <h1 className={styles.title}>ILAVA</h1>
      </div>

      <div className={styles.card}>
        {renderLoginContent()}
      </div>
    </div>
  );
}