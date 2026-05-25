import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/features/auth/actions';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';
import { RoleSelection } from '@/features/auth/components/RoleSelection';
import { REDIRECT_URL } from '@/features/auth/constants';
import { UserRole } from '@/features/auth/types';

interface Props {
  searchParams?: Promise<{ role?: string }>;
}

export default async function OnboardingPage({ searchParams }: Props) {
  const user = await getCurrentSession({ redirectIfNotFound: true, forceCheckOnboarding: false });

  if (user.id !== '') {
    redirect(REDIRECT_URL);
  }

  const params = await searchParams;
  const isValidRole = params?.role && Object.values(UserRole).includes(params.role as UserRole);

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-linear-to-br from-background to-secondary/20 p-4">
      <div className="custom-container">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-4xl">¡Bienvenido a Bevent!</h1>
          <p className="text-lg text-muted-foreground">
            {isValidRole
              ? `Hola ${user.firstName}, completa tu registro`
              : `Hola ${user.firstName}, ¿cómo quieres usar la plataforma?`}
          </p>
        </div>

        {isValidRole ? <OnboardingForm user={user} role={params.role as UserRole} /> : <RoleSelection />}
      </div>
    </div>
  );
}
