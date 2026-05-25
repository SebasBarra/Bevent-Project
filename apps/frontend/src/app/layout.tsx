import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { cn } from '@/lib/utils';

import '@/app/globals.css';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentSession } from '@/features/auth/actions';

export const metadata: Metadata = {
  title: 'Bevent',
  description: 'Encuentra los mejores salones de evento en Bevent',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentSession();

  return (
    <html lang="es">
      <body className={cn(process.env.NODE_ENV === 'development' && 'debug-screens')}>
        <Providers>
          <div className="min-h-screen">
            <Navbar user={user} />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
