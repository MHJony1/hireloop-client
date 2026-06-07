import { getJobById } from '@/lib/api/jobs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Award,
  Calendar,
  ArrowLeft,
  Globe,
  CheckCircle,
  Zap,
} from 'lucide-react';

// Company data mapping
const companyData = {
  '6a252ea9040be6816929277d': {
    name: 'Airbnb',
    logo: 'https://i.ibb.co.com/LhHTjQxB/airbnb.png',
  },
  '6a252ea9040be6816929277c': {
    name: 'Adobe',
    logo: 'https://i.ibb.co.com/rfGSH9Ls/adobe.png',
  },
  '6a252ea9040be6816929277e': {
    name: 'Amazon',
    logo: 'https://i.ibb.co.com/0jdx7xpB/amazon.png',
  },
  '6a252ea9040be6816929277f': {
    name: 'Apple',
    logo: 'https://i.ibb.co.com/9mgFt7pS/apple.png',
  },
  '6a252ea9040be68169292780': {
    name: 'Google',
    logo: 'https://i.ibb.co.com/fGdQMjN7/google.png',
  },
  '6a252ea9040be68169292781': {
    name: 'Meta',
    logo: 'https://i.ibb.co.com/0p9GkL2Y/meta.png',
  },
  '6a252ea9040be68169292782': {
    name: 'Microsoft',
    logo: 'https://i.ibb.co.com/mV4SFGR2/microsoft.png',
  },
  '6a252ea9040be68169292783': {
    name: 'Netflix',
    logo: 'https://i.ibb.co.com/JDRNm8N/netflix.png',
  },
  '6a252ea9040be68169292784': {
    name: 'Nvidia',
    logo: 'https://i.ibb.co.com/BK5jKKSp/nvidia.png',
  },
  '6a252ea9040be68169292785': {
    name: 'Spotify',
    logo: 'https://i.ibb.co.com/dwJ6nbWQ/spotify.png',
  },
  '6a252ea9040be68169292786': {
    name: 'Tesla',
    logo: 'https://i.ibb.co.com/z1Sybg3/tesla.png',
  },
  '6a252ea9040be68169292787': {
    name: 'Uber',
    logo: 'https://i.ibb.co.com/MxdCqrKF/uber.png',
  },
};

const formatSalary = (min, max, currency) => {
  return `${currency} ${Number(min)?.toLocaleString() || 0} – ${Number(max)?.toLocaleString() || 0}`;
};

const formatDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: 'Expired', color: 'red' };
  if (diffDays === 0) return { text: 'Last day today', color: 'orange' };
  if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'orange' };
  return { text: `${diffDays} days left`, color: 'green' };
};

