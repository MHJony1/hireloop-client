'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';

const navLinks = [
  { label: 'Browse Jobs', href: '/jobs' },
  { label: 'Company', href: '/company' },
  { label: 'Pricing', href: '/pricing' },
];

// ─── Logo ────────────────────────────────────────────────────────────────────
const Logo = () => (
  <Link href="/" className="flex items-center gap-3 shrink-0">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 4L14 10L6 16"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className="text-[22px] font-bold tracking-tight leading-none">
      <span className="text-white">Hire</span>
      <span className="text-[#a78bfa]">Loop</span>
    </span>
  </Link>
);

// ─── Nav Link ─────────────────────────────────────────────────────────────────
const NavLink = ({ href, label, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="text-[#cccccc] hover:text-white text-sm font-normal px-4 py-1.5 transition-colors duration-150 whitespace-nowrap"
  >
    {label}
  </Link>
);

// ─── User Avatar Dropdown ─────────────────────────────────────────────────────
const UserMenu = ({ user, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 hover:bg-white/5 transition-colors duration-150 focus:outline-none"
        aria-label="User menu"
      >
        {/* Avatar image or fallback */}
        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#6d28d9]/60 shrink-0 relative">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Name (hidden on smaller screens) */}
        <span className="hidden lg:block text-sm text-[#e5e5e5] font-medium max-w-30 truncate">
          {user?.name || 'Account'}
        </span>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`text-[#888] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M3 5L7 9L11 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-xl border border-[#2a2a2a] shadow-2xl z-50 overflow-hidden"
          style={{
            background: 'rgba(15,15,20,0.97)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-[#1e1e1e]">
            <p className="text-white text-sm font-semibold truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-[#888] text-xs truncate mt-0.5">
              {user?.email || ''}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#cccccc] hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="5.5"
                  height="5.5"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="8.5"
                  y="1"
                  width="5.5"
                  height="5.5"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="1"
                  y="8.5"
                  width="5.5"
                  height="5.5"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="8.5"
                  y="8.5"
                  width="5.5"
                  height="5.5"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#cccccc] hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle
                  cx="7.5"
                  cy="5"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M1.5 13.5C1.5 11 4.2 9 7.5 9s6 2 6 4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              My Profile
            </Link>
            <Link
              href="/applications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#cccccc] hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect
                  x="2"
                  y="1.5"
                  width="11"
                  height="12"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M5 5.5h5M5 8h5M5 10.5h3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Applications
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-[#1e1e1e] py-1.5">
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f87171] hover:bg-red-500/10 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M5.5 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M10 10l3-2.5L10 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 7.5H6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/signin');
        },
      },
    });
  };

  return (
    <nav
      className="w-full relative"
      style={{
        background:
          'linear-gradient(180deg, rgba(10,8,20,0.97) 0%, rgba(13,10,25,0.95) 60%, rgba(18,12,35,0.90) 100%)',
        borderBottom: '1px solid rgba(109,40,217,0.12)',
        boxShadow:
          '0 1px 0 0 rgba(109,40,217,0.08), 0 4px 24px 0 rgba(109,40,217,0.06)',
      }}
    >
      {/* Subtle purple glow line at bottom — matches hero section */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2/3 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.35) 30%, rgba(109,40,217,0.5) 50%, rgba(139,92,246,0.35) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 h-17 flex items-center justify-between">
        <Logo />

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-0">
          {/* Nav links pill */}
          <div
            className="flex items-center border rounded-[10px] px-1 py-1"
            style={{
              borderColor: 'rgba(42,42,60,0.8)',
              background: 'rgba(20,18,35,0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <div className="w-px h-5 bg-[#2e2e3e] mx-4" />

          {/* Auth area — loading shimmer → signed in → signed out */}
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Link
              href="/auth/signin"
              className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium px-2 py-1.5 transition-colors duration-150 whitespace-nowrap"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/register"
            className="ml-3 bg-white hover:bg-[#f0f0f0] text-[#111111] text-sm font-semibold px-5 py-2 rounded-[10px] transition-colors duration-150 whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden text-[#aaaaaa] hover:text-white p-1.5 rounded-md transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M5 5L17 17M17 5L5 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 7H19M3 11H19M3 15H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-1"
          style={{
            background: 'rgba(10,8,20,0.98)',
            borderColor: 'rgba(30,28,50,0.9)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#cccccc] hover:text-white text-sm py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-[#1e1e2e] my-3" />

          {/* Mobile auth section */}
          {user ? (
            <div className="flex flex-col gap-1">
              {/* User info row */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#6d28d9]/50 shrink-0 relative">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background:
                          'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      }}
                    >
                      {(user.name || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">
                    {user.name}
                  </p>
                  <p className="text-[#888] text-xs mt-0.5 truncate max-w-45">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="text-left text-[#f87171] hover:text-red-400 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setMenuOpen(false)}
              className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium py-2.5 px-3 transition-colors duration-150"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="mt-1 bg-white hover:bg-[#f0f0f0] text-[#111111] text-sm font-semibold py-2.5 px-4 rounded-[10px] text-center transition-colors duration-150"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
