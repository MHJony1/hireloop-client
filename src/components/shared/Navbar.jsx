'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Browse Jobs', href: '/jobs' },
  { label: 'Company', href: '/company' },
  { label: 'Pricing', href: '/pricing' },
];

const Logo = () => (
  <Link href="/" className="flex items-center gap-3 shrink-0">
    <div
      className="w-10.5 h-10.5 rounded-full flex items-center justify-center shrink-0"
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

const NavLink = ({ href, label, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="text-[#cccccc] hover:text-white text-sm font-normal px-4 py-1.5 transition-colors duration-150 whitespace-nowrap"
  >
    {label}
  </Link>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-linear-to-r from-[#161622] via-[#111118] to-[#0e0e0e]">
      <div className="max-w-7xl mx-auto px-8 h-17 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0">
          <div className="flex items-center border border-[#2a2a2a] rounded-[10px] px-1 py-1 bg-[#161616]">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
          <div className="w-px h-5 bg-[#2e2e2e] mx-4" />
          <Link
            href="/auth/signin"
            className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium px-2 py-1.5 transition-colors duration-150 whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="ml-3 bg-white hover:bg-[#f0f0f0] text-[#111111] text-sm font-semibold px-5 py-2 rounded-[10px] transition-colors duration-150 whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#aaaaaa] hover:text-white p-1.5 rounded-md transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-t border-[#1e1e1e] px-6 py-5 flex flex-col gap-1">
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
          <div className="h-px bg-[#1e1e1e] my-3" />
          <Link
            href="/signin"
            onClick={() => setMenuOpen(false)}
            className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm font-medium py-2.5 px-3 transition-colors duration-150"
          >
            Sign In
          </Link>
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
