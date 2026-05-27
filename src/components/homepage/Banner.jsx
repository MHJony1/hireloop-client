'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

const trendingTags = ['Product Designer', 'AI Engineering', 'Dev-ops Engineer'];

const stats = [
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    value: '50K',
    label: 'Active Jobs',
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    value: '12K',
    label: 'Companies',
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <circle cx="11" cy="11" r="3" />
      </svg>
    ),
    value: '2M',
    label: 'Job Seekers',
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    value: '97%',
    label: 'Satisfaction Rate',
  },
];

const Banner = () => {
  const [jobQuery, setJobQuery] = useState('');
  const [location, setLocation] = useState('');

  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        width: Math.random() * 1.5 + 0.8,
        height: Math.random() * 1.5 + 0.8,
        top: Math.random() * 85,
        left: Math.random() * 100,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [],
  );

  return (
    <section className="relative w-full overflow-hidden bg-[#060608] pt-24 pb-20 select-none">
      {/* ── Star field ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* ── Top Ambient Glow ── */}
      <div
        className="pointer-events-none absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] z-0 blur-[160px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 65%)',
        }}
      />

      {/* ══════════════════════════════
          TOP CONTENT
         ══════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.02] backdrop-blur-md rounded-full px-4 py-1.5 mb-8 shadow-inner">
          <span className="text-sm">💼</span>
          <span className="text-white text-xs font-semibold tracking-wider">
            50,000+
          </span>
          <span className="text-white/40 text-[10px] tracking-widest font-medium uppercase">
            New Jobs This Month
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-white font-semibold tracking-tight mb-5 text-4xl sm:text-5xl md:text-[54px] leading-[1.15]">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="text-white/40 text-sm md:text-[15px] max-w-[540px] leading-relaxed mb-10 font-normal">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-[620px] flex items-center border border-white/[0.08] rounded-xl bg-[#0a0a12]/70 backdrop-blur-xl p-1.5 shadow-2xl mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2 border-r border-white/[0.05]">
            <svg
              className="text-white/30 flex-shrink-0"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Job title, skill or company"
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              className="bg-transparent text-white placeholder-white/20 text-xs sm:text-sm outline-none w-full min-w-0 font-normal"
            />
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2">
            <svg
              className="text-white/30 flex-shrink-0"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              placeholder="Location or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-white placeholder-white/20 text-xs sm:text-sm outline-none w-full min-w-0 font-normal"
            />
          </div>

          <button className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#3b82f6] hover:bg-[#2563eb] active:scale-95 transition-all duration-150 shadow-lg shadow-blue-500/20">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Trending tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="text-white/30 text-xs font-normal mr-1">
            Trending Position
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              className="text-xs text-white/60 border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.08] hover:text-white rounded-full px-3.5 py-1 transition-all duration-150"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          GLOBE + OVERLAY TEXT (FIXED FOR HORIZON LOOK)
         ══════════════════════════════ */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8 overflow-visible">
        {/* কন্টেইনার বড় স্ক্রিনে অনেক চওড়া (w-[170%]) করা হয়েছে যাতে পৃথিবীটা বিশাল ও ছড়ানো দিগন্তের মতো লাগে */}
        <div className="relative w-[170%] md:w-[140%] lg:w-[115%] max-w-[1400px] aspect-[16/10] md:aspect-[16/9] mx-auto flex flex-col items-center justify-start overflow-visible">
          {/* গ্লোবের পেছনের নীল অ্যাটমোস্ফিয়ার গ্লো */}
          <div
            className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[60%] pointer-events-none z-0 blur-[110px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.45) 0%, rgba(29, 78, 216, 0.12) 55%, transparent 75%)',
            }}
          />

          {/* "Assisting..." টেক্সট পজিশন — যা গ্লোবের উপর একদম পারফেক্টলি ভাসবে */}
          <div className="absolute top-[28%] sm:top-[32%] md:top-[36%] z-20 pointer-events-none w-full px-4 text-center">
            <h2 className="text-white/95 text-xl sm:text-2xl md:text-[28px] font-light tracking-wide leading-snug drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
              Assisting over{' '}
              <span className="text-white font-medium">15,000 job seekers</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base md:text-lg font-light tracking-wide mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.98)]">
              find their dream positions.
            </p>
          </div>

          {/* গ্লোব ইমেজ কন্টেইনার — নেগেটিভ মার্জিন ব্যালেন্স করা হয়েছে যাতে নিচের কালো অংশটি নিচে নেমে যায় */}
          <div className="relative w-full h-full z-10 mb-[-12%] sm:mb-[-15%] md:mb-[-18%]">
            <Image
              src="/images/globe.png"
              alt="Global platform globe"
              fill
              priority
              className="object-contain select-none"
              style={{
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 90%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 90%)',
                filter: 'brightness(1.05) contrast(1.05)',
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════
            STATS CARDS (EXACT MATCH)
           ══════════════════════════════ */}
        {/* এখানে মডারেট নেগেটিভ মার্জিন দিয়ে কার্ডগুলোকে এমন জায়গায় রাখা হয়েছে যাতে গ্লোবের গায়ের কালো অংশ একদম ঢেকে যায় */}
        <div className="relative z-20 w-full max-w-[1040px] mx-auto px-4 -mt-[14%] sm:-mt-[16%] md:-mt-[20%] lg:-mt-[22%] grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.04] p-5 sm:p-6 flex flex-col justify-between aspect-[1.25/1] transition-all duration-300 hover:border-white/[0.08]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(10,10,15,0.85) 0%, rgba(5,5,8,0.99) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <div className="text-white/40 mb-4">{stat.icon}</div>
              <div>
                <div className="text-white text-3xl sm:text-[34px] font-semibold tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-white/30 text-xs sm:text-sm font-normal">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
