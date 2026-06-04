'use client';
import React from 'react';
import { useSession } from '@/lib/auth-client';

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-[#121212] p-6 rounded-xl border border-neutral-800/60 flex flex-col gap-6 min-w-[240px] w-full">
      {/* Icon Wrapper */}
      <div className="bg-[#242426] p-2.5 rounded-lg w-fit flex items-center justify-center text-neutral-400">
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <p className="text-neutral-400 text-sm font-medium tracking-wide">
          {title}
        </p>
        <p className="text-white text-4xl font-semibold tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

const RecruiterDashboardPage = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="text-white p-10 bg-black min-h-screen">Loading...</div>
    );
  }

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
    <div className="bg-black min-h-screen p-8 font-sans antialiased selection:bg-neutral-800">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-medium text-white tracking-tight">
          Welcome back, {user?.name || 'Alex Sterling'}
        </h2>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-350">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
