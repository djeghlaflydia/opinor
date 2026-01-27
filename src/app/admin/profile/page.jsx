"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import { api } from '@/app/lib/api';
import AdminNavbar from '@/app/components/AdminNavbar';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      if (!auth.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const response = await api.getAdminProfile();
      const data = response.data || response;
      
      setProfile(data);

    } catch (err) {
      console.warn('Erreur lors de la récupération du profil:', err);

      if (err.message.includes('Non authentifié') || err.message.includes('401')) {
        auth.logout();
        router.push('/login');
        return;
      }

      setError(err.message || 'Impossible de charger le profil');

      const localUser = auth.getUserData();
      if (localUser) {
        setProfile(localUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'SUPER_ADMIN': 'Super Administrateur',
      'ADMIN': 'Administrateur',
      'MODERATOR': 'Modérateur',
      'USER': 'Utilisateur'
    };
    return roles[role] || role || 'Utilisateur';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="pt-16 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête avec retour */}
          <div className="mb-8">
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Administrateur</h1>
                <p className="text-gray-600 mt-1">Informations de votre compte</p>
              </div>
              
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {getRoleDisplay(profile.role)}
              </div>
            </div>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="">
            {/* Colonne principale */}
            <div className="">
              {/* Carte informations personnelles */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-2xl font-bold">
                          {profile.email?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="flex-1">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900">{profile.email || 'admin@opinor.dz'}</h3>
                        <p className="text-gray-600">Email principal</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Adresse email</label>
                            <p className="text-gray-900 font-medium">{profile.email || 'admin@opinor.dz'}</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Rôle</label>
                            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              {getRoleDisplay(profile.role)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Compte créé</label>
                            <p className="text-gray-900 font-medium">{formatDate(profile.createdAt)}</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Statut</label>
                            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="10" fill="currentColor" />
                              </svg>
                              Actif
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}