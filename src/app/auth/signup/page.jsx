'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  Briefcase,
  CheckCircle,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Link from 'next/link';

const SignUpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoUrl: '',
    password: '',
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('seeker'); // Fixed: 'seeker' instead of 'jobseeker'

  // Real-time Password Validation Matrix
  const passwordValidations = {
    hasMinLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
  };

  const isPasswordValid =
    passwordValidations.hasMinLength &&
    passwordValidations.hasUppercase &&
    passwordValidations.hasLowercase;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Better-Auth Credentials Signup Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password must fulfill all validation rules.');
      return;
    }

    setLoading(true);

    // Fixed: role is now 'seeker' or 'recruiter'
    const plan = role === 'seeker' ? 'seeker_free' : 'recruiter_free';

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        image: formData.photoUrl || undefined,
        role: role,
        plan: plan,
        callbackURL: '/auth/signin',
      });

      if (signUpError) {
        toast.error(
          signUpError.message ||
            'Registration failed! Please check your details.',
        );
        setLoading(false);
        return;
      }

      if (data) {
        toast.success('Account created successfully! Please sign in now. 🎉');
        router.push(`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Better-Auth Google OAuth Handler
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectTo,
      });
    } catch (err) {
      console.error('Google auth error:', err);
      toast.error('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#030305] via-[#0a0a14] to-[#030305] text-white flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-96 sm:w-150 h-96 sm:h-100 bg-blue-600/20 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-[-10%] w-60 h-60 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <div
          className="w-full border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl rounded-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(14, 14, 22, 0.9) 0%, rgba(8, 8, 12, 0.98) 100%)',
          }}
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-8 relative">
            <Link
              href="/"
              className="absolute left-0 top-1 text-xs text-white/50 hover:text-blue-400 flex items-center gap-1 transition-all duration-200 group"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Back
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                Join HireLoop
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-400 text-xs font-medium">
              Start your journey with us today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium text-xs block pl-0.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#0a0a12] border border-gray-800 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Profile Picture URL */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium text-xs block pl-0.5">
                Profile Picture URL
                <span className="text-gray-500 ml-1">(optional)</span>
              </label>
              <div className="relative">
                <ImageIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#0a0a12] border border-gray-800 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium text-xs block pl-0.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#0a0a12] border border-gray-800 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium text-xs block pl-0.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-9 pr-11 rounded-xl bg-[#0a0a12] border border-gray-800 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Validation */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 pt-2 px-1"
                >
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${passwordValidations.hasMinLength ? 'text-green-400' : 'text-gray-600'}`}
                  >
                    <CheckCircle
                      size={10}
                      className={
                        passwordValidations.hasMinLength
                          ? 'text-green-400'
                          : 'text-gray-600'
                      }
                    />
                    Min 6 chars
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${passwordValidations.hasUppercase ? 'text-green-400' : 'text-gray-600'}`}
                  >
                    <CheckCircle
                      size={10}
                      className={
                        passwordValidations.hasUppercase
                          ? 'text-green-400'
                          : 'text-gray-600'
                      }
                    />
                    1 Uppercase
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${passwordValidations.hasLowercase ? 'text-green-400' : 'text-gray-600'}`}
                  >
                    <CheckCircle
                      size={10}
                      className={
                        passwordValidations.hasLowercase
                          ? 'text-green-400'
                          : 'text-gray-600'
                      }
                    />
                    1 Lowercase
                  </div>
                </motion.div>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium text-xs block pl-0.5">
                I want to join as
              </label>
              <div className="flex gap-4">
                {/* Job Seeker */}
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    role === 'seeker'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-800 bg-[#0a0a12] text-gray-400 hover:border-gray-700 hover:text-gray-300'
                  }`}
                >
                  <User size={14} />
                  <span className="text-sm font-medium">Job Seeker</span>
                </button>

                {/* Recruiter */}
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    role === 'recruiter'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-gray-800 bg-[#0a0a12] text-gray-400 hover:border-gray-700 hover:text-gray-300'
                  }`}
                >
                  <Briefcase size={14} />
                  <span className="text-sm font-medium">Recruiter</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-600/50 disabled:to-blue-500/50 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <Briefcase size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full h-11 rounded-xl bg-[#0a0a12] border border-gray-800 hover:bg-gray-900 hover:border-gray-700 text-gray-300 hover:text-white font-medium text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.37 3.68 1.44 7.6l3.86 3A6.98 6.98 0 0 1 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.6-.2-2.36H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.62l3.71 2.88c2.17-2 3.43-4.94 3.43-8.65z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.4a6.93 6.93 0 0 1 0-4.8l-3.86-3A11.95 11.95 0 0 0 1 12c0 1.92.45 3.74 1.25 5.37l4.05-3.17z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.71-2.88c-1.1.74-2.5 1.18-4.25 1.18-3.23 0-5.97-2.18-6.95-5.11l-3.96 3.07A11.97 11.97 0 0 0 12 23z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Already have an account?{' '}
            <Link
              href={`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-blue-500 hover:text-blue-400 font-semibold transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
