import { getAllCompanies } from '@/lib/api/companies';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import React from 'react';
import AdminCompaniesClient from '@/components/dashboard/admin/AdminCompaniesClient';

export const metadata = {
  title: 'Company Registrations | Admin Panel | HireLoop',
  description:
    'Review and manage corporate entity access requests for the HireLoop ecosystem',
};

const AdminCompaniesPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect('/auth/signin');
  }

  if (user.role !== 'admin') {
    redirect('/unauthorized');
  }

  const companies = await getAllCompanies();

  return <AdminCompaniesClient companies={companies} user={user} />;
};

export default AdminCompaniesPage;
