'use client';

import Link from 'next/link';

const productLinks = [
  { label: 'Job discovery', href: '/job-discovery' },
  { label: 'Worker AI', href: '/worker-ai' },
  { label: 'Companies', href: '/companies' },
  { label: 'Salary data', href: '/salary-data' },
];

const navigationLinks = [
  { label: 'Help center', href: '/help' },
  { label: 'Career library', href: '/career-library' },
  { label: 'Contact', href: '/contact' },
];

const resourceLinks = [
  { label: 'Brand Guideline', href: '/brand-guideline' },
  { label: 'Newsroom', href: '/newsroom' },
];

const Logo = () => (
  <Link href="/" className="flex items-center gap-3 flex-shrink-0">
    <div
      className="w-[42px] h-[42px] rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6 4L14 10L6 16" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span className="text-[22px] font-bold tracking-tight leading-none">
      <span className="text-white">Hire</span>
      <span className="text-[#a78bfa]">Loop</span>
    </span>
  </Link>
);

const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col gap-4">
    <h4 className="text-[#7c6af7] text-sm font-semibold tracking-wide">{title}</h4>
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-[#b0b0b8] hover:text-white text-sm transition-colors duration-150">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#161622] via-[#111118] to-[#0e0e0e] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 pt-14 pb-8">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          <div className="flex flex-col gap-5 max-w-[260px]">
            <Logo />
            <p className="text-[#7a7a85] text-sm leading-relaxed">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-20">
            <FooterColumn title="Products" links={productLinks} />
            <FooterColumn title="Navigations" links={navigationLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
          </div>
        </div>

        <div className="h-px bg-white/5 mt-14 mb-7" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="https://facebook.com" target="_blank" className="w-9 h-9 rounded-lg bg-[#1a1a2a] hover:bg-[#222235] border border-white/10 flex items-center justify-center transition-colors duration-150">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#b0b0b8">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </Link>
            <Link href="https://pinterest.com" target="_blank" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="w-9 h-9 rounded-lg bg-[#1a1a2a] hover:bg-[#222235] border border-white/10 flex items-center justify-center transition-colors duration-150">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#b0b0b8">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <span className="text-[#555560] text-xs">Copyright 2024 —Programming Hero</span>
            <div className="flex items-center gap-3">
              <Link href="/terms" className="text-[#7c6af7] hover:text-[#a78bfa] text-xs transition-colors duration-150">Terms & Policy</Link>
              <span className="text-[#333340] text-xs">-</span>
              <Link href="/privacy" className="text-[#7c6af7] hover:text-[#a78bfa] text-xs transition-colors duration-150">Privacy Guideline</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;