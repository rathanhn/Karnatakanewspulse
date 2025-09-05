// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component now simply redirects to the default locale's home page.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default English homepage.
    // In a more advanced setup, you might detect the browser's language.
    router.replace('/en/home');
  }, [router]);

  // Render a minimal loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p>Loading...</p>
    </div>
  );
}
