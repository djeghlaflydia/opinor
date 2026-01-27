"use client";

import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';
import Link from 'next/link';

export default function AdminNavbar() {
  const router = useRouter();
  const user = auth.getUserData();

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="font-bold text-gray-900">OPINOR Admin</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/admin" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Tableau de bord
              </Link>
              <Link 
                href="/admin/articles" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Articles
              </Link>
              <Link 
                href="/admin/contacts" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Contacts
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}