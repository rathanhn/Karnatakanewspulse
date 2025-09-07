
// src/app/[lang]/page.tsx
'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage({ params }: { params: { lang: string } }) {
  const unwrappedParams = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${unwrappedParams.lang}/home`);
  }, [router, unwrappedParams]);

  // Render a minimal loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p>Loading...</p>
    </div>
  );
}
