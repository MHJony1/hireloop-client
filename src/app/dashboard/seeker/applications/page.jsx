import { getApplicationsByApplicant } from '@/lib/api/application';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import React from 'react';
import ApplicationsClient from '@/components/dashboard/seeker/ApplicationsClient';

export const metadata = {
  title: 'My Applications | HireLoop',
  description: 'Track your job applications and interview progress',
};

const SeekerApplicationPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect('/auth/signin');
  }

  if (user.role !== 'seeker') {
    redirect('/unauthorized');
  }

  const applications = await getApplicationsByApplicant(user.id);

  return <ApplicationsClient applications={applications} user={user} />;
};

export default SeekerApplicationPage;
