// src/components/jobs/JobCard.jsx
'use client';

import { Card } from '@heroui/react';
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Award,
  ChevronRight,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  return `${currency} ${min?.toLocaleString() || 0}–${max?.toLocaleString() || 0}`;
};

const formatDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Last day';
  return `${diffDays} days left`;
};

const SafeImage = ({ src, alt, width, height, className }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gray-800 ${className}`}
        style={{ width, height }}
      >
        <Building2 size={24} className="text-gray-500" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgError(true)}
      unoptimized
    />
  );
};

export default function JobCard({ job }) {
  const company = companyData[job.companyId] || {
    name: 'Company',
    logo: 'https://i.ibb.co.com/rfGSH9Ls/adobe.png',
  };
  const salaryRange = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const daysLeft = formatDeadline(job.deadline);
  const jobId = job._id?.$oid || job._id || job.id;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20">
      {/* Premium gradient bar */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <Card.Header className="flex flex-row items-center gap-3 pb-2 pt-5 px-5">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-800 shadow-lg">
          <SafeImage
            src={company.logo}
            alt={company.name}
            width={40}
            height={40}
            className="object-contain p-1"
          />
        </div>
        <div className="flex-1">
          <Card.Title className="text-lg font-bold text-white">
            {job.jobTitle}
          </Card.Title>
          <Card.Description className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-medium text-indigo-400">{company.name}</span>
            <span>•</span>
            <span className="capitalize text-gray-500">
              {job.jobType?.replace('-', ' ')}
            </span>
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content className="space-y-3 px-5 py-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-2">
            <MapPin size={14} className="text-indigo-400" />
            <span className="text-xs text-gray-300">
              {job.location || 'Remote'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-2">
            <Briefcase size={14} className="text-indigo-400" />
            <span className="text-xs capitalize text-gray-300">
              {job.jobCategory}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-2">
            <DollarSign size={14} className="text-indigo-400" />
            <span className="text-xs text-gray-300">{salaryRange}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-2">
            <Clock size={14} className="text-indigo-400" />
            <span className="text-xs text-gray-300">{daysLeft}</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-2">
          <p className="line-clamp-2 text-xs text-gray-400">
            <span className="font-medium text-gray-300">Requirements:</span>{' '}
            {job.requirements}
          </p>
          {job.benefits && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <Award size={10} /> {job.benefits}
            </p>
          )}
        </div>
      </Card.Content>

      <Card.Footer className="border-t border-gray-800 px-5 py-3">
        <Link
          href={`/jobs/${jobId}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
        >
          Apply Now
          <ChevronRight size={14} />
        </Link>
      </Card.Footer>
     
    </Card>
  );
}
