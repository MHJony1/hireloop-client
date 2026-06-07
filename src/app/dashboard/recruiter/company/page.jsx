import React from 'react';
import CompanyProfile from './CompanyProfile';
import { getUserSession } from '@/lib/core/session';
import { getRecruiterCompany } from '@/lib/api/companies';

const CompanyPage = async () => {
  let user = null;
  let company = null;

  try {
    user = await getUserSession();
    if (user) company = await getRecruiterCompany(user.id);
  } catch (error) {
    console.error('CompanyPage Error:', error);
  }

  if (!user) {
    return (
      <div className="w-full h-full min-h-screen bg-[#0d0d0d] flex items-center justify-center p-8">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-10 text-center max-w-sm">
          <p className="text-gray-500 text-sm">
            Please login to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <CompanyProfile recruiter={user} recruiterCompany={company} />;
};

export default CompanyPage;
