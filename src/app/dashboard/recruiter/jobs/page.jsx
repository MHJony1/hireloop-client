'use client';

import React, { useEffect, useState } from 'react';
import { Tooltip } from '@heroui/react';
import {
  Eye,
  Edit2,
  Trash2,
  Briefcase,
  MapPin,
  Wifi,
  Plus,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { getCompanyJobs } from '@/lib/api/jobs';
import Link from 'next/link';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
   THEME TOKENS  (HireLoop dark‑navy brand)
───────────────────────────────────────── */
const T = {
  bg: '#0f0f1a',
  surface: '#16162a',
  surfaceHover: '#1e1e35',
  border: '#2a2a45',
  headerBg: '#13132280',
  purple: '#7C3AED',
  purpleLight: '#9F67FA',
  text: '#e2e2f0',
  textMuted: '#6b6b8a',
  textSub: '#9494b8',
};

/* ── Skeleton row ── */
const SkeletonRow = () => (
  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
    {[55, 40, 30, 20, 15].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div
          className="h-3.5 rounded-md animate-pulse"
          style={{ width: `${w}%`, background: T.border }}
        />
      </td>
    ))}
  </tr>
);

/* ── Status badge ── */
const STATUS_CFG = {
  active: { bg: '#0d2e1a', text: '#34d47a', dot: '#34d47a', label: 'Active' },
  inactive: {
    bg: '#2e0d16',
    text: '#f56580',
    dot: '#f56580',
    label: 'Inactive',
  },
};
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status?.toLowerCase()] ?? {
    bg: '#2a220d',
    text: '#f5c542',
    dot: '#f5c542',
    label: status ?? 'Unknown',
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
};

/* ── Sort chevrons ── */
const SortIcon = ({ active, dir }) => (
  <span className="ml-1 inline-flex flex-col gap-[1px]">
    <ChevronUp
      className="w-2.5 h-2.5"
      style={{ color: active && dir === 'asc' ? T.purple : T.border }}
    />
    <ChevronDown
      className="w-2.5 h-2.5"
      style={{ color: active && dir === 'desc' ? T.purple : T.border }}
    />
  </span>
);

