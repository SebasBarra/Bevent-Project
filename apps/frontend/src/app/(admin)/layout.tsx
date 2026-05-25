import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/features/auth/actions';
import { REDIRECT_URL } from '@/features/auth/constants';
import { UserRole } from '@/features/auth/types';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentSession({ redirectIfNotFound: true });

  if (user.role !== UserRole.ADMIN) {
    redirect(REDIRECT_URL);
  }

  return <>{children}</>;
}
