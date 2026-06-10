'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import {
  Gear,
  LayoutHeaderCellsLarge,
  Briefcase,
  FolderOpen,
  ChevronsUpWide,
  FolderPlus,
} from '@gravity-ui/icons';
import {
  Search,
  Bookmark,
  FileText,
  CreditCard,
  Users,
  Building2,
  DollarSign,
  Settings,
  LayoutDashboard,
} from 'lucide-react';

/* ─────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────── */
const T = {
  sidebar: '#0d0d1a',
  sidebarBorder: '#1e1e35',
  activeItem: '#16162e',
  hoverItem: '#12122299',
  purple: '#7C3AED',
  purpleLight: '#9F67FA',
  purpleGlow: '#7C3AED33',
  text: '#e2e2f0',
  textMuted: '#6b6b8a',
  textSub: '#9494b8',
  badge: '#13132a',
  badgeBorder: '#2a2a45',
};

/* ─────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────── */
const recruiterNavlinks = [
  {
    icon: LayoutHeaderCellsLarge,
    label: 'Dashboard',
    href: '/dashboard/recruiter',
  },
  {
    icon: ChevronsUpWide,
    label: 'My Company',
    href: '/dashboard/recruiter/company',
  },
  {
    icon: Briefcase,
    label: 'Manage Jobs',
    href: '/dashboard/recruiter/jobs',
  },
  {
    icon: FolderPlus,
    label: 'Create Job',
    href: '/dashboard/recruiter/jobs/new',
  },
  {
    icon: FolderOpen,
    label: 'Applications',
    href: '/dashboard/recruiter/applications',
  },
  {
    icon: Gear,
    label: 'Settings',
    href: '/dashboard/recruiter/settings',
  },
];

const seekerNavlinks = [
  {
    icon: LayoutHeaderCellsLarge,
    label: 'Dashboard',
    href: '/dashboard/seeker',
  },
  {
    icon: Search,
    label: 'Jobs',
    href: '/dashboard/seeker/jobs',
  },
  {
    icon: Bookmark,
    label: 'Saved Jobs',
    href: '/dashboard/seeker/saved-jobs',
  },
  {
    icon: FileText,
    label: 'Applications',
    href: '/dashboard/seeker/applications',
  },
  {
    icon: CreditCard,
    label: 'Billing',
    href: '/dashboard/seeker/billing',
  },
  {
    icon: Gear,
    label: 'Settings',
    href: '/dashboard/seeker/settings',
  },
];

// ✅ Admin Navigation Items
const adminNavlinks = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard/admin',
  },
  {
    icon: Users,
    label: 'Users',
    href: '/dashboard/admin/users',
  },
  {
    icon: Building2,
    label: 'Companies',
    href: '/dashboard/admin/companies',
  },
  {
    icon: Briefcase,
    label: 'Jobs',
    href: '/dashboard/admin/jobs',
  },
  {
    icon: DollarSign,
    label: 'Payments',
    href: '/dashboard/admin/payments',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/dashboard/admin/settings',
  },
];

const navLinksMap = {
  seeker: seekerNavlinks,
  recruiter: recruiterNavlinks,
  admin: adminNavlinks, // ✅ Admin role added
};

/* ─────────────────────────────────────────
   SINGLE NAV LINK
───────────────────────────────────────── */
const NavLink = ({ item, pathname, onClick, role }) => {
  const dashboardRoot =
    role === 'recruiter'
      ? '/dashboard/recruiter'
      : role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/seeker';

  const isActive =
    item.href === dashboardRoot
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="relative flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 group no-underline"
      style={{
        background: isActive ? T.activeItem : 'transparent',
        color: isActive ? T.text : T.textMuted,
        border: isActive
          ? `1px solid ${T.sidebarBorder}`
          : '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = T.hoverItem;
          e.currentTarget.style.color = T.textSub;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = T.textMuted;
        }
      }}
    >
      {/* Left glow bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full"
          style={{
            background: `linear-gradient(180deg,${T.purple},${T.purpleLight})`,
            boxShadow: `0 0 8px ${T.purple}`,
          }}
        />
      )}

      {/* Icon */}
      <item.icon
        style={{
          width: 17,
          height: 17,
          flexShrink: 0,
          color: isActive ? T.purpleLight : T.textMuted,
          transition: 'color 0.15s',
        }}
      />

      {/* Label */}
      <span className="flex-1">{item.label}</span>

      {/* Active dot */}
      {isActive && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            background: T.purpleLight,
            boxShadow: `0 0 6px ${T.purple}`,
          }}
        />
      )}
    </Link>
  );
};

