import { getJobById } from '@/lib/api/jobs';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import JobApply from '@/components/jobs/JobApply';
import { getApplicationsByApplicant } from '@/lib/api/application';
import { AlertCircle, ArrowRight, Briefcase } from 'lucide-react';
import { getPlanById } from '@/lib/api/plans';

const ApplyPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  if (!user) {
    redirect(`/auth/signin?redirect=/jobs/${id}/apply`);
  }

  if (user.role !== 'seeker') {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col justify-center items-center text-white p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-400">
            Only job seekers can apply for positions.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-indigo-400 hover:text-indigo-300"
          >
            Return to Home →
          </Link>
        </div>
      </div>
    );
  }

  const [applications, job] = await Promise.all([
    getApplicationsByApplicant(user.id),
    getJobById(id),
  ]);

  const plan = await getPlanById(user?.plan || "seeker_free");
  console.log(plan);


   
  const usedCount = applications?.length || 0;
  const remaining = plan.maxApplicationsPerMonth - usedCount;
  const limitReached = usedCount >= plan.maxApplicationsPerMonth;

  if (!job) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col justify-center items-center text-white p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
          <p className="text-gray-400 mb-6">
            This position may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
          >
            Browse All Jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (limitReached) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col justify-center items-center text-white p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Monthly Limit Reached
          </h2>
          <p className="text-gray-400 mb-2">
            You&apos;ve used all{' '}
            <span className="text-white font-semibold">
              {plan.maxApplicationsPerMonth}
            </span>{' '}
            applications for this month on the free plan.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Upgrade to Pro for unlimited applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Upgrade to Pro
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-2.5 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Application usage banner */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Free plan:{' '}
              <span className="text-white font-medium">{usedCount}</span> of{' '}
              <span className="text-white font-medium">
                {plan.maxApplicationsPerMonth}
              </span>{' '}
              applications used this month
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: plan.maxApplicationsPerMonth }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < usedCount ? 'bg-indigo-500' : 'bg-gray-700'}`}
                    />
                  ),
                )}
              </div>
              <span className="text-xs text-gray-500">
                {remaining} remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      <JobApply job={job} applicant={user} />
    </div>
  );
};

export default ApplyPage;
