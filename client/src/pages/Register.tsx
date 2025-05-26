
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import styles from '../styles/Login.module.css';
import ilavaLogo from '../assets/ilava-logo.svg';
import { FaArrowLeft } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  userType: z.string().min(1, 'Please select user type')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userType: ''
    }
  });

  const handleBackToLogin = () => {
    setLocation('/login');
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          userType: data.userType
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('userType', result.user.userType);
        
        // Redirect based on user type
        const redirectPath = result.user.userType === 'farmer' ? '/farmer' : '/buyer';
        setLocation(redirectPath);
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackToLogin}>
          <FaArrowLeft />
        </button>
        <img src={ilavaLogo} alt="Ilava Logo" className={styles.logo} />
        <h1 className={styles.title}>ILAVA</h1>
      </div>

      <div className={styles.card}>
        <h2 className={styles.welcome}>Create Account</h2>
        <p className={styles.welcomeSubtitle}>Sign up to get started</p>

        <form className={styles.form} onSubmit={form.handleSubmit(handleRegister)}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>User Type</label>
            <select 
              className={styles.input}
              {...form.register('userType')}
            >
              <option value="">Select user type</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
            {form.formState.errors.userType && (
              <span className="text-red-500 text-sm">{form.formState.errors.userType.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>First Name</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="John"
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName && (
              <span className="text-red-500 text-sm">{form.formState.errors.firstName.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Last Name</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Doe"
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName && (
              <span className="text-red-500 text-sm">{form.formState.errors.lastName.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="your@email.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <span className="text-red-500 text-sm">{form.formState.errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone (Optional)</label>
            <input 
              type="tel" 
              className={styles.input} 
              placeholder="+1 234 567 8900"
              {...form.register('phone')}
            />
            {form.formState.errors.phone && (
              <span className="text-red-500 text-sm">{form.formState.errors.phone.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••••"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••••"
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <span className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.signupText}>
          Already have an account?{' '}
          <a href="#signin" className={styles.signupLink} onClick={handleBackToLogin}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
