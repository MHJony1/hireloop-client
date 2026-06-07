'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';

/* ─────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────── */
const T = {
  bg: '#0f0f1a',
  surface: '#16162a',
  surfaceHover: '#1e1e35',
  border: '#2a2a45',
  purple: '#7C3AED',
  purpleLight: '#9F67FA',
  text: '#e2e2f0',
  textMuted: '#6b6b8a',
  textSub: '#9494b8',
  badge: '#13132a',
};

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const ACCENT_COLORS = [
  { icon: '#7C3AED', iconBg: '#7C3AED18', glow: '#7C3AED33' }, // purple
  { icon: '#34d47a', iconBg: '#34d47a18', glow: '#34d47a22' }, // green
  { icon: '#9F67FA', iconBg: '#9F67FA18', glow: '#9F67FA22' }, // purple-light
  { icon: '#f56580', iconBg: '#f5658018', glow: '#f5658022' }, // rose
];

const StatCard = ({ icon, title, value, accentIdx = 0 }) => {
  const acc = ACCENT_COLORS[accentIdx % ACCENT_COLORS.length];
  return (
    <div
      className="flex flex-col gap-5 p-5 rounded-2xl transition-all duration-200 cursor-default"
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        boxShadow: '0 4px 24px #00000033',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = acc.icon + '66';
        e.currentTarget.style.boxShadow = `0 4px 28px ${acc.glow}`;
        e.currentTarget.style.background = T.surfaceHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = '0 4px 24px #00000033';
        e.currentTarget.style.background = T.surface;
      }}
    >
      {/* Icon */}
      <div
        className="p-2.5 rounded-xl w-fit"
        style={{
          background: acc.iconBg,
          color: acc.icon,
          border: `1px solid ${acc.icon}33`,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: T.textMuted }}
        >
          {title}
        </p>
        <p
          className="text-4xl font-bold tracking-tight"
          style={{ color: T.text }}
        >
          {value}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-[2px] rounded-full w-10"
        style={{ background: `linear-gradient(90deg,${acc.icon},transparent)` }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
const SkeletonCard = () => (
  <div
    className="flex flex-col gap-5 p-5 rounded-2xl"
    style={{ background: T.surface, border: `1px solid ${T.border}` }}
  >
    <div
      className="w-10 h-10 rounded-xl animate-pulse"
      style={{ background: T.border }}
    />
    <div className="flex flex-col gap-2">
      <div
        className="h-3 w-24 rounded-md animate-pulse"
        style={{ background: T.border }}
      />
      <div
        className="h-9 w-16 rounded-md animate-pulse"
        style={{ background: T.border }}
      />
    </div>
    <div
      className="h-[2px] w-10 rounded-full animate-pulse"
      style={{ background: T.border }}
    />
  </div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const RecruiterDashboardPage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const stats = [
    {
      title: 'Total Job Posts',
      value: '48',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    {
      title: 'Total Applicants',
      value: '1,284',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Active Jobs',
      value: '18',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      title: 'Jobs Closed',
      value: '32',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen p-8 font-sans antialiased"
      style={{ background: T.bg }}
    >
      {/* ── Top accent line ── */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none"
        style={{
          background: `linear-gradient(90deg,transparent,${T.purple},${T.purpleLight},transparent)`,
        }}
      />

      {/* ── Header ── */}
      <div className="mb-10 flex flex-col gap-1">
        {isPending ? (
          <>
            <div
              className="h-5 w-32 rounded-md animate-pulse mb-2"
              style={{ background: T.border }}
            />
            <div
              className="h-8 w-64 rounded-md animate-pulse"
              style={{ background: T.border }}
            />
          </>
        ) : (
          <>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: T.textMuted }}
            >
              Recruiter Dashboard
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: T.text }}
            >
              Welcome back,{' '}
              <span style={{ color: T.purpleLight }}>
                {user?.name?.split(' ')[0] || 'Alex'}
              </span>{' '}
              👋
            </h2>
            <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>
              Here&apos;s what&apos;s happening with your job postings today.
            </p>
          </>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((stat, i) => (
              <StatCard
                key={i}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                accentIdx={i}
              />
            ))}
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
