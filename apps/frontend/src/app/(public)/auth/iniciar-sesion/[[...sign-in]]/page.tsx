import { SignIn } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/features/auth/actions';
import { REDIRECT_URL } from '@/features/auth/constants';

export default async function SignInPage() {
  const user = await getCurrentSession();

  if (user) {
    redirect(REDIRECT_URL);
  }

  return (
    <div className="custom-container flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <SignIn
        appearance={{
          theme: shadcn,
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
        fallbackRedirectUrl="/"
        forceRedirectUrl="/"
      />
    </div>
  );
}
