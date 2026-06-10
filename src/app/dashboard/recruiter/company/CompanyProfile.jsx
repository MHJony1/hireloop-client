'use client';

import React, { useState, useCallback } from 'react';
import { createCompany } from '@/lib/actions/companies';
import toast from 'react-hot-toast';

import {
  HiBuildingOffice2,
  HiGlobeAlt,
  HiMapPin,
  HiUsers,
  HiPencilSquare,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiArrowUpTray,
  HiArrowPath,
  HiBookmarkSquare,
  HiXMark,
  HiPlus,
  HiCalendarDays,
  HiSparkles,
} from 'react-icons/hi2';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

const industries = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'retail', label: 'Retail', icon: '🛍️' },
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { value: 'consulting', label: 'Consulting', icon: '🤝' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'design', label: 'Design', icon: '🎨' },
];

const employeeRanges = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

const statusConfig = {
  Pending: {
    icon: HiClock,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'shadow-amber-500/10',
  },
  Approved: {
    icon: HiCheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'shadow-emerald-500/10',
  },
  Rejected: {
    icon: HiExclamationCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    glow: 'shadow-red-500/10',
  },
};

const safeStr = (v) => (v == null ? '' : String(v));

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm ' +
  'placeholder-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 ' +
  'focus:outline-none transition-all duration-200 backdrop-blur-sm';

