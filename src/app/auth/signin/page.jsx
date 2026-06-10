'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowLeft,
  LogIn,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

const SignInPage = () => {
  const router = useRouter();
  const { refetch } = useAuth(); // ✅ AuthContext থেকে refetch নিন

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Form States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Better-Auth Credentials Signin Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        toast.error(
          signInError.message || 'Invalid email or password. Please try again.',
        );
        setLoading(false);
        return;
      }

      if (data) {
        // ✅ সেশন রিফ্রেশ করুন
        await refetch();

        toast.success('Welcome back! Logged in successfully. 👋');

        // ✅ পেজ রিফ্রেশ এবং রিডাইরেক্ট
        router.refresh();
        router.push(redirectTo);
      }
    } catch (err) {
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
        fetchOptions: {
          onSuccess: async () => {
            await refetch();
            router.refresh();
          },
        },
      });
    } catch (err) {
      toast.error('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-75 sm:w-150 h-75 sm:h-100 bg-blue-600/15 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* ══════════════ LOGIN CARD LAYER ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <div
          className="w-full border border-white/6 p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl rounded-[24px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 14, 22, 0.80) 0%, rgba(8, 8, 12, 0.98) 100%)',
          }}
        >
          {/* Top Header */}
          <div className="text-center space-y-1.5 mb-6 relative">
            <Link
              href="/"
              className="absolute left-0 top-1 text-[11px] text-white/45 hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer group"
            >
              <ArrowLeft
                size={12}
                className="transition-transform group-hover:-translate-x-0.5"
              />{' '}
              Back
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-1 mt-4 sm:mt-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-400 text-[9px] font-bold tracking-widest uppercase">
                Welcome Back
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Sign In To HireLoop
            </h2>
            <p className="text-zinc-400 text-[11px] font-medium">
              Enter your credentials to access your routine dashboard
            </p>
          </div>

          {/* ── FORM CONTAINER ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="w-full space-y-1.5">
              <label className="text-zinc-300 font-medium text-xs block pl-0.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail
                  className="absolute left-4 text-zinc-500 pointer-events-none"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Password with Toggle */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-zinc-300 font-medium text-xs">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-blue-500 hover:text-blue-400 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock
                  className="absolute left-4 text-zinc-500 pointer-events-none"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-zinc-950/60 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={18} />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center py-4">
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
              Or Connect Via
            </span>
            <div className="flex-1 h-px bg-zinc-900" />
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 hover:text-white font-medium text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Sign In With Google</span>
          </button>

          {/* Redirect Footer */}
          <p className="text-center text-zinc-500 text-xs font-medium pt-4">
            Don&apos;t have an account yet?{' '}
            <Link
              href={`/auth/signup?redirect=${redirectTo}`}
              className="text-blue-500 hover:text-blue-400 font-semibold ml-1 cursor-pointer underline underline-offset-4 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;
