import { getJobs } from '@/lib/api/jobs';
import Link from 'next/link';
import JobCard from '../jobs/JobCard';

const FeaturedJobs = async () => {
  const jobs = await getJobs();

  if (!jobs || jobs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">No featured jobs available.</p>
      </div>
    );
  }

  const featuredJobs = jobs.slice(0, 6);

  return (
    <section className="py-16 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Featured Jobs
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            Hand-picked opportunities for you
          </p>
          <div className="mt-3 flex justify-center">
            <div className="h-1 w-20 rounded-full bg-linear-to-r from-indigo-500 to-purple-500" />
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard key={job._id?.$oid || job._id} job={job} />
          ))}
        </div>

        {/* Browse All Jobs Button */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105"
          >
            Browse All Jobs
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
