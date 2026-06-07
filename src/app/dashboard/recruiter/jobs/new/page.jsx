import React from 'react';
import PostJobForm from './PostJobForm';
import { getRecruiterCompany } from '@/lib/api/companies'; 
import { getUserSession } from '@/lib/core/session'; 

const PostJobPage = async () => {
  const user = await getUserSession();
  const company = await getRecruiterCompany(user?.id);

  return (
    <div>
      <PostJobForm recruiter={user} company={company} />
    </div>
  );
};

export default PostJobPage;
