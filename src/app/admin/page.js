"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';
import { api } from '../lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const token = auth.getToken();
      const userData = auth.getUserData();
      setUser(userData);
      
      // Récupérer les statistiques depuis l'API
      // const data = await api.getAdminData(token);
      // setStats(data);
      
      setLoading(false);
    } catch (error) {
      auth.logout();
      router.push('/login');
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord Administration
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenue dans l'espace d'administration OPINOR
        </p>
      </div>

      {/* Section utilisateur */}
      {user && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations de connexion
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user.name || 'Administrateur'}
              </p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 text-sm font-medium">Articles</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          <div className="mt-2 text-xs text-gray-500">À publier</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 text-sm font-medium">Visiteurs</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          <div className="mt-2 text-xs text-gray-500">Aujourd'hui</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 text-sm font-medium">Messages</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          <div className="mt-2 text-xs text-gray-500">Non lus</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-500 text-sm font-medium">Abonnés</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          <div className="mt-2 text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => router.push('/admin/articles')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
          >
            <h3 className="font-medium text-gray-900">Gérer les articles</h3>
            <p className="text-sm text-gray-600 mt-1">Créer, modifier, publier</p>
          </button>
          
          <button 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
          >
            <h3 className="font-medium text-gray-900">Voir les contacts</h3>
            <p className="text-sm text-gray-600 mt-1">Messages reçus</p>
          </button>
          
          <button 
            onClick={handleLogout}
            className="p-4 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition text-left"
          >
            <h3 className="font-medium text-red-700">Déconnexion</h3>
            <p className="text-sm text-red-600 mt-1">Quitter l'administration</p>
          </button>
        </div>
      </div>
    </div>
  );
}