/* ── Action icon button ── */
const ActionBtn = ({
  icon: Icon,
  label,
  hoverColor,
  tooltipColor,
  onClick,
}) => (
  <Tooltip content={label} color={tooltipColor ?? 'default'} closeDelay={0}>
    <button
      aria-label={label}
      onClick={onClick}
      className="p-2 rounded-lg transition-all duration-150"
      style={{ color: T.textMuted, background: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.background = hoverColor + '18';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = T.textMuted;
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <Icon className="w-4 h-4" />
    </button>
  </Tooltip>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  // Get the actual company ID (এটা আপনার authentication system অনুযায়ী পরিবর্তন করুন)
  const getCurrentCompanyId = () => {
    // Option 1: From localStorage (if you store it during login)
    if (typeof window !== 'undefined') {
      const storedCompanyId = localStorage.getItem('companyId');
      if (storedCompanyId) return storedCompanyId;
    }

    // Option 2: From session/context
    // যদি আপনার কাছে companyId থাকে সেটা দিন

    // Option 3: যেই company এর job দেখাতে চান সেই ID দিন (টেস্টিং এর জন্য)
    return '6a252ea9040be68169292787'; // Uber's company ID
  };

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const companyId = getCurrentCompanyId();
      console.log("Fetching jobs for company:", companyId);
      
      const data = await getCompanyJobs(companyId, 'active');
      console.log("Fetched jobs data:", data);
      
      const jobsList = Array.isArray(data) ? data : data?.jobs || [];
      setJobs(jobsList);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const companyId = getCurrentCompanyId();
      console.log('Fetching jobs for company:', companyId);

      // Your API function call
      const data = await getCompanyJobs(companyId, 'active');
      console.log('Fetched jobs data:', data);

      // Check if data is array or has jobs property
      const jobsList = Array.isArray(data) ? data : data?.jobs || [];
      setJobs(jobsList);

      if (jobsList.length === 0) {
        console.log('No jobs found for this company');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...jobs].sort((a, b) => {
    if (!sortKey) return 0;
    let va = a[sortKey] ?? '';
    let vb = b[sortKey] ?? '';

    if (sortKey === 'createdAt') {
      va = new Date(va).getTime();
      vb = new Date(vb).getTime();
      return sortDir === 'asc' ? va - vb : vb - va;
    }

    va = va.toString().toLowerCase();
    vb = vb.toString().toLowerCase();
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const handleDeleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        // Add your delete API call here
        // await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
        toast.success('Job deleted successfully');
        fetchJobs(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const COLS = [
    { key: 'jobTitle', label: 'JOB TITLE', sortable: true },
    { key: 'jobType', label: 'TYPE / CATEGORY', sortable: true },
    { key: 'location', label: 'LOCATION', sortable: false },
    { key: 'status', label: 'STATUS', sortable: true },
    { key: 'actions', label: 'ACTIONS', sortable: false },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: T.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{
                background: `linear-gradient(135deg,${T.purple}33,${T.purple}55)`,
                border: `1px solid ${T.purple}44`,
              }}
            >
              <Briefcase className="w-5 h-5" style={{ color: T.purpleLight }} />
            </div>
            <div>
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ color: T.text }}
              >
                Manage All Jobs
              </h2>
              <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>
                View, update, and manage your current job postings at a glance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {!loading && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `linear-gradient(135deg,${T.purple},${T.purpleLight})`,
                  color: '#fff',
                  boxShadow: `0 4px 14px ${T.purple}55`,
                }}
              >
                {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
              </span>
            )}

            <Link href="/dashboard/recruiter/jobs/new">
              <button
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg,${T.purple},${T.purpleLight})`,
                  color: '#fff',
                  boxShadow: `0 4px 18px ${T.purple}44`,
                }}
              >
                <Plus className="w-4 h-4" />
                Post a Job
              </button>
            </Link>
          </div>
        </div>

        {/* ── Table card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            boxShadow: '0 8px 32px #00000044',
          }}
        >
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg,${T.purple},${T.purpleLight},transparent)`,
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: T.headerBg,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {COLS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none"
                      style={{
                        color:
                          sortKey === col.key ? T.purpleLight : T.textMuted,
                        textAlign: col.key === 'actions' ? 'center' : 'left',
                        cursor: col.sortable ? 'pointer' : 'default',
                        transition: 'color 0.15s',
                      }}
                    >
                      <span className="inline-flex items-center">
                        {col.label}
                        {col.sortable && (
                          <SortIcon
                            active={sortKey === col.key}
                            dir={sortDir}
                          />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Briefcase
                          className="w-10 h-10 opacity-20"
                          style={{ color: T.text }}
                        />
                        <p
                          className="text-sm font-medium"
                          style={{ color: T.textMuted }}
                        >
                          No job postings found
                        </p>
                        <Link href="/dashboard/recruiter/jobs/new">
                          <button
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                            style={{
                              background: `${T.purple}22`,
                              color: T.purpleLight,
                              border: `1px solid ${T.purple}44`,
                            }}
                          >
                            Create your first job
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sorted.map((job, idx) => {
                    // Properly handle MongoDB _id
                    const jobId = job._id?.$oid || job._id || job.id;

                    return (
                      <tr
                        key={jobId}
                        style={{
                          borderBottom:
                            idx < sorted.length - 1
                              ? `1px solid ${T.border}`
                              : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = T.surfaceHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = 'transparent')
                        }
                      >
                        <td className="px-5 py-4">
                          <Link href={`/dashboard/recruiter/jobs/${jobId}`}>
                            <span
                              className="font-semibold cursor-pointer transition-colors duration-150"
                              style={{ color: T.text }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = T.purpleLight)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = T.text)
                              }
                            >
                              {job.jobTitle}
                            </span>
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className="font-semibold capitalize"
                              style={{ color: T.text }}
                            >
                              {job.jobType}
                            </span>
                            <span
                              className="text-xs capitalize"
                              style={{ color: T.textMuted }}
                            >
                              {job.jobCategory}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {job.isRemote ? (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{
                                background: '#1a0d2e',
                                color: T.purpleLight,
                                border: `1px solid ${T.purple}44`,
                              }}
                            >
                              <Wifi className="w-3 h-3" /> Remote
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-sm"
                              style={{ color: T.textSub }}
                            >
                              <MapPin
                                className="w-3.5 h-3.5 shrink-0"
                                style={{ color: T.textMuted }}
                              />
                              {job.location || 'Not specified'}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={job.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-0.5">
                            <ActionBtn
                              icon={Eye}
                              label="View Details"
                              hoverColor={T.purpleLight}
                              onClick={() => {
                                window.location.href = `/dashboard/recruiter/jobs/${jobId}`;
                              }}
                            />
                            <ActionBtn
                              icon={Edit2}
                              label="Edit Job"
                              hoverColor="#f5a524"
                              onClick={() => {
                                window.location.href = `/dashboard/recruiter/jobs/edit/${jobId}`;
                              }}
                            />
                            <ActionBtn
                              icon={Trash2}
                              label="Delete Job"
                              hoverColor="#f56580"
                              tooltipColor="danger"
                              onClick={() => handleDeleteJob(jobId)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && sorted.length > 0 && (
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                borderTop: `1px solid ${T.border}`,
                background: '#13132280',
              }}
            >
              <p className="text-xs" style={{ color: T.textMuted }}>
                Showing{' '}
                <span style={{ color: T.textSub, fontWeight: 600 }}>
                  {sorted.length}
                </span>{' '}
                of{' '}
                <span style={{ color: T.textSub, fontWeight: 600 }}>
                  {jobs.length}
                </span>{' '}
                postings
              </p>
              <p className="text-xs" style={{ color: T.textMuted }}>
                Click column headers to sort
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobs;
