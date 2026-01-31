"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/app/components/AdminNavbar';
import { auth } from '@/app/lib/auth';
import { api } from '@/app/lib/api';
import { 
  Line, 
  Bar, 
  Pie
} from 'react-chartjs-2';
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
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  StarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  TrophyIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserGroupIcon,
  ScaleIcon,
  TagIcon,
  ChartPieIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  FireIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Loader2,RefreshCw} from 'lucide-react'

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

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [periodStats, setPeriodStats] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loadingStats, setLoadingStats] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [sentimentDistribution, setSentimentDistribution] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [topBusinesses, setTopBusinesses] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    loadUserData();
  }, [router]);


  const loadUserData = async () => {
    try {
      const userData = auth.getUserData();
      setUser(userData);
      await loadDashboardData();
      setLoading(false);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      if (error.message?.includes('401') || error.message?.includes('Non authentifié')) {
        auth.logout();
        router.push('/login');
      }
    }
  };

  const loadDashboardData = async () => {
    setLoadingStats(true);
    setError('');
    
    try {
      // Charger les statistiques globales
      const globalStats = await api.getFeedbackStatistics();
      console.log('Statistiques globales:', globalStats);
      
      // Extraire les données selon la structure de votre API
      let statsData = globalStats?.data?.data || globalStats?.data || globalStats;
      
      if (statsData?.overview) {
        setStats({
          totalFeedbacks: statsData.overview.totalFeedbacks || 0,
          thisMonthFeedbacks: statsData.overview.thisMonthFeedbacks || 0,
          thisWeekFeedbacks: statsData.overview.thisWeekFeedbacks || 0,
          averageRating: statsData.overview.averageRating || 0,
          totalBusinesses: statsData.overview.totalBusinesses || 0,
          deletedFeedbacks: statsData.overview.deletedFeedbacks || 0,
          monthOverMonthChange: statsData.overview.monthOverMonthChange || "0",
          withAdminReply: statsData.overview.withAdminReply || 0
        });
      } else {
        setStats({
          totalFeedbacks: statsData.totalFeedbacks || 0,
          thisMonthFeedbacks: statsData.thisMonthFeedbacks || 0,
          thisWeekFeedbacks: statsData.thisWeekFeedbacks || 0,
          averageRating: statsData.averageRating || 0,
          totalBusinesses: statsData.totalBusinesses || 0,
          deletedFeedbacks: statsData.deletedFeedbacks || 0,
          monthOverMonthChange: statsData.monthOverMonthChange || "0",
          withAdminReply: statsData.withAdminReply || 0
        });
      }
      
      // Définir les distributions
      if (statsData?.ratingDistribution) {
        setRatingDistribution(statsData.ratingDistribution);
      } else {
        // Si l'API ne fournit pas de données, initialiser avec des zéros
        setRatingDistribution([
          { rating: 1, count: 0 },
          { rating: 2, count: 0 },
          { rating: 3, count: 0 },
          { rating: 4, count: 0 },
          { rating: 5, count: 0 }
        ]);
      }
      
      if (statsData?.sentimentDistribution) {
        setSentimentDistribution(statsData.sentimentDistribution);
      } else {
        // Données par défaut vides
        setSentimentDistribution([
          { sentiment: 'positive', count: 0 },
          { sentiment: 'neutral', count: 0 },
          { sentiment: 'negative', count: 0 }
        ]);
      }
      
      if (statsData?.monthlyTrend) {
        setMonthlyTrend(statsData.monthlyTrend);
      } else {
        setMonthlyTrend([]);
      }
      
      if (statsData?.topBusinesses) {
        setTopBusinesses(statsData.topBusinesses.slice(0, 5));
      } else {
        setTopBusinesses([]);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      setError(error.message || 'Erreur lors du chargement des données');
      // Initialiser avec des données vides en cas d'erreur
      setRatingDistribution([
        { rating: 1, count: 0 },
        { rating: 2, count: 0 },
        { rating: 3, count: 0 },
        { rating: 4, count: 0 },
        { rating: 5, count: 0 }
      ]);
      setSentimentDistribution([
        { sentiment: 'positive', count: 0 },
        { sentiment: 'neutral', count: 0 },
        { sentiment: 'negative', count: 0 }
      ]);
      setMonthlyTrend([]);
      setTopBusinesses([]);
    } finally {
      setLoadingStats(false);
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Graphique 1: Distribution des notes (Pie Chart)
  const getRatingChartData = () => {
    const labels = ratingDistribution.map(item => `${item.rating} ⭐`);
    const data = ratingDistribution.map(item => item.count);
    const backgroundColors = [
      'rgba(239, 68, 68, 0.8)',    // Red for 1 star
      'rgba(249, 115, 22, 0.8)',   // Orange for 2 stars
      'rgba(251, 191, 36, 0.8)',   // Yellow for 3 stars
      'rgba(34, 197, 94, 0.8)',    // Green for 4 stars
      'rgba(16, 185, 129, 0.8)',   // Teal for 5 stars
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 15
      }]
    };
  };

  // Graphique 2: Distribution des sentiments (Barre)
  const getSentimentChartData = () => {
    const labels = sentimentDistribution.map(item => 
      item.sentiment === 'positive' ? 'Positif' : 
      item.sentiment === 'negative' ? 'Négatif' : 'Neutre'
    );
    const data = sentimentDistribution.map(item => item.count);
    const backgroundColors = sentimentDistribution.map(item => 
      item.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.8)' : 
      item.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.8)' : 
      'rgba(251, 191, 36, 0.8)'
    );

    return {
      labels,
      datasets: [{
        label: 'Nombre de feedbacks',
        data,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 6
      }]
    };
  };

  // Graphique 3: Tendances mensuelles (Ligne)
  const getMonthlyTrendChartData = () => {
    const labels = monthlyTrend.map(item => item.month);
    const data = monthlyTrend.map(item => item.count);

    return {
      labels,
      datasets: [{
        label: 'Feedbacks',
        data,
        borderColor: '#038788',
        backgroundColor: 'rgba(3, 135, 136, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#038788',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    };
  };

  // Options des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12,
        cornerRadius: 6
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
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  /* ===========================
      LOADING
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="lg:ml-64 pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#038788] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:ml-64 pt-16 lg:pt-4 lg:-mt-16 bg-gray-100">
      <AdminNavbar />

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 mt-2">
                Analytics et métriques de la plateforme
              </p>
            </div>
            
            <div className="flex gap-2">
            <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
            disabled={loadingStats}  
          >
            {loadingStats ? (  
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Rafraîchir
          </button>
          </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}

        {/* Sélecteur de période */}
        <div className="mb-8">
          {/* Cartes période - Conditionnel si periodStats existe */}
          {periodStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  {periodStats.comparedToPrevious && (
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      periodStats.comparedToPrevious?.includes('+')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {periodStats.comparedToPrevious}
                    </span>
                  )}
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Feedbacks</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(periodStats.totalFeedbacks || 0)}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {periodStats.periodLabel || 'Période'}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-yellow-50">
                    <StarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Note moyenne</h3>
                <p className={`text-2xl font-bold mt-2 ${getRatingColor(periodStats.averageRating || 0)}`}>
                  {(periodStats.averageRating || 0).toFixed(1)}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  /5.0
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-green-50">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                  </div>
                  {periodStats.positivePercentage && (
                    <span className="text-sm font-medium text-green-700">
                      {periodStats.positivePercentage}%
                    </span>
                  )}
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Positifs</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(Math.round((periodStats.totalFeedbacks || 0) * (periodStats.positivePercentage || 0) / 100))}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  des feedbacks
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-red-50">
                    <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
                  </div>
                  {periodStats.negativePercentage && (
                    <span className="text-sm font-medium text-red-700">
                      {periodStats.negativePercentage}%
                    </span>
                  )}
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Négatifs</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(Math.round((periodStats.totalFeedbacks || 0) * (periodStats.negativePercentage || 0) / 100))}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  des feedbacks
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique 1: Distribution des notes (Pie Chart) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ChartPieIcon className="h-5 w-5 mr-2 text-purple-500" />
                Distribution des Notes
              </h3>
              <span className="text-sm text-gray-500">
                Total: {formatNumber(ratingDistribution.reduce((sum, item) => sum + item.count, 0))}
              </span>
            </div>
            <div className="h-72">
              <Pie data={getRatingChartData()} options={pieChartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="text-center">
                  <div className={`text-lg font-bold ${
                    item.rating === 5 ? 'text-green-600' :
                    item.rating === 4 ? 'text-blue-600' :
                    item.rating === 3 ? 'text-yellow-600' :
                    item.rating === 2 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {item.rating} ⭐
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {formatNumber(item.count)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {ratingDistribution.reduce((sum, i) => sum + i.count, 0) > 0 
                      ? `${((item.count / ratingDistribution.reduce((sum, i) => sum + i.count, 0)) * 100).toFixed(1)}%`
                      : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique 2: Analyse des Sentiments (remplace Évolution des Feedbacks) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2 text-green-500" />
                Analyse des Sentiments
              </h3>
              <span className="text-sm text-gray-500">
                Total: {formatNumber(sentimentDistribution.reduce((sum, item) => sum + item.count, 0))}
              </span>
            </div>
            <div className="h-72">
              <Bar data={getSentimentChartData()} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {sentimentDistribution.map((item) => (
                <div key={item.sentiment} className="text-center">
                  <div className={`text-lg font-bold ${
                    item.sentiment === 'positive' ? 'text-green-600' :
                    item.sentiment === 'negative' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {item.sentiment === 'positive' ? 'Positif' : 
                     item.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {formatNumber(item.count)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sentimentDistribution.reduce((sum, i) => sum + i.count, 0) > 0
                      ? `${((item.count / sentimentDistribution.reduce((sum, i) => sum + i.count, 0)) * 100).toFixed(1)}%`
                      : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Tendances Mensuelles (pleine largeur) - Conserve le graphique de ligne */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-purple-500" />
              Tendances Mensuelles
            </h3>
            {stats?.monthOverMonthChange && (
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                parseFloat(stats.monthOverMonthChange) >= 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {parseFloat(stats.monthOverMonthChange) >= 0 ? '↑' : '↓'} 
                {Math.abs(parseFloat(stats.monthOverMonthChange))}% vs. mois dernier
              </span>
            )}
          </div>
          <div className="h-72">
            {monthlyTrend.length > 0 ? (
              <Line data={getMonthlyTrendChartData()} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {monthlyTrend.length > 0 && 
                `Période: ${monthlyTrend[0]?.month} - ${monthlyTrend[monthlyTrend.length - 1]?.month}`}
            </div>
            <div className="text-sm font-medium text-gray-700">
              Total: {formatNumber(monthlyTrend.reduce((sum, item) => sum + item.count, 0))} feedbacks
            </div>
          </div>
        </div>

        {/* Section 3: Top 5 Entreprises (pleine largeur) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Top 5 Entreprises
                </h3>
                <p className="text-sm text-gray-500">
                  Par nombre de feedbacks
                </p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/admin/businesses')}
              className="flex items-center text-sm text-[#038788] hover:text-[#026b6b] font-medium"
            >
              Voir toutes
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          {topBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {topBusinesses.map((business, index) => {
                const rankColors = [
                  'bg-gradient-to-b from-yellow-500 to-yellow-600',
                  'bg-gradient-to-b from-gray-400 to-gray-500',
                  'bg-gradient-to-b from-amber-700 to-amber-800',
                  'bg-gradient-to-b from-blue-400 to-blue-500',
                  'bg-gradient-to-b from-green-400 to-green-500'
                ];

                const rankIcons = [
                  <TrophyIcon className="h-6 w-6 text-white" />,
                  <FireIcon className="h-6 w-6 text-white" />,
                  <SparklesIcon className="h-6 w-6 text-white" />,
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />,
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                ];

                return (
                  <div 
                    key={business.id || business._id || index} 
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/businesses/${business.id || business._id}`)}
                  >
                    {/* Rang et icône */}
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full ${rankColors[index]} mb-4`}>
                      {index < 3 ? (
                        rankIcons[index]
                      ) : (
                        <span className="text-xl font-bold text-white">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Nom de l'entreprise */}
                    <h4 className="font-medium text-gray-900 text-center mb-2 line-clamp-2">
                      {business.name || `Entreprise ${index + 1}`}
                    </h4>

                    {/* Note moyenne */}
                    <div className="flex items-center mb-3">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-800">
                        {business.avgRating ? parseFloat(business.avgRating).toFixed(1) : '0.0'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">/5</span>
                    </div>

                    {/* Nombre d'avis */}
                    <div className="text-sm text-gray-600 mb-4">
                      {formatNumber(business.feedbackCount || 0)} avis
                    </div>

                    {/* Badge statut */}
                    {business.avgRating >= 4 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Excellent
                      </span>
                    ) : business.avgRating >= 3 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Bon
                      </span>
                    ) : business.avgRating > 0 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        À améliorer
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Pas de note
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <BuildingOfficeIcon className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucune entreprise trouvée</p>
              <p className="text-sm text-center mb-6">
                Les entreprises apparaitront ici quand elles recevront des feedbacks
              </p>
              <button 
                onClick={() => router.push('/admin/businesses')}
                className="px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] transition-colors"
              >
                Voir les entreprises
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Cartes statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl shadow-sm p-6 text-white"
               style={{ background: 'linear-gradient(135deg, #038788 0%, #026b6b 100%)' }}>
            <div className="flex items-center mb-4">
              <BuildingStorefrontIcon className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Entreprises</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(stats?.totalBusinesses || 0)}</p>
            <p className="text-sm opacity-90 mt-2">Total inscrites</p>
          </div>
          
          <div className="rounded-xl shadow-sm p-6 text-white"
               style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}>
            <div className="flex items-center mb-4">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Feedbacks</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(stats?.totalFeedbacks || 0)}</p>
            <p className="text-sm opacity-90 mt-2">Total collectés</p>
          </div>
          
          <div className="rounded-xl shadow-sm p-6 text-white"
               style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Avec réponse</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(stats?.withAdminReply || 0)}</p>
            <p className="text-sm opacity-90 mt-2">Réponses admin</p>
          </div>
          
          <div className="rounded-xl shadow-sm p-6 text-white"
               style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <div className="flex items-center mb-4">
              <StarIcon className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Note moyenne</span>
            </div>
            <p className="text-3xl font-bold">{(stats?.averageRating || 0).toFixed(1)}</p>
            <p className="text-sm opacity-90 mt-2">/5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}