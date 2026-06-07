'use client';

import { useState } from 'react';
import JobCard from './JobCard';
import JobSearchFilter from './JobSearchFilter';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobSearchFilterWrapper({ initialJobs }) {
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilteredJobs = (jobs) => {
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Go to specific page
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Browse Jobs</h1>
          <p className="mt-1 text-sm text-gray-400">
            Find your next career opportunity
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 backdrop-blur-sm">
          <JobSearchFilter
            jobs={initialJobs}
            onFilteredJobs={handleFilteredJobs}
          />
        </div>

        {/* Results Header with Pagination Info */}
        <div className="mb-5 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-400" />
            <span className="text-sm text-gray-400">
              Showing{' '}
              <span className="font-medium text-white">
                {currentJobs.length}
              </span>{' '}
              of{' '}
              <span className="font-medium text-white">
                {filteredJobs.length}
              </span>{' '}
              jobs
            </span>
          </div>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {/* Jobs Grid */}
        {currentJobs.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {currentJobs.map((job, index) => (
                <JobCard key={job._id?.$oid || job._id || index} job={job} />
              ))}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'cursor-not-allowed bg-gray-800/50 text-gray-600'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && goToPage(page)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                          : page === '...'
                            ? 'cursor-default bg-transparent text-gray-500'
                            : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed bg-gray-800/50 text-gray-600'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            <p className="text-gray-400">No jobs match your filters</p>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
