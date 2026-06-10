'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateCompany } from '@/lib/actions/companies';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-4 transition-all hover:border-purple-500/30">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase();

  if (statusLower === 'pending') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 border border-orange-500/30 text-orange-400">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        <Clock size={10} />
        Pending
      </div>
    );
  }

  if (statusLower === 'approved') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/30 text-green-400">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <CheckCircle size={10} />
        Approved
      </div>
    );
  }

  if (statusLower === 'rejected') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <XCircle size={10} />
        Rejected
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 border border-gray-500/30 text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
      Unknown
    </div>
  );
};

const AdminCompaniesClient = ({ companies, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(null);
  const itemsPerPage = 8;

  const stats = {
    pending:
      companies?.filter((c) => c.status?.toLowerCase() === 'pending').length ||
      0,
    approved:
      companies?.filter((c) => c.status?.toLowerCase() === 'approved').length ||
      0,
    rejected:
      companies?.filter((c) => c.status?.toLowerCase() === 'rejected').length ||
      0,
  };

  const filteredCompanies =
    companies?.filter((company) => {
      const matchesSearch =
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' &&
          company.status?.toLowerCase() === 'pending') ||
        (statusFilter === 'approved' &&
          company.status?.toLowerCase() === 'approved') ||
        (statusFilter === 'rejected' &&
          company.status?.toLowerCase() === 'rejected');

      return matchesSearch && matchesStatus;
    }) || [];

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ✅ আপডেটেড handleStatusUpdate - আপনার updateCompany action ব্যবহার করে
  const handleStatusUpdate = async (companyId, newStatus) => {
    setIsUpdating(companyId);

    try {
      const result = await updateCompany(companyId, { status: newStatus });

      if (result?.success || result?.acknowledged) {
        toast.success(`Company ${newStatus} successfully!`);
        // 1 সেকেন্ড পর পেজ রিলোড
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result?.error || 'Failed to update company status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsUpdating(null);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Company Registrations
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Review and manage corporate entity access requests for the
                HireLoop ecosystem.
              </p>
            </div>
            <Link
              href="/dashboard/admin/companies/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Plus size={16} />
              Register New
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            color="bg-orange-500/20"
          />
          <StatCard
            title="Approved Partners"
            value={stats.approved}
            icon={CheckCircle}
            color="bg-green-500/20"
          />
          <StatCard
            title="Total Rejections"
            value={stats.rejected}
            icon={XCircle}
            color="bg-red-500/20"
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
              placeholder="Search by company name, email or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:bg-gray-800/50'
                }`}
              >
                {status === 'all'
                  ? 'All'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Table */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recruiter Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => {
                    const statusLower = company.status?.toLowerCase();
                    const isCurrentUpdating = isUpdating === company._id;

                    return (
                      <tr
                        key={company._id}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Logo using normal img tag */}
                            {company.logo ? (
                              <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                                <Building2
                                  size={14}
                                  className="text-purple-400"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium text-sm group-hover:text-purple-400 transition-colors">
                                {company.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                ID: {company._id?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-500" />
                            <span className="text-gray-300 text-sm">
                              {company.email || company.recruiterEmail || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-gray-500" />
                            <span className="text-gray-300 text-sm capitalize">
                              {company.industry || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={company.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            <span className="text-gray-400 text-sm">
                              {formatDate(company.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {statusLower === 'pending' && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(company._id, 'Approved')
                                  }
                                  disabled={isCurrentUpdating}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isCurrentUpdating ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    'Approve'
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(company._id, 'Rejected')
                                  }
                                  disabled={isCurrentUpdating}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isCurrentUpdating ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    'Reject'
                                  )}
                                </button>
                              </>
                            )}
                            {statusLower === 'approved' && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(company._id, 'Rejected')
                                }
                                disabled={isCurrentUpdating}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {isCurrentUpdating ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  'Reject'
                                )}
                              </button>
                            )}
                            {statusLower === 'rejected' && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(company._id, 'Approved')
                                }
                                disabled={isCurrentUpdating}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {isCurrentUpdating ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  'Approve'
                                )}
                              </button>
                            )}
                            <Link
                              href={`/dashboard/admin/companies/${company._id}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-purple-400 transition-colors"
                            >
                              <Eye size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Building2 size={48} className="text-gray-600" />
                        <p className="text-gray-400">No companies found</p>
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
                {Math.min(currentPage * itemsPerPage, filteredCompanies.length)}{' '}
                of {filteredCompanies.length} companies
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AdminCompaniesClient;
