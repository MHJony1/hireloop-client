'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Fieldset,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Select,
  ListBox,
  Switch,
  Button,
} from '@heroui/react';
import { Briefcase, Globe } from '@gravity-ui/icons';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Award,
  RefreshCw,
} from 'lucide-react';
import { createJob } from '@/lib/actions/jobs';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { getRecruiterCompany } from '@/lib/api/companies';

export default function PostJobForm({ company: initialCompany }) {
  const [isRemote, setIsRemote] = useState(false);
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState(initialCompany);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Theme colors matching your dashboard
  const theme = {
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
    inputBg: '#1c1c1e',
    inputBorder: '#2a2a45',
  };

  // Refresh company data function
  const refreshCompanyData = async () => {
    setIsRefreshing(true);
    try {
      const updatedCompany = await getRecruiterCompany(company.recruiterId);
      if (updatedCompany) {
        setCompany(updatedCompany);
        toast.success('Company status refreshed!');
      }
    } catch (error) {
      console.error('Error refreshing company:', error);
      toast.error('Failed to refresh company data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Status configuration
  const statusConfig = {
    pending: {
      label: 'Pending Approval',
      icon: Clock,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      message:
        'Your company is pending admin approval. You cannot post jobs until approved.',
      canPost: false,
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      message: 'Your company is approved. You can now post jobs.',
      canPost: true,
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      message:
        'Your company profile has been rejected. Please contact support.',
      canPost: false,
    },
  };

  const companyStatus = company?.status?.toLowerCase() || 'pending';
  const status = statusConfig[companyStatus] || statusConfig.pending;
  const StatusIcon = status.icon;
  const canPostJobs = status.canPost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canPostJobs) {
      toast.error(
        status.message ||
          'Your company must be approved before you can post jobs.',
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!data.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (!data.jobCategory) newErrors.jobCategory = 'Job category is required';
    if (!data.jobType) newErrors.jobType = 'Job type is required';
    if (!data.minSalary) newErrors.minSalary = 'Minimum salary is required';
    if (!data.maxSalary) newErrors.maxSalary = 'Maximum salary is required';
    if (!isRemote && !data.location)
      newErrors.location = 'Location is required for non-remote roles';
    if (!data.deadline) newErrors.deadline = 'Application deadline is required';
    if (!data.responsibilities)
      newErrors.responsibilities = 'Responsibilities are required';
    if (!data.requirements)
      newErrors.requirements = 'Requirements are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 23) + 'Z';

    const payload = {
      jobTitle: data.jobTitle,
      jobCategory: data.jobCategory,
      jobType: data.jobType,
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
      currency: data.currency || 'EUR',
      location: data.location,
      deadline: data.deadline,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      benefits: data.benefits || '',
      isRemote: isRemote,
      companyId: company._id,
      companyName: company.name,
      companyLogo: company.logo,
      companyStatus: company.status,
      isPubliclyVisible: true,
      createdAt: {
        date: formattedDate,
      },
    };

    try {
      const res = await createJob(payload);

      if (res.insertedId) {
        toast.success('Job posted successfully!');
        e.target.reset();
        setIsRemote(false);
        setTimeout(() => {
          redirect('/dashboard/recruiter/jobs');
        }, 1500);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const textInputClass = `w-full text-white rounded-lg h-12 px-3 text-sm placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-[#7C3AED]/50`;
  const textAreaClass = `w-full text-white rounded-lg p-3 text-sm placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-[#7C3AED]/50`;

  // Auto-refresh every 30 seconds if pending
  useEffect(() => {
    if (companyStatus === 'pending') {
      const interval = setInterval(() => {
        refreshCompanyData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [companyStatus]);

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: theme.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Form Header */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: '0 8px 32px #00000044',
          }}
        >
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg,${theme.purple},${theme.purpleLight},transparent)`,
            }}
          />

          <div className="p-8">
            {/* Header content */}
            <div
              className="border-b pb-6 mb-8"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className="text-2xl font-semibold tracking-tight"
                    style={{ color: theme.text }}
                  >
                    Post a New Job
                  </h1>
                  <p
                    className="text-sm mt-1"
                    style={{ color: theme.textMuted }}
                  >
                    Fill out the details below to publish your open position.
                  </p>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={refreshCompanyData}
                  disabled={isRefreshing}
                  className="p-2 rounded-lg transition-all hover:bg-gray-800/50 disabled:opacity-50"
                  style={{ border: `1px solid ${theme.border}` }}
                  title="Refresh company status"
                >
                  <RefreshCw
                    size={16}
                    className={isRefreshing ? 'animate-spin' : ''}
                    style={{ color: theme.textMuted }}
                  />
                </button>
              </div>

              {/* Company information panel with dynamic status */}
              <div
                className="mt-4 rounded-lg px-4 py-3"
                style={{
                  background: theme.headerBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ background: theme.inputBg }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Briefcase size={14} style={{ color: theme.textMuted }} />
                      <span
                        className="text-xs"
                        style={{ color: theme.textMuted }}
                      >
                        Posting as:
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: theme.text }}
                      >
                        {company.name}
                      </span>

                      {/* Dynamic Status Badge */}
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          background: status.bg,
                          border: `1px solid ${status.border}`,
                          color: status.color,
                        }}
                      >
                        <StatusIcon size={10} />
                        {status.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-[10px]"
                        style={{ color: theme.textMuted }}
                      >
                        ID: {company._id?.slice(-12)}
                      </span>

                      {/* Status Message */}
                      <div
                        className="flex items-center gap-1.5 text-[10px]"
                        style={{ color: status.color }}
                      >
                        <AlertCircle size={10} />
                        {status.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disabled Form Overlay when company not approved */}
            <div className="relative">
              {!canPostJobs && (
                <div
                  className="absolute inset-0 rounded-xl z-10 flex items-center justify-center"
                  style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <div
                    className="text-center p-6 max-w-sm mx-auto"
                    style={{
                      background: theme.surface,
                      border: `1px solid ${status.border}`,
                      borderRadius: '1rem',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: status.bg }}
                    >
                      <StatusIcon size={24} style={{ color: status.color }} />
                    </div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: theme.text }}
                    >
                      Company {status.label}
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ color: theme.textMuted }}
                    >
                      {status.message}
                    </p>
                    {companyStatus === 'pending' && (
                      <div className="space-y-3">
                        <p className="text-xs" style={{ color: theme.textSub }}>
                          Please wait for admin approval. You will be notified
                          once approved.
                        </p>
                        <button
                          onClick={refreshCompanyData}
                          disabled={isRefreshing}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: theme.purple + '22',
                            color: theme.purpleLight,
                            border: `1px solid ${theme.purple}44`,
                          }}
                        >
                          <RefreshCw
                            size={12}
                            className={isRefreshing ? 'animate-spin' : ''}
                          />
                          Check Status
                        </button>
                      </div>
                    )}
                    {companyStatus === 'rejected' && (
                      <button
                        onClick={() => redirect('/dashboard/recruiter/company')}
                        className="text-sm font-medium mt-2 transition-colors"
                        style={{ color: theme.purpleLight }}
                      >
                        Update Company Profile →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Form - disabled when not approved */}
              <Form
                onSubmit={handleSubmit}
                className="space-y-8"
                validationErrors={errors}
                validationBehavior="aria"
              >
                {/* SECTION 1: Job Information */}
                <Fieldset className="space-y-6 w-full">
                  <legend
                    className="text-lg font-medium w-full pb-2 mb-2"
                    style={{
                      color: theme.textSub,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    Job Information
                  </legend>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        className="font-medium text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Job Title
                      </label>
                      <input
                        name="jobTitle"
                        placeholder="e.g. Senior Frontend Engineer"
                        disabled={!canPostJobs}
                        className={textInputClass}
                        style={{
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          color: theme.text,
                          opacity: !canPostJobs ? 0.6 : 1,
                        }}
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.jobTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label
                        className="font-medium text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Job Category
                      </label>
                      <select
                        name="jobCategory"
                        disabled={!canPostJobs}
                        className={textInputClass}
                        style={{
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          color: theme.text,
                          opacity: !canPostJobs ? 0.6 : 1,
                        }}
                      >
                        <option value="">Select category</option>
                        <option value="technology">Technology</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                      </select>
                      {errors.jobCategory && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.jobCategory}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        className="font-medium text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Job Type
                      </label>
                      <select
                        name="jobType"
                        disabled={!canPostJobs}
                        className={textInputClass}
                        style={{
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          color: theme.text,
                          opacity: !canPostJobs ? 0.6 : 1,
                        }}
                      >
                        <option value="">Select type</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                      {errors.jobType && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.jobType}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label
                          className="font-medium text-sm block"
                          style={{ color: theme.textMuted }}
                        >
                          Salary Range
                        </label>
                        <div className="flex gap-2">
                          <input
                            name="minSalary"
                            placeholder="Min"
                            type="number"
                            disabled={!canPostJobs}
                            className={textInputClass}
                            style={{
                              background: theme.inputBg,
                              border: `1px solid ${theme.inputBorder}`,
                              opacity: !canPostJobs ? 0.6 : 1,
                            }}
                          />
                          <input
                            name="maxSalary"
                            placeholder="Max"
                            type="number"
                            disabled={!canPostJobs}
                            className={textInputClass}
                            style={{
                              background: theme.inputBg,
                              border: `1px solid ${theme.inputBorder}`,
                              opacity: !canPostJobs ? 0.6 : 1,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <select
                          name="currency"
                          defaultValue="EUR"
                          disabled={!canPostJobs}
                          className={textInputClass}
                          style={{
                            background: theme.inputBg,
                            border: `1px solid ${theme.inputBorder}`,
                            color: theme.text,
                            opacity: !canPostJobs ? 0.6 : 1,
                          }}
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="BDT">BDT (৳)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <label
                          className="font-medium text-sm"
                          style={{ color: theme.textMuted }}
                        >
                          Location
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isRemote}
                            onChange={(e) => setIsRemote(e.target.checked)}
                            disabled={!canPostJobs}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: theme.textMuted }}
                          >
                            Remote
                          </span>
                        </label>
                      </div>

                      <input
                        name="location"
                        placeholder={
                          isRemote
                            ? 'Global / Remote'
                            : 'e.g. Chittagong, Dhaka'
                        }
                        disabled={isRemote || !canPostJobs}
                        className={textInputClass}
                        style={{
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          opacity: isRemote || !canPostJobs ? 0.6 : 1,
                        }}
                      />
                      {!isRemote && errors.location && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label
                        className="font-medium text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        disabled={!canPostJobs}
                        className={textInputClass}
                        style={{
                          background: theme.inputBg,
                          border: `1px solid ${theme.inputBorder}`,
                          opacity: !canPostJobs ? 0.6 : 1,
                        }}
                      />
                      {errors.deadline && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.deadline}
                        </p>
                      )}
                    </div>
                  </div>
                </Fieldset>

                {/* SECTION 2: Job Description */}
                <Fieldset className="space-y-6 w-full">
                  <legend
                    className="text-lg font-medium w-full pb-2 mb-2"
                    style={{
                      color: theme.textSub,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    Job Details & Description
                  </legend>

                  <div className="flex flex-col gap-1 w-full">
                    <label
                      className="font-medium text-sm"
                      style={{ color: theme.textMuted }}
                    >
                      Responsibilities
                    </label>
                    <textarea
                      name="responsibilities"
                      placeholder="Outline the core everyday responsibilities for this role..."
                      rows={4}
                      disabled={!canPostJobs}
                      className={textAreaClass}
                      style={{
                        background: theme.inputBg,
                        border: `1px solid ${theme.inputBorder}`,
                        opacity: !canPostJobs ? 0.6 : 1,
                      }}
                    />
                    {errors.responsibilities && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.responsibilities}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label
                      className="font-medium text-sm"
                      style={{ color: theme.textMuted }}
                    >
                      Requirements
                    </label>
                    <textarea
                      name="requirements"
                      placeholder="List required experience, skills, and certifications..."
                      rows={4}
                      disabled={!canPostJobs}
                      className={textAreaClass}
                      style={{
                        background: theme.inputBg,
                        border: `1px solid ${theme.inputBorder}`,
                        opacity: !canPostJobs ? 0.6 : 1,
                      }}
                    />
                    {errors.requirements && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.requirements}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label
                      className="font-medium text-sm"
                      style={{ color: theme.textMuted }}
                    >
                      Benefits (Optional)
                    </label>
                    <textarea
                      name="benefits"
                      placeholder="Perks, healthcare, equity, remote stipends..."
                      rows={3}
                      disabled={!canPostJobs}
                      className={textAreaClass}
                      style={{
                        background: theme.inputBg,
                        border: `1px solid ${theme.inputBorder}`,
                        opacity: !canPostJobs ? 0.6 : 1,
                      }}
                    />
                  </div>
                </Fieldset>

                {/* Form Actions */}
                <div
                  className="flex justify-end gap-3 pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <button
                    type="button"
                    onClick={() => redirect('/dashboard/recruiter/jobs')}
                    className="rounded-lg px-6 font-medium h-11 transition-all hover:bg-gray-800"
                    style={{
                      border: `1px solid ${theme.border}`,
                      color: theme.textSub,
                      background: 'transparent',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canPostJobs || isLoading}
                    className="font-semibold rounded-lg px-6 transition-all h-11 flex items-center gap-2"
                    style={{
                      background: !canPostJobs
                        ? theme.textMuted
                        : `linear-gradient(135deg,${theme.purple},${theme.purpleLight})`,
                      color: '#fff',
                      boxShadow: !canPostJobs
                        ? 'none'
                        : `0 4px 18px ${theme.purple}44`,
                      cursor:
                        !canPostJobs || isLoading ? 'not-allowed' : 'pointer',
                      opacity: !canPostJobs || isLoading ? 0.5 : 1,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Job'
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
