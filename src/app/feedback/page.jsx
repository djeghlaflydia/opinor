// app/feedback/page.jsx (page sans code)
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FeedbackHome() {
  const router = useRouter();

  useEffect(() => {
    // Redirigez ou affichez un message
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Redirection en cours...</p>
    </div>
  );
}