const JobDetailsPage = async ({ params }) => {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) notFound();

  const company = companyData[job.companyId] || {
    name: 'Company',
    logo: 'https://i.ibb.co.com/rfGSH9Ls/adobe.png',
  };

  const salaryRange = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const deadline = formatDeadline(job.deadline);
  const isExpired = deadline.text === 'Expired';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Navigation - This works */}
        <Link
          href="/jobs"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-all hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to all jobs
        </Link>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-3 shadow-xl backdrop-blur-sm">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white md:text-4xl">
                        {job.jobTitle}
                      </h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-indigo-400 font-semibold">
                          {company.name}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                        <span className="capitalize text-gray-300">
                          {job.jobType?.replace('-', ' ')}
                        </span>
                        {job.isRemote && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-gray-600" />
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Globe size={14} />
                              Remote
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isExpired && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 border border-green-500/20">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <MapPin size={18} className="mb-2 text-indigo-400" />
                <p className="text-sm text-gray-400">Location</p>
                <p className="mt-1 font-semibold text-white">{job.location}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <Briefcase size={18} className="mb-2 text-indigo-400" />
                <p className="text-sm text-gray-400">Category</p>
                <p className="mt-1 font-semibold capitalize text-white">
                  {job.jobCategory}
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <DollarSign size={18} className="mb-2 text-indigo-400" />
                <p className="text-sm text-gray-400">Salary Range</p>
                <p className="mt-1 font-semibold text-white">{salaryRange}</p>
              </div>
              <div
                className={`rounded-xl border p-4 ${
                  deadline.color === 'red'
                    ? 'border-red-500/30 bg-red-500/10'
                    : deadline.color === 'orange'
                      ? 'border-orange-500/30 bg-orange-500/10'
                      : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <Clock
                  size={18}
                  className={`mb-2 ${
                    deadline.color === 'red'
                      ? 'text-red-400'
                      : deadline.color === 'orange'
                        ? 'text-orange-400'
                        : 'text-indigo-400'
                  }`}
                />
                <p className="text-sm text-gray-400">Deadline</p>
                <p
                  className={`mt-1 font-semibold ${
                    deadline.color === 'red'
                      ? 'text-red-400'
                      : deadline.color === 'orange'
                        ? 'text-orange-400'
                        : 'text-white'
                  }`}
                >
                  {deadline.text}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Zap size={20} className="text-indigo-400" />
                Job Description
              </h2>
              <p className="mt-4 leading-relaxed text-gray-300">
                {job.responsibilities || 'No description provided.'}
              </p>
            </div>

            {/* Requirements Section */}
            <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <CheckCircle size={20} className="text-indigo-400" />
                Requirements
              </h2>
              <div className="mt-4">
                <p className="leading-relaxed text-gray-300">
                  {job.requirements || 'No specific requirements listed.'}
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            {job.benefits && (
              <div className="mt-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm md:p-8">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <Award size={20} className="text-indigo-400" />
                  Benefits & Perks
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {job.benefits.split(',').map((benefit, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 border border-indigo-500/20"
                    >
                      <CheckCircle size={14} />
                      {benefit.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Apply Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Apply Card */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white">
                  Ready to apply?
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Join {company.name} and take your career to the next level
                </p>

                {/* Deadline Info */}
                <div
                  className={`mt-4 rounded-xl p-4 ${
                    deadline.color === 'red'
                      ? 'bg-red-500/10 border border-red-500/20'
                      : deadline.color === 'orange'
                        ? 'bg-orange-500/10 border border-orange-500/20'
                        : 'bg-indigo-500/10 border border-indigo-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={16}
                      className={
                        deadline.color === 'red'
                          ? 'text-red-400'
                          : deadline.color === 'orange'
                            ? 'text-orange-400'
                            : 'text-indigo-400'
                      }
                    />
                    <span
                      className={`text-sm ${
                        deadline.color === 'red'
                          ? 'text-red-400'
                          : deadline.color === 'orange'
                            ? 'text-orange-400'
                            : 'text-indigo-400'
                      }`}
                    >
                      {isExpired
                        ? 'Applications Closed'
                        : `Apply by ${new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                    </span>
                  </div>
                </div>

                {/* Apply Button - Just UI, no functionality */}
                <button
                  disabled={isExpired}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white ${
                    isExpired
                      ? 'cursor-not-allowed bg-gray-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                  }`}
                >
                  {isExpired ? 'Position Closed' : 'Apply Now'}
                </button>

                {!isExpired && (
                  <p className="mt-3 text-center text-xs text-gray-500">
                    Submit your application to this position
                  </p>
                )}

                {/* Company Stats */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <Briefcase
                        size={18}
                        className="mx-auto text-indigo-400"
                      />
                      <p className="mt-1 text-sm font-semibold text-white">
                        Top Tier
                      </p>
                      <p className="text-xs text-gray-500">Company</p>
                    </div>
                    <div className="text-center">
                      <Globe size={18} className="mx-auto text-indigo-400" />
                      <p className="mt-1 text-sm font-semibold text-white">
                        Global
                      </p>
                      <p className="text-xs text-gray-500">Opportunity</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900/30 p-4">
                <h4 className="text-sm font-semibold text-white">
                  💡 Application Tips
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-gray-400">
                  <li>• Tailor your resume to this role</li>
                  <li>• Highlight relevant experience</li>
                  <li>• Include a cover letter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
