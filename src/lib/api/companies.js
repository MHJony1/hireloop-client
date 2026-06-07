import { serverFetch } from '../core/server';
 
export const getRecruiterCompany = async (recruiterId) => {
  if (!recruiterId) return null;
 
  try {
    const response = await serverFetch(`/api/my/companies?recruiterId=${recruiterId}`);
    return response?.data ?? null;
  } catch (error) {
    console.error('Error fetching recruiter company:', error);
    return null;
  }
};
 
export const getAllCompanies = async () => {
  try {
    const response = await serverFetch('/api/companies');
    return response?.data ?? response ?? [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};