'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function UnauthorizedPage() {
  const [hoveredHome, setHoveredHome] = useState(false);
  const [hoveredSignIn, setHoveredSignIn] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl bg-[radial-gradient(circle,#7C3AED_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Lock icon */}
        <div className="flex justify-center mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.2)] shadow-[0_0_40px_rgba(124,58,237,0.12)]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="#9F67FA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="#9F67FA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="16" r="1.5" fill="#9F67FA" />
            </svg>
          </div>
        </div>

        {/* Error code */}
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#7C3AED]">
          Error 403
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          You don&apos;t have permission to view this page. This area is
          restricted to authorized users only.
        </p>

        {/* Divider */}
        <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[#7C3AED55] to-transparent" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-[#7C3AED] to-[#9F67FA]"
            style={{
              boxShadow: hoveredHome
                ? '0 8px 24px rgba(124,58,237,0.35)'
                : '0 0 0 rgba(124,58,237,0)',
            }}
            onMouseEnter={() => setHoveredHome(true)}
            onMouseLeave={() => setHoveredHome(false)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M8 3L4 7.5L8 12M4 7.5H12"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go Home
          </Link>

          <Link
            href="/auth/signin"
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 border border-white/10"
            style={{
              background: hoveredSignIn
                ? 'rgba(255,255,255,0.07)'
                : 'rgba(255,255,255,0.04)',
              color: hoveredSignIn ? '#e2e2f0' : '#9494b8',
            }}
            onMouseEnter={() => setHoveredSignIn(true)}
            onMouseLeave={() => setHoveredSignIn(false)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M5.5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2.5M10 10l3-2.5L10 5M13 7.5H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign In
          </Link>
        </div>

        {/* Help note */}
        <p className="mt-8 text-xs text-[#4a4a6a]">
          Think this is a mistake?{' '}
          <Link
            href="/contact"
            className="transition-colors duration-300"
            style={{
              color: hoveredContact ? '#9F67FA' : '#7C3AED',
            }}
            onMouseEnter={() => setHoveredContact(true)}
            onMouseLeave={() => setHoveredContact(false)}
          >
            Contact support →
          </Link>
        </p>
      </div>
    </div>
  );
}