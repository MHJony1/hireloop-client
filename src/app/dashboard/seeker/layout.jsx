import { requireRole } from '@/lib/core/session';
import React from 'react';

const JobSeekerLayout = async ({children}) => {
  await requireRole('seeker');
  return children;
};

export default JobSeekerLayout;





