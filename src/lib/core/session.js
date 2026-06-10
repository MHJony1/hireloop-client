import { redirect } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';

export const getUserSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log('Session user:', session?.user); // দেখুন role আছে কিনা
    return session?.user || null;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
};

export const requireRole = async (role) => {
  const user = await getUserSession();
  console.log('Required role:', role, 'User role:', user?.role); // debug
  if (!user) {
    redirect('/auth/signin');
  }
  if (user?.role !== role) {
    redirect('/unauthorized');
  }
  return user;
};