export default function CompanyProfile({ recruiter, recruiterCompany }) {
  const normalizeCompany = (c) => {
    if (!c) return null;
    return {
      _id: c._id?.toString?.() ?? c._id ?? '',
      name: safeStr(c.name),
      websiteUrl: safeStr(c.websiteUrl),
      industry: safeStr(c.industry) || 'technology',
      location: safeStr(c.location),
      employeeCount: safeStr(c.employeeCount) || '1-10 employees',
      description: safeStr(c.description),
      logo: safeStr(c.logo),
      status: safeStr(c.status) || 'Pending',
      createdAt: c.createdAt ?? null,
      socialLinks: {
        linkedin: safeStr(c.socialLinks?.linkedin),
        twitter: safeStr(c.socialLinks?.twitter),
      },
    };
  };

  const [company, setCompany] = useState(() =>
    normalizeCompany(recruiterCompany),
  );
  const [isEditing, setIsEditing] = useState(!recruiterCompany);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const buildForm = (src) => ({
    name: safeStr(src?.name),
    websiteUrl: safeStr(src?.websiteUrl),
    industry: safeStr(src?.industry) || 'technology',
    location: safeStr(src?.location),
    employeeCount: safeStr(src?.employeeCount) || '1-10 employees',
    description: safeStr(src?.description),
    logo: safeStr(src?.logo),
    socialLinks: {
      linkedin: safeStr(src?.socialLinks?.linkedin),
      twitter: safeStr(src?.socialLinks?.twitter),
    },
  });

  const [formData, setFormData] = useState(() => buildForm(recruiterCompany));
  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo must be < 5 MB');
      return;
    }
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        { method: 'POST', body: fd },
      );
      const data = await res.json();
      if (data.success) {
        set('logo', data.data.url);
        toast.success('Logo uploaded!');
      } else throw new Error();
    } catch {
      toast.error('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    if (!formData.websiteUrl.trim()) {
      toast.error('Website URL is required');
      return;
    }
    setLoading(true);
    const payload = {
      ...formData,
      recruiterId: recruiter?.id ?? recruiter?._id,
      status: company?.status ?? 'Pending',
      createdAt: company?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    try {
      const result = await createCompany(payload);
      if (result.success || result.data?.insertedId) {
        const saved = normalizeCompany({
          ...payload,
          _id: result.data?.insertedId ?? company?._id,
        });
        setCompany(saved);
        setIsEditing(false);
        toast.success(company ? 'Company updated!' : 'Company registered!');
        setTimeout(() => window.location.reload(), 1500);
      } else throw new Error(result.error ?? 'Save failed');
    } catch (err) {
      toast.error(err.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ══════════ EMPTY STATE ══════════ */
  if (!company?._id && !isEditing) {
    return (
      <div className="relative flex-1 min-h-screen flex items-center justify-center p-8 overflow-hidden">
        {/* bg glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
            <HiBuildingOffice2 size={42} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Company Yet</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Register your company to start posting jobs and managing
            applications.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
          >
            <HiPlus size={17} />
            Register Company
          </button>
        </div>
      </div>
    );
  }

  /* ══════════ VIEW MODE ══════════ */
  if (company && !isEditing) {
    const statusStyle = statusConfig[company.status] ?? statusConfig.Pending;
    const StatusIcon = statusStyle.icon;
    const industryLabel =
      industries.find((i) => i.value === company.industry)?.label ??
      company.industry ??
      '—';
    const memberSince = company.createdAt
      ? new Date(company.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : '—';

    return (
      <div className="relative flex-1 min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-indigo-950/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
          {/* ── Hero Header Card ── */}
          <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
            {/* subtle inner glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
              <div className="flex items-center gap-5">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shadow-xl">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiBuildingOffice2
                        size={30}
                        className="text-violet-400"
                      />
                    )}
                  </div>
                  {/* status dot */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0d0d0d] ${statusStyle.bg} flex items-center justify-center`}
                  >
                    <StatusIcon size={8} className={statusStyle.color} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                      {company.name || '—'}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                    >
                      <StatusIcon size={10} />
                      {company.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                    {company.websiteUrl && (
                      <a
                        href={
                          company.websiteUrl.startsWith('http')
                            ? company.websiteUrl
                            : `https://${company.websiteUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
                      >
                        <HiGlobeAlt size={12} />
                        {company.websiteUrl}
                      </a>
                    )}
                    {company.location && (
                      <span className="flex items-center gap-1.5">
                        <HiMapPin size={12} />
                        {company.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormData(buildForm(company));
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-white/60 hover:text-white text-sm rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <HiPencilSquare size={15} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: HiBuildingOffice2,
                label: 'Industry',
                value: industryLabel,
                color: 'text-violet-400',
                bg: 'bg-violet-400/10',
              },
              {
                icon: HiUsers,
                label: 'Team Size',
                value: company.employeeCount || '—',
                color: 'text-indigo-400',
                bg: 'bg-indigo-400/10',
              },
              {
                icon: HiCalendarDays,
                label: 'Member Since',
                value: memberSince,
                color: 'text-sky-400',
                bg: 'bg-sky-400/10',
              },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm group hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`p-2 ${bg} rounded-lg`}>
                    <Icon size={14} className={color} />
                  </div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                    {label}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Description ── */}
          {company.description && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HiSparkles size={14} className="text-violet-400" />
                <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                  About the Company
                </h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                {company.description}
              </p>
            </div>
          )}

          {/* ── Social Links ── */}
          {(company.socialLinks?.linkedin || company.socialLinks?.twitter) && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-4">
                Connect
              </h3>
              <div className="flex gap-2">
                {company.socialLinks?.linkedin && (
                  <a
                    href={company.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 rounded-xl transition-all duration-200 group"
                  >
                    <FaLinkedin
                      size={16}
                      className="text-white/30 group-hover:text-violet-400 transition-colors"
                    />
                  </a>
                )}
                {company.socialLinks?.twitter && (
                  <a
                    href={company.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 rounded-xl transition-all duration-200 group"
                  >
                    <FaTwitter
                      size={16}
                      className="text-white/30 group-hover:text-violet-400 transition-colors"
                    />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ══════════ EDIT / CREATE FORM ══════════ */
  return (
    <div className="relative flex-1 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-indigo-950/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* top glow line */}
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          {/* Form Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
            <div className="p-2.5 bg-violet-500/15 rounded-xl">
              <HiBuildingOffice2 size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {company ? 'Edit Company Profile' : 'Register Your Company'}
              </h2>
              <p className="text-xs text-white/30 mt-0.5">
                {company
                  ? 'Update your company information'
                  : 'Fill in the details to get started'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name + Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                  Company Name{' '}
                  <span className="text-red-400 normal-case">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls}
                  placeholder="e.g., Acme Corp"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                  Website URL{' '}
                  <span className="text-red-400 normal-case">*</span>
                </label>
                <div className="relative">
                  <HiGlobeAlt
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={formData.websiteUrl}
                    onChange={(e) => set('websiteUrl', e.target.value)}
                    className={`${inputCls} pl-10`}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>

            {/* Industry + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => set('industry', e.target.value)}
                  className={inputCls}
                >
                  {industries.map((ind) => (
                    <option
                      key={ind.value}
                      value={ind.value}
                      className="bg-[#1a1a2e]"
                    >
                      {ind.icon} {ind.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                  Location
                </label>
                <div className="relative">
                  <HiMapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => set('location', e.target.value)}
                    className={`${inputCls} pl-10`}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Team Size + Logo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                  Team Size
                </label>
                <select
                  value={formData.employeeCount}
                  onChange={(e) => set('employeeCount', e.target.value)}
                  className={inputCls}
                >
                  {employeeRanges.map((r) => (
                    <option key={r} value={r} className="bg-[#1a1a2e]">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                  Company Logo
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                    <div className="w-[52px] h-[52px] bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-200 overflow-hidden">
                      {uploadingLogo ? (
                        <HiArrowPath
                          size={18}
                          className="text-violet-400 animate-spin"
                        />
                      ) : formData.logo ? (
                        <img
                          src={formData.logo}
                          alt="logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <HiArrowUpTray size={17} className="text-white/20" />
                      )}
                    </div>
                  </label>
                  <div>
                    <p className="text-xs text-white/40">Click to upload</p>
                    <p className="text-xs text-white/20 mt-0.5">
                      PNG, JPG · max 5 MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className={`${inputCls} resize-none`}
                placeholder="Tell us about your company's mission, culture, and what makes you unique..."
              />
            </div>

            {/* Social */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">
                Social Media{' '}
                <span className="text-white/20 normal-case">(optional)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <FaLinkedin
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks?.linkedin ?? ''}
                    onChange={(e) =>
                      set('socialLinks', {
                        ...formData.socialLinks,
                        linkedin: e.target.value,
                      })
                    }
                    className={`${inputCls} pl-10`}
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div className="relative">
                  <FaTwitter
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks?.twitter ?? ''}
                    onChange={(e) =>
                      set('socialLinks', {
                        ...formData.socialLinks,
                        twitter: e.target.value,
                      })
                    }
                    className={`${inputCls} pl-10`}
                    placeholder="Twitter URL"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
              {company && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-sm rounded-xl transition-all duration-200"
                >
                  <HiXMark size={15} /> Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <HiArrowPath size={15} className="animate-spin" />
                    {company ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <HiBookmarkSquare size={15} />
                    {company ? 'Save Changes' : 'Create Company'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
