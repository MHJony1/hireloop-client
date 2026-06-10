'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authClient } from '@/lib/auth-client';

const baseNavLinks = [
  { label: 'Browse Jobs', href: '/jobs' },
  { label: 'Company', href: '/companies' },
  { label: 'Pricing', href: '/pricing' },
];

const dashBoardLinks = {
  seeker: '/dashboard/seeker',
  recruiter: '/dashboard/recruiter',
  admin: '/dashboard/admin',
};

// Safe helper — never returns undefined
const getDashboardHref = (role) => dashBoardLinks[role] ?? '/dashboard/seeker';

// ─── Logo ───────────────────────────────────────────────
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

// ─── Avatar ─────────────────────────────────────────────
const Avatar = ({ user, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const sizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' };
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const isValidUrl = (url) => {
    if (!url) return false;
    const allowed = [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'i.ibb.co',
      'lh3.googleusercontent.com',
    ];
    try {
      const urlObj = new URL(url);
      return allowed.some((domain) => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const showImage = isValidUrl(user?.image) && !imgError;

  return (
    <div
      className={`${sizes[size]} rounded-full overflow-hidden ring-2 ring-[#6d28d9]/60 shrink-0 bg-gray-800`}
    >
      {showImage ? (
        <img
          src={user.image}
          alt={user?.name || 'User'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
          {initials}
        </div>
      )}
    </div>
  );
};

// ─── UserMenu ────────────────────────────────────────────
const UserMenu = ({ user, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const dashboardHref = getDashboardHref(user?.role);

  const dropdownItems = [
    {
      href: dashboardHref,
      label: 'Dashboard',
      icon: 'M1 1h5.5v5.5H1zM8.5 1H14v5.5H8.5zM1 8.5h5.5V14H1zM8.5 8.5H14V14H8.5z',
    },
    {
      href: '/profile',
      label: 'My Profile',
      icon: 'M7.5 2a3 3 0 100 6 3 3 0 000-6zM1.5 13.5c0-2.7 2.7-4.5 6-4.5s6 1.8 6 4.5',
    },
    {
      href: '/applications',
      label: 'Applications',
      icon: 'M2 1.5h11v12H2zM5 5.5h5M5 8h5M5 10.5h3',
    },
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 hover:bg-white/5 transition-colors"
      >
        <Avatar user={user} size="md" />
        <span className="hidden lg:block text-sm text-[#e5e5e5] font-medium max-w-[120px] truncate">
          {user?.name || 'Account'}
        </span>
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

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-xl border border-[#2a2a2a] shadow-2xl z-50 overflow-hidden bg-[rgba(15,15,20,0.97)] backdrop-blur-md">
            <div className="px-4 py-3 border-b border-[#1e1e1e]">
              <div className="flex items-center gap-3">
                <Avatar user={user} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {user?.name}
                  </p>
                  <p className="text-[#888] text-xs truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="py-1.5">
              {dropdownItems.map((item, i) => (
                <Link
                  key={`dropdown-${i}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#cccccc] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d={item.icon}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </div>

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
                    d="M5.5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2.5M10 10l3-2.5L10 5M13 7.5H6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── MobileMenu ──────────────────────────────────────────
const MobileMenu = ({ isOpen, onClose, user, onSignOut, navLinks }) => {
  const pathname = usePathname();
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t px-6 py-5 flex flex-col gap-1 bg-[rgba(10,8,20,0.98)] backdrop-blur-md">
      {navLinks.map((link, i) => (
        <Link
          key={`mobile-nav-${i}`}
          href={link.href}
          onClick={onClose}
          className={`text-sm py-2.5 px-3 rounded-lg transition-colors ${
            pathname === link.href
              ? 'text-white bg-white/10'
              : 'text-[#cccccc] hover:text-white hover:bg-white/5'
          }`}
        >
          {link.label}
        </Link>
      ))}

      <div className="h-px bg-[#1e1e2e] my-3" />

      {user ? (
        <>
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar user={user} size="lg" />
            <div>
              <p className="text-white text-sm font-semibold">{user.name}</p>
              <p className="text-[#888] text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="text-left text-[#f87171] text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-red-500/10"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/auth/signin"
          onClick={onClose}
          className="text-[#a78bfa] text-sm font-medium py-2.5 px-3"
        >
          Sign In
        </Link>
      )}

      <Link
        href="/register"
        onClick={onClose}
        className="mt-1 bg-white text-gray-900 text-sm font-semibold py-2.5 px-4 rounded-[10px] text-center"
      >
        Get Started
      </Link>
    </div>
  );
};

// ─── Main Navbar ─────────────────────────────────────────
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, refetch } = useAuth();

  const navLinks = [
    ...baseNavLinks,
    ...(user?.email
      ? [{ label: 'Dashboard', href: getDashboardHref(user?.role) }]
      : []),
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            await refetch();
            router.refresh();
            router.push('/auth/signin');
          },
        },
      });
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <nav
      className="w-full relative sticky top-0 z-50"
      style={{
        background:
          'linear-gradient(180deg, rgba(10,8,20,0.97) 0%, rgba(13,10,25,0.95) 60%, rgba(18,12,35,0.90) 100%)',
        borderBottom: '1px solid rgba(109,40,217,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0">
          <div className="flex items-center border rounded-[10px] px-1 py-1 border-[rgba(42,42,60,0.8)] bg-[rgba(20,18,35,0.7)] backdrop-blur-sm">
            {navLinks.map((link, i) => (
              <Link
                key={`desktop-nav-${i}`}
                href={link.href}
                className={`text-sm font-normal px-4 py-1.5 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'text-white bg-white/10'
                    : 'text-[#cccccc] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="w-px h-5 bg-[#2e2e3e] mx-4" />

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Link
              href="/auth/signin"
              className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium px-2 py-1.5"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/register"
            className="ml-3 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold px-5 py-2 rounded-[10px] transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#aaaaaa] hover:text-white p-1.5 rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
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

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onSignOut={handleSignOut}
        navLinks={navLinks}
      />
    </nav>
  );
};

export default Navbar;
