'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Send,
  AlertCircle,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

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

const companyData = {
  '6a252ea9040be6816929277d': 'Airbnb',
  '6a252ea9040be6816929277c': 'Adobe',
  '6a252ea9040be6816929277e': 'Amazon',
  '6a252ea9040be6816929277f': 'Apple',
  '6a252ea9040be68169292780': 'Google',
  '6a252ea9040be68169292781': 'Meta',
  '6a252ea9040be68169292782': 'Microsoft',
  '6a252ea9040be68169292783': 'Netflix',
  '6a252ea9040be68169292784': 'Nvidia',
  '6a252ea9040be68169292785': 'Spotify',
  '6a252ea9040be68169292786': 'Tesla',
  '6a252ea9040be68169292787': 'Uber',
};

const JobApply = ({ job, applicant }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [formValues, setFormValues] = useState({
    fullName: applicant?.name || '',
    email: applicant?.email || '',
    phone: '',
    currentCompany: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    source: '',
  });

  const companyName = companyData[job.companyId] || 'Company';
  const salaryRange = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const deadline = formatDeadline(job.deadline);
  const isExpired = deadline.text === 'Expired';

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      setResumeError('Resume is required');
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      setResumeError('Only PDF, DOC, or DOCX files are allowed');
      return false;
    }
    if (file.size > maxSize) {
      setResumeError('File size must be less than 5MB');
      return false;
    }
    setResumeError('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) validateFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired) {
      toast.error('This position is no longer accepting applications');
      return;
    }

    if (!resumeFile || !validateFile(resumeFile)) {
      toast.error('Please upload a valid resume');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert resume file to base64 for sending to your API
      const resumeBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(resumeFile);
        reader.onload = () => resolve(reader.result);
      });

      const applicationData = {
        jobId: job?._id?.$oid || job?._id,
        jobTitle: job.jobTitle,
        companyId: job.companyId,
        companyName: companyName,
        applicantId: applicant?.id,
        applicantName: formValues.fullName,
        applicantEmail: formValues.email,
        fullName: formValues.fullName,
        email: formValues.email,
        phone: formValues.phone,
        currentCompany: formValues.currentCompany,
        linkedin: formValues.linkedin,
        portfolio: formValues.portfolio,
        coverLetter: formValues.coverLetter,
        source: formValues.source,
        resumeFileName: resumeFile.name,
        resumeFileType: resumeFile.type,
        resumeFileSize: resumeFile.size,
        resumeData: resumeBase64,
      };

      console.log('applicant:', applicant);
      console.log('applicantId:', applicant?.id);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationData),
        },
      );

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setTimeout(() => {
          router.push(`/jobs/${job._id?.$oid || job._id}`);
        }, 1500);
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormValues({
      fullName: applicant?.name || '',
      email: applicant?.email || '',
      phone: '',
      currentCompany: '',
      linkedin: '',
      portfolio: '',
      coverLetter: '',
      source: '',
    });
    setResumeFile(null);
    setResumeError('');
    const fileInput = document.getElementById('resume-input');
    if (fileInput) fileInput.value = '';
    toast.success('Form has been reset');
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Application Closed
            </h2>
            <p className="text-gray-400 mb-4">
              This position is no longer accepting applications.
            </p>
            <Link
              href={`/jobs/${job._id?.$oid || job._id}`}
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
            >
              <ArrowLeft size={16} /> Back to Job Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/jobs/${job._id?.$oid || job._id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Job Details
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Job Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6">
              <div>
                <h3 className="text-xl font-bold text-white">{job.jobTitle}</h3>
                <p className="text-indigo-400 text-sm mt-1">{companyName}</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase size={16} className="text-indigo-400" />
                  <span className="text-gray-300 capitalize">
                    {job.jobType?.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-indigo-400" />
                  <span className="text-gray-300">
                    {job.location || 'Remote'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign size={16} className="text-indigo-400" />
                  <span className="text-gray-300">{salaryRange}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-indigo-400" />
                  <span
                    className={
                      deadline.color === 'red'
                        ? 'text-red-400'
                        : deadline.color === 'orange'
                          ? 'text-orange-400'
                          : 'text-gray-300'
                    }
                  >
                    {deadline.text}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Requirements
                </h4>
                <p className="text-xs text-gray-400">{job.requirements}</p>
              </div>
              {job.benefits && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    Benefits
                  </h4>
                  <p className="text-xs text-gray-400">{job.benefits}</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Submit Your Application
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Please fill out the form below to apply for this position
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="space-y-5"
              >
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formValues.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formValues.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Phone Number{' '}
                    <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-700 bg-gray-900/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    Show additional information (Optional)
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        Current Company
                      </label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formValues.currentCompany}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Your current company"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formValues.linkedin}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        Portfolio / GitHub
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formValues.portfolio}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="https://github.com/your-username"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        Cover Letter
                      </label>
                      <textarea
                        rows={3}
                        name="coverLetter"
                        value={formValues.coverLetter}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        placeholder="Tell us why you're a great fit..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        How did you hear about us?
                      </label>
                      <input
                        type="text"
                        name="source"
                        value={formValues.source}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="LinkedIn, Google, Referral, etc."
                      />
                    </div>
                  </div>
                </details>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Resume/CV <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-input"
                    className="flex items-center justify-between w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Upload size={18} className="text-indigo-400" />
                      <span className="text-sm text-gray-300">
                        {resumeFile ? resumeFile.name : 'Choose a file'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      PDF, DOC, DOCX (Max 5MB)
                    </span>
                  </label>
                  {resumeError && (
                    <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> {resumeError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{' '}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Submit Application
                      </>
                    )}
                  </button>
                  <button
                    type="reset"
                    className="flex-1 border border-gray-700 bg-gray-800/50 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all"
                  >
                    Reset Form
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500 pt-4">
                  By submitting this application, you agree to our Terms of
                  Service and Privacy Policy
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApply;
