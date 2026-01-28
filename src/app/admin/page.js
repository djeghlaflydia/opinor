"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/auth';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  StarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://opinor.onrender.com';

export default function AdminPage() {
  const router = useRouter();
  const [periodStats, setPeriodStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [period, user]);

  const loadAdminData = async () => {
    try {
      const token = auth.getToken();
      const userData = auth.getUserData();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur de chargement admin:', error);
      auth.logout();
      router.push('/login');
    }
  };

  const loadStatistics = async () => {
    if (!user) return;
    
    setLoadingStats(true);
    try {
      const token = auth.getToken();
      
      // Charger les statistiques par période
      const periodResponse = await fetch(
        `${API_BASE_URL}/api/v1/reports/statistics?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!periodResponse.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      
      const periodData = await periodResponse.json();
      setPeriodStats(periodData);
      
      // Charger les statistiques globales
      const globalResponse = await fetch(
        `${API_BASE_URL}/api/v1/admin/feedbacks/statistics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (globalResponse.ok) {
        const globalData = await globalResponse.json();
        setGlobalStats(globalData);
      }
      
      setLoadingStats(false);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setLoadingStats(false);
      
      // Données mockées pour la démo
      setPeriodStats(getMockPeriodStats(period));
      setGlobalStats(getMockGlobalStats());
    }
  };

  const getMockPeriodStats = (period) => {
    const baseData = {
      today: {
        totalFeedbacks: 12,
        averageRating: 4.5,
        positivePercentage: 75,
        negativePercentage: 8,
        neutralPercentage: 17,
        comparedToPrevious: "+15%",
        periodLabel: "Aujourd'hui",
        dailyData: [4, 5, 3, 6, 8, 9, 12]
      },
      week: {
        totalFeedbacks: 45,
        averageRating: 4.3,
        positivePercentage: 78,
        negativePercentage: 8,
        neutralPercentage: 14,
        comparedToPrevious: "+12%",
        periodLabel: "Cette semaine",
        dailyData: [5, 7, 6, 8, 9, 4, 6]
      },
      month: {
        totalFeedbacks: 210,
        averageRating: 4.2,
        positivePercentage: 72,
        negativePercentage: 10,
        neutralPercentage: 18,
        comparedToPrevious: "+8%",
        periodLabel: "Ce mois",
        dailyData: [45, 52, 48, 55, 50, 47, 53, 49, 56, 48]
      }
    };
    
    return {
      success: true,
      data: {
        period,
        ...baseData[period]
      }
    };
  };

  const getMockGlobalStats = () => {
    return {
      success: true,
      data: {
        totalBusinesses: 45,
        totalFeedbacks: 1245,
        totalUsers: 892,
        averageRating: 4.2,
        businessesByRating: [
          { rating: "5 stars", count: 15 },
          { rating: "4 stars", count: 18 },
          { rating: "3 stars", count: 8 },
          { rating: "2 stars", count: 3 },
          { rating: "1 star", count: 1 }
        ],
        feedbackTrend: [85, 92, 78, 95, 88, 102, 98, 110, 105, 115, 108, 120],
        topCategories: [
          { category: "Restauration", count: 245 },
          { category: "Boutique", count: 189 },
          { category: "Services", count: 156 },
          { category: "Loisirs", count: 112 },
          { category: "Autre", count: 78 }
        ]
      }
    };
  };

  // Configuration des graphiques
  const getLineChartData = () => {
    const labels = period === 'today' 
      ? ['6h', '8h', '10h', '12h', '14h', '16h', '18h']
      : period === 'week'
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : Array.from({ length: 10 }, (_, i) => `J${i + 1}`);
    
    return {
      labels,
      datasets: [
        {
          label: 'Feedbacks reçus',
          data: periodStats?.data?.dailyData || [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const getPieChartData = () => {
    if (!periodStats) return { labels: [], datasets: [] };
    
    return {
      labels: ['Positifs', 'Neutres', 'Négatifs'],
      datasets: [
        {
          data: [
            periodStats.data.positivePercentage,
            periodStats.data.neutralPercentage,
            periodStats.data.negativePercentage
          ],
          backgroundColor: [
            'rgb(34, 197, 94)', // Vert
            'rgb(250, 204, 21)', // Jaune
            'rgb(239, 68, 68)'  // Rouge
          ],
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.8)'
        }
      ]
    };
  };

  const getBusinessRatingChartData = () => {
    if (!globalStats) return { labels: [], datasets: [] };
    
    return {
      labels: globalStats.data.businessesByRating.map(b => b.rating),
      datasets: [
        {
          label: 'Nombre d\'entreprises',
          data: globalStats.data.businessesByRating.map(b => b.count),
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(250, 204, 21, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getFeedbackTrendChartData = () => {
    if (!globalStats) return { labels: [], datasets: [] };
    
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    return {
      labels: months.slice(0, globalStats.data.feedbackTrend.length),
      datasets: [
        {
          label: 'Feedbacks mensuels',
          data: globalStats.data.feedbackTrend,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  };

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  });

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/');
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Administration
            </h1>
            <p className="text-gray-600 mt-2">
              Analytics et statistiques des feedbacks
            </p>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 text-sm">
                    {user.name || 'Administrateur'}
                  </p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Période de statistiques */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
            Statistiques des Feedback
          </h2>
          
          <div className="flex space-x-2">
            {['today', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {p === 'today' ? "Aujourd'hui" : 
                 p === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cartes principales */}
      {periodStats && periodStats.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total des feedbacks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                parseFloat(periodStats.data.comparedToPrevious) >= 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {periodStats.data.comparedToPrevious}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Feedback</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatNumber(periodStats.data.totalFeedbacks)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {period === 'today' ? "Aujourd'hui" : 
               period === 'week' ? "Cette semaine" : "Ce mois"}
            </div>
          </div>
          
          {/* Note moyenne */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Note moyenne</h3>
            <p className={`text-3xl font-bold mt-2 ${getRatingColor(periodStats.data.averageRating)}`}>
              {periodStats.data.averageRating.toFixed(1)}
              <span className="text-gray-500 text-lg">/5</span>
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Sur {periodStats.data.totalFeedbacks} évaluations
            </div>
          </div>
          
          {/* Feedback positifs */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-700">
                {periodStats.data.positivePercentage}%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Positifs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {Math.round(periodStats.data.totalFeedbacks * periodStats.data.positivePercentage / 100)}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${periodStats.data.positivePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Feedback négatifs */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-red-700">
                {periodStats.data.negativePercentage}%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Négatifs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {Math.round(periodStats.data.totalFeedbacks * periodStats.data.negativePercentage / 100)}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${periodStats.data.negativePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique en ligne - Évolution des feedbacks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Évolution des Feedbacks
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              {period === 'today' ? 'Heures' : period === 'week' ? 'Jours' : 'Jours du mois'}
            </div>
          </div>
          <div className="h-64">
            <Line data={getLineChartData()} options={chartOptions()} />
          </div>
        </div>
        
        {/* Graphique en camembert - Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Distribution des Sentiments
          </h3>
          <div className="h-64">
            <Pie data={getPieChartData()} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Statistiques Globales */}
      {globalStats && globalStats.data && (
        <>
          {/* Cartes globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center mb-4">
                <BuildingStorefrontIcon className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">Entreprises</span>
              </div>
              <p className="text-3xl font-bold">{formatNumber(globalStats.data.totalBusinesses)}</p>
              <p className="text-sm opacity-90 mt-2">Total inscrites</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">Feedbacks</span>
              </div>
              <p className="text-3xl font-bold">{formatNumber(globalStats.data.totalFeedbacks)}</p>
              <p className="text-sm opacity-90 mt-2">Total collectés</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center mb-4">
                <UsersIcon className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">Utilisateurs</span>
              </div>
              <p className="text-3xl font-bold">{formatNumber(globalStats.data.totalUsers)}</p>
              <p className="text-sm opacity-90 mt-2">Inscrits</p>
            </div>
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center mb-4">
                <StarIcon className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">Note moyenne</span>
              </div>
              <p className="text-3xl font-bold">{globalStats.data.averageRating.toFixed(1)}</p>
              <p className="text-sm opacity-90 mt-2">/5.0</p>
            </div>
          </div>
          
          {/* Graphiques globaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Distribution des étoiles par entreprise */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Distribution des Notes des Entreprises
              </h3>
              <div className="h-64">
                <Bar data={getBusinessRatingChartData()} options={chartOptions()} />
              </div>
            </div>
            
            {/* Tendances mensuelles */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tendances Mensuelles
                </h3>
                <span className="text-sm text-green-600 font-medium">+12% vs. l'an dernier</span>
              </div>
              <div className="h-64">
                <Line data={getFeedbackTrendChartData()} options={chartOptions()} />
              </div>
            </div>
          </div>
          
          {/* Top catégories */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Top Catégories d'Entreprises
            </h3>
            <div className="space-y-4">
              {globalStats.data.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-blue-100 text-blue-600' :
                      index === 1 ? 'bg-purple-100 text-purple-600' :
                      index === 2 ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium mr-3">{formatNumber(category.count)} feedbacks</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-purple-500' :
                          index === 2 ? 'bg-green-500' :
                          'bg-gray-400'
                        }`}
                        style={{ 
                          width: `${(category.count / Math.max(...globalStats.data.topCategories.map(c => c.count))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => router.push('/admin/businesses')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left group"
          >
            <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3 group-hover:bg-blue-100 transition">
              <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Gérer entreprises</h3>
            <p className="text-sm text-gray-600 mt-1">Liste et statistiques</p>
          </button>
          
          <button 
            onClick={() => router.push('/admin/feedbacks')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left group"
          >
            <div className="p-2 bg-green-50 rounded-lg w-fit mb-3 group-hover:bg-green-100 transition">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Voir les feedbacks</h3>
            <p className="text-sm text-gray-600 mt-1">Tous les commentaires</p>
          </button>
          
          <button 
            onClick={() => router.push('/admin/reports')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left group"
          >
            <div className="p-2 bg-purple-50 rounded-lg w-fit mb-3 group-hover:bg-purple-100 transition">
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Rapports détaillés</h3>
            <p className="text-sm text-gray-600 mt-1">Export et analyse</p>
          </button>
          
          <button 
            onClick={handleLogout}
            className="p-4 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition text-left group"
          >
            <div className="p-2 bg-red-100 rounded-lg w-fit mb-3 group-hover:bg-red-200 transition">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="font-medium text-red-700">Déconnexion</h3>
            <p className="text-sm text-red-600 mt-1">Quitter l'administration</p>
          </button>
        </div>
      </div>
    </div>
  );
}