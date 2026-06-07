import JobSearchFilterWrapper from '@/components/jobs/JobSearchFilterWrapper';
import { getJobs } from '@/lib/api/jobs';

export default async function JobsPage() {
  const jobs = await getJobs();

  return <JobSearchFilterWrapper initialJobs={jobs} />;
}
