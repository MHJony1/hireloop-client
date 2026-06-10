'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

// Company data mapping for search
const companyNameMap = {
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

export default function JobSearchFilter({ jobs, onFilteredJobs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobCategory: '',
    jobType: '',
    location: '',
    minSalary: '',
    isRemote: '',
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const filterOptions = useMemo(() => {
    if (!jobs || jobs.length === 0)
      return { categories: [], types: [], locations: [] };

    return {
      categories: [
        ...new Set(jobs.map((job) => job.jobCategory).filter(Boolean)),
      ],
      types: [...new Set(jobs.map((job) => job.jobType).filter(Boolean))],
      locations: [...new Set(jobs.map((job) => job.location).filter(Boolean))],
    };
  }, [jobs]);

  useEffect(() => {
    if (!jobs) return;

    let filtered = [...jobs];

    // Enhanced Search - searches in jobTitle, company name, and category
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((job) => {
        // Get company name
        const companyName = companyNameMap[job.companyId] || '';

        // Search in job title
        const matchesTitle = job.jobTitle?.toLowerCase().includes(searchLower);

        // Search in company name
        const matchesCompany = companyName.toLowerCase().includes(searchLower);

        // Search in job category
        const matchesCategory = job.jobCategory
          ?.toLowerCase()
          .includes(searchLower);

        return matchesTitle || matchesCompany || matchesCategory;
      });
    }

    // Category filter
    if (filters.jobCategory) {
      filtered = filtered.filter(
        (job) => job.jobCategory === filters.jobCategory,
      );
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((job) => job.location === filters.location);
    }

    // Remote filter
    if (filters.isRemote) {
      const isRemoteValue = filters.isRemote === 'true';
      filtered = filtered.filter((job) => job.isRemote === isRemoteValue);
    }

    // Salary filter
    if (filters.minSalary) {
      filtered = filtered.filter(
        (job) => parseInt(job.minSalary) >= parseInt(filters.minSalary),
      );
    }

    onFilteredJobs(filtered);
  }, [searchTerm, filters, jobs, onFilteredJobs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      jobCategory: '',
      jobType: '',
      location: '',
      minSalary: '',
      isRemote: '',
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some((v) => v) || searchTerm;

  return (
    <div className="space-y-4">
      {/* Search Bar - Full Width */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search by job title, company, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search hint - shows what can be searched */}

      {/* Filter Toggle Button for Mobile */}
      <button
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white transition-all hover:border-indigo-500 hover:bg-gray-800 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs text-white">
              {Object.values(filters).filter((v) => v).length +
                (searchTerm ? 1 : 0)}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${isFiltersVisible ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filters Section */}
      <div
        className={`space-y-4 ${isFiltersVisible ? 'block' : 'hidden lg:block'}`}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Category Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Category
            </label>
            <select
              value={filters.jobCategory}
              onChange={(e) =>
                handleFilterChange('jobCategory', e.target.value)
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Job Type
            </label>
            <select
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              {filterOptions.types.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type?.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Locations</option>
              {filterOptions.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Remote Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Work Type
            </label>
            <select
              value={filters.isRemote}
              onChange={(e) => handleFilterChange('isRemote', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Remote Only</option>
              <option value="false">On-site Only</option>
            </select>
          </div>

          {/* Min Salary Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Min Salary (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                placeholder="Any"
                value={filters.minSalary}
                onChange={(e) =>
                  handleFilterChange('minSalary', e.target.value)
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 pl-7 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <X size={12} />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
