"use client";

import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminNavbar() {
  const router = useRouter();
  const user = auth.getUserData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  const navigationItems = [
    { name: 'Tableau de bord', href: '/admin', icon: '🏠' },
    { name: 'Feedbacks', href: '/admin/feedbacks', icon: '💬' },
    { name: 'Rapports', href: '/admin/reports', icon: '📊' },
    { name: 'User Management', href: '/admin/users', icon: '👥' },
    { name: 'QR Codes', href: '/admin/qrcodes', icon: '🔲' },
    { name: 'Join Requests', href: '/admin/join-requests', icon: '📨' },
  ];

  return (
    <>
      {/* Sidebar pour desktop */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center justify-center space-x-3">
            <img 
              src="/Layer.svg" 
              alt="Logo" 
              className="h-10 w-auto select-none" 
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-[#038788] rounded-lg transition-colors group"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile et logout */}
        <div className="p-4 border-t border-gray-200">
          {user && (
            <Link 
              href="/admin/profile" 
              className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-teal-50 transition cursor-pointer group mb-4"
            >
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors"
                   style={{ backgroundColor: '#e6f7f7' }}>
                <span className="text-[#038788] font-bold text-sm group-hover:text-[#026b6b]">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#038788] truncate">
                  {user.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-teal-600 truncate">
                  {user.email || 'admin@opinor.com'}
                </p>
              </div>
            </Link>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white rounded-lg hover:opacity-90 transition"
            style={{ backgroundColor: '#dc2626' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Navbar mobile en haut */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo et menu burger */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link href="/admin" className="flex items-center space-x-2">
                <img 
                  src="/Layer.svg" 
                  alt="Logo" 
                  className="h-8 w-auto select-none" 
                />
                <span className="font-bold text-gray-900 hidden sm:inline">OPINOR Admin</span>
              </Link>
            </div>

            {/* Profile mobile et logout */}
            <div className="flex items-center space-x-4">
              {user && (
                <Link 
                  href="/admin/profile" 
                  className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full hover:bg-teal-200 transition-colors"
                  style={{ backgroundColor: '#e6f7f7' }}
                >
                  <span className="text-[#038788] font-bold text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'A'}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <nav className="px-4 py-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-[#038788] rounded-lg transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Logout dans menu mobile */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white rounded-lg hover:opacity-90 transition mt-4"
                style={{ backgroundColor: '#dc2626' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Overlay pour menu mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}