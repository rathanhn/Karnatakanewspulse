// src/app/[lang]/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage({ params }: { params: { lang: string } }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${params.lang}/home`);
  }, [router, params.lang]);

  // Render a minimal loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p>Loading...</p>
    </div>
  );
}