/* ─────────────────────────────────────────
   SIDEBAR INNER CONTENT
───────────────────────────────────────── */
const SidebarContent = ({ user, isPending, pathname, onNavClick }) => {
  const role = user?.role || 'seeker';
  const navItems = navLinksMap[role] ?? seekerNavlinks;

  const dashboardRoot =
    role === 'recruiter'
      ? '/dashboard/recruiter'
      : role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/seeker';

  // Plan badge label
  const planLabel = user?.plan
    ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
    : 'Free';

  // Role display name
  const roleDisplay =
    {
      seeker: 'Job Seeker',
      recruiter: 'Recruiter',
      admin: 'Administrator',
    }[role] || role;

  return (
    <div
      className="flex flex-col h-full w-full select-none"
      style={{ background: T.sidebar, color: T.textMuted }}
    >
      {/* ── Logo ── */}
      <Link
        href={dashboardRoot}
        className="px-6 pt-7 pb-6 no-underline block"
        onClick={onNavClick}
      >
        <span
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: T.text }}
        >
          Hire<span style={{ color: T.purpleLight }}>Loop</span>
        </span>
      </Link>

      {/* ── User Profile Card ── */}
      <div
        className="mx-3 mb-4 p-3 rounded-xl"
        style={{
          background: T.activeItem,
          border: `1px solid ${T.sidebarBorder}`,
        }}
      >
        <div className="flex items-center gap-3">
          {user?.image ? (
            <div
              className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden"
              style={{ border: `2px solid ${T.purple}55` }}
            >
              <Image
                src={user.image}
                alt={user?.name || 'User'}
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div
              className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: `linear-gradient(135deg,${T.purple},${T.purpleLight})`,
                color: '#fff',
                boxShadow: `0 0 12px ${T.purpleGlow}`,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: T.text }}
            >
              {isPending ? 'Loading...' : user?.name || 'User'}
            </span>
            <span className="text-xs capitalize" style={{ color: T.textMuted }}>
              {roleDisplay}
            </span>
          </div>
        </div>

        {/* Plan badge - only for non-admin */}
        {role !== 'admin' && (
          <div
            className="mt-2.5 w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: T.badge,
              border: `1px solid ${T.badgeBorder}`,
              color: T.textSub,
            }}
          >
            {planLabel} Account
          </div>
        )}

        {/* Admin Badge */}
        {role === 'admin' && (
          <div
            className="mt-2.5 w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: `${T.purple}22`,
              border: `1px solid ${T.purple}44`,
              color: T.purpleLight,
            }}
          >
            Admin Access
          </div>
        )}
      </div>

      {/* ── Nav section label ── */}
      <p
        className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: T.textMuted }}
      >
        {role === 'admin' ? 'Admin Panel' : 'Navigation'}
      </p>

      {/* ── Nav links ── */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
            role={role}
          />
        ))}
      </nav>

      {/* ── Bottom version tag ── */}
      <div
        className="mx-3 mb-4 px-3 py-2.5 rounded-xl flex items-center justify-between"
        style={{
          background: T.badge,
          border: `1px solid ${T.badgeBorder}`,
        }}
      >
        <span className="text-xs" style={{ color: T.textMuted }}>
          HireLoop v2.0
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
          style={{
            background: `${T.purple}22`,
            color: T.purpleLight,
            border: `1px solid ${T.purple}44`,
          }}
        >
          {role === 'admin' ? 'Admin' : planLabel}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN EXPORT — client component only
───────────────────────────────────────── */
export function DashboardSidebar() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const role = user?.role || 'seeker';
  const dashboardRoot =
    role === 'recruiter'
      ? '/dashboard/recruiter'
      : role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/seeker';

  // Close drawer on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ════════ DESKTOP SIDEBAR ════════ */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-30"
        style={{
          background: T.sidebar,
          borderRight: `1px solid ${T.sidebarBorder}`,
        }}
      >
        <SidebarContent
          user={user}
          isPending={isPending}
          pathname={pathname}
          onNavClick={() => {}}
        />
      </aside>

      {/* ════════ MOBILE TOP BAR ════════ */}
      <div
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{
          background: T.sidebar,
          borderBottom: `1px solid ${T.sidebarBorder}`,
          boxShadow: '0 2px 16px #00000055',
        }}
      >
        <Link href={dashboardRoot} className="no-underline">
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{ color: T.text }}
          >
            Hire<span style={{ color: T.purpleLight }}>Loop</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl transition-all"
          style={{
            background: T.activeItem,
            border: `1px solid ${T.sidebarBorder}`,
            color: T.textSub,
          }}
          aria-label="Open menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* ════════ MOBILE DRAWER ════════ */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 lg:hidden"
            style={{
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed top-0 left-0 h-full z-50 lg:hidden flex flex-col"
            style={{
              width: 270,
              background: T.sidebar,
              borderRight: `1px solid ${T.sidebarBorder}`,
              boxShadow: '4px 0 32px #00000066',
              animation: 'slideIn 0.22s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* Close header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: `1px solid ${T.sidebarBorder}` }}
            >
              <span
                className="text-base font-extrabold"
                style={{ color: T.text }}
              >
                Hire<span style={{ color: T.purpleLight }}>Loop</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg"
                style={{ color: T.textMuted, background: T.activeItem }}
                aria-label="Close menu"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <SidebarContent
                user={user}
                isPending={isPending}
                pathname={pathname}
                onNavClick={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </>
  );
}
