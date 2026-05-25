'use client';

import dynamic from 'next/dynamic';
import { env } from '@/lib/env/client';

const InteractiveDashboard = dynamic(
  () => import('@metabase/embedding-sdk-react').then((mod) => mod.InteractiveDashboard),
  { ssr: false },
);

const MetabaseProvider = dynamic(() => import('@metabase/embedding-sdk-react').then((mod) => mod.MetabaseProvider), {
  ssr: false,
});

export default function ReportsPage() {
  const authConfig = {
    metabaseInstanceUrl: env.NEXT_PUBLIC_METABASE_URL,
    apiKey: env.NEXT_PUBLIC_METABASE_TOKEN,
  };

  return (
    <MetabaseProvider authConfig={authConfig}>
      <InteractiveDashboard dashboardId={3} />
    </MetabaseProvider>
  );
}
