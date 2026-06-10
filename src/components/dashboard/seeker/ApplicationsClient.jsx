'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Building2,
  Calendar,
  Eye,
  Star,
  Users,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  XCircle,
  Clock,
  Award,
} from 'lucide-react';

// Company logos mapping - আপনার public/logos ফোল্ডারের সাথে ম্যাচিং
const companyLogos = {
  Google: '/logos/google.png',
  Microsoft: '/logos/microsoft.png',
  Apple: '/logos/apple.png',
  Amazon: '/logos/amazon.png',
  Meta: '/logos/meta.png',
  Netflix: '/logos/netflix.png',
  Adobe: '/logos/adobe.png',
  Airbnb: '/logos/airbnb.png',
  Uber: '/logos/uber.png',
  Tesla: '/logos/tesla.png',
  Spotify: '/logos/spotify.png',
  Nvidia: '/logos/nvidia.png',
  'Stark Industries': '/logos/stark.png',
  'Cyberdyne Systems': '/logos/cyberdyne.png',
  'Wayne Enterprises': '/logos/wayne.png',
  'Oscorp Tech': '/logos/oscorp.png',
  'Hooli Corp': '/logos/hooli.png',
};

// Fallback component when logo not found
const CompanyAvatar = ({ companyName }) => {
  const initial = companyName?.charAt(0) || 'C';
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED]/20 to-[#9F67FA]/20 border border-[#7C3AED]/30 flex items-center justify-center">
      <span className="text-[#9F67FA] text-sm font-bold">{initial}</span>
    </div>
  );
};

// Status configuration with HireLoop theme colors
const statusConfig = {
  Applied: {
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    label: 'Applied',
  },
  Review: {
    icon: Eye,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    label: 'Under Review',
  },
  Shortlisted: {
    icon: Star,
    color: 'text-[#9F67FA]',
    bg: 'bg-[#7C3AED]/10',
    border: 'border-[#7C3AED]/30',
    label: 'Shortlisted',
  },
  Interview: {
    icon: Users,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    label: 'Interview',
  },
  Offered: {
    icon: Award,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    label: 'Offered',
  },
  Rejected: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Rejected',
  },
};

const getStatusColor = (status) => {
  return statusConfig[status] || statusConfig.Applied;
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-4 transition-all hover:border-[#7C3AED]/30 hover:shadow-lg hover:shadow-[#7C3AED]/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

const ApplicationsClient = ({ applications, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stats = {
    total: applications?.length || 0,
    shortlisted:
      applications?.filter((app) => app.status === 'Shortlisted').length || 0,
    interviews:
      applications?.filter((app) => app.status === 'Interview').length || 0,
    offered:
      applications?.filter((app) => app.status === 'Offered').length || 0,
  };

  stats.successRate =
    stats.total > 0 ? Math.round((stats.offered / stats.total) * 100) : 0;

  const filteredApplications =
    applications?.filter((app) => {
      const matchesSearch =
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Applications</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Applied"
            value={stats.total}
            icon={FileText}
            color="bg-blue-500/20"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={Star}
            color="bg-[#7C3AED]/20"
          />
          <StatCard
            title="Interviews"
            value={stats.interviews}
            icon={Users}
            color="bg-indigo-500/20"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={TrendingUp}
            color="bg-green-500/20"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]/50 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            {[
              'all',
              'Applied',
              'Review',
              'Shortlisted',
              'Interview',
              'Offered',
              'Rejected',
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[#7C3AED]/20 text-[#9F67FA] border border-[#7C3AED]/40'
                    : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.length > 0 ? (
                  paginatedApplications.map((app, index) => {
                    const StatusIcon = getStatusColor(app.status).icon;
                    const statusStyle = getStatusColor(app.status);
                    const logoPath = companyLogos[app.companyName];

                    return (
                      <tr
                        key={app._id || index}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium text-sm group-hover:text-[#9F67FA] transition-colors">
                              {app.jobTitle}
                            </p>
                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                              <Briefcase size={10} />
                              {app.jobType || 'Full-time'} •{' '}
                              {app.location || 'Remote'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Company Logo */}
                            {logoPath ? (
                              <div className="relative w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden flex-shrink-0">
                                <Image
                                  src={logoPath}
                                  alt={app.companyName}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            ) : (
                              <CompanyAvatar companyName={app.companyName} />
                            )}
                            <div className="flex flex-col">
                              <span className="text-gray-300 text-sm font-medium">
                                {app.companyName}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {app.companyIndustry || 'Company'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            <span className="text-gray-400 text-sm">
                              {formatDate(app.appliedAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}
                          >
                            <StatusIcon size={12} />
                            {statusStyle.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/seeker/applications/${app._id}`}
                            className="inline-flex items-center gap-1.5 text-[#9F67FA] hover:text-[#7C3AED] text-sm font-medium transition-colors"
                          >
                            <Eye size={14} />
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={48} className="text-gray-600" />
                        <p className="text-gray-400">No applications found</p>
                        <Link
                          href="/jobs"
                          className="text-[#9F67FA] hover:text-[#7C3AED] text-sm font-medium transition-colors"
                        >
                          Browse Jobs →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 flex-wrap gap-3">
              <p className="text-sm text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredApplications.length,
                )}{' '}
                of {filteredApplications.length} applications
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-[#7C3AED]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-[#7C3AED]/20 text-[#9F67FA] border border-[#7C3AED]/40'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-[#7C3AED]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsClient;
