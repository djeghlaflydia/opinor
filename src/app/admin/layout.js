"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification côté client
    const checkAuth = () => {
      const authenticated = auth.verifyLocalToken();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection se fera dans useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}