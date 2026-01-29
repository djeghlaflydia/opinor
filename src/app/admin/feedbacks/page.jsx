"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/app/components/AdminNavbar'
import { auth } from '@/app/lib/auth'
import { api } from '@/app/lib/api'
import { 
  Search, 
  Trash2, 
  Eye, 
  Reply, 
  Undo, 
  BarChart3, 
  Building,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'

export default function AdminFeedbacksPage() {
  const router = useRouter()

  // États pour les données
  const [feedbacks, setFeedbacks] = useState([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [businessStats, setBusinessStats] = useState(null)
  const [selectedBusinessId, setSelectedBusinessId] = useState('')
  
  // États pour les modales et les formulaires
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showBusinessStatsModal, setShowBusinessStatsModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  
  // États pour le filtrage et la recherche
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRating, setFilterRating] = useState(0)
  const [showDeleted, setShowDeleted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Vérifier l'authentification et charger les données
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchAllData()
  }, [router])

  // Filtrer les feedbacks
  useEffect(() => {
    let filtered = [...feedbacks] // Créer une copie pour éviter les mutations
    
    // Filtre par statut de suppression
    if (!showDeleted) {
      filtered = filtered.filter(f => !f.isDeleted)
    }
    
    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus)
    }
    
    // Filtre par note
    if (filterRating > 0) {
      filtered = filtered.filter(f => f.rating === filterRating)
    }
    
    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(f => 
        (f.business?.name || '').toLowerCase().includes(term) ||
        (f.business?.email || '').toLowerCase().includes(term) ||
        (f.comment || '').toLowerCase().includes(term)
      )
    }
    
    setFilteredFeedbacks(filtered)
    setCurrentPage(1)
  }, [feedbacks, searchTerm, filterStatus, filterRating, showDeleted])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)

  // Fonctions API
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError('')
      await Promise.all([
        fetchAllFeedbacks(),
        fetchGlobalStatistics()
      ])
    } catch (err) {
      console.warn('Error fetching data:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllFeedbacks = async () => {
    try {
      const response = await api.getAllFeedbacks()
      // La réponse a une structure imbriquée : response.data.data.feedbacks
      console.log('Réponse API feedbacks:', response)
      
      let feedbacksData = []
      if (response?.data?.data?.feedbacks) {
        // Structure: { data: { data: { feedbacks: [] } } }
        feedbacksData = response.data.data.feedbacks
      } else if (response?.data?.feedbacks) {
        // Structure alternative: { data: { feedbacks: [] } }
        feedbacksData = response.data.feedbacks
      } else if (Array.isArray(response)) {
        // Structure simple: []
        feedbacksData = response
      } else if (response?.feedbacks) {
        // Structure: { feedbacks: [] }
        feedbacksData = response.feedbacks
      }
      
      console.log('Feedbacks extraits:', feedbacksData.length)
      setFeedbacks(feedbacksData || [])
    } catch (err) {
      console.warn('Error fetching feedbacks:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized') || err?.message?.includes('Non authentifié')) {
        auth.logout()
        router.push('/login')
        return
      }
      throw err
    }
  }

  const fetchGlobalStatistics = async () => {
    try {
      const response = await api.getFeedbackStatistics()
      console.log('Réponse API statistiques:', response)
      
      let statsData = null
      if (response?.data?.data) {
        // Structure: { data: { data: { ... } } }
        statsData = response.data.data
      } else if (response?.data) {
        // Structure: { data: { ... } }
        statsData = response.data
      } else {
        // Structure simple
        statsData = response
      }
      
      console.log('Statistiques extraites:', statsData)
      setStatistics(statsData)
    } catch (err) {
      console.warn('Error fetching statistics:', err)
      // Ne pas rediriger pour les statistiques, c'est moins critique
    }
  }

  const fetchBusinessStatistics = async (businessId) => {
    try {
      const response = await api.getBusinessFeedbackStatistics(businessId)
      let statsData = null
      
      if (response?.data?.data) {
        statsData = response.data.data
      } else if (response?.data) {
        statsData = response.data
      } else {
        statsData = response
      }
      
      return statsData
    } catch (err) {
      console.warn('Error fetching business statistics:', err)
      throw err
    }
  }

  const fetchFeedbackDetails = async (feedbackId) => {
    try {
      const response = await api.getFeedbackDetails(feedbackId)
      let details = null
      
      if (response?.data?.data) {
        details = response.data.data
      } else if (response?.data) {
        details = response.data
      } else {
        details = response
      }
      
      return details
    } catch (err) {
      console.warn('Error fetching feedback details:', err)
      throw err
    }
  }

  const softDeleteFeedback = async (feedbackId) => {
    try {
      await api.softDeleteFeedback(feedbackId)
      setSuccessMessage('Feedback supprimé avec succès')
      fetchAllFeedbacks()
    } catch (err) {
      console.warn('Error deleting feedback:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de la suppression')
      throw err
    }
  }

  const replyToFeedback = async (feedbackId, reply) => {
    try {
      await api.replyToFeedback(feedbackId, reply)
      setSuccessMessage('Réponse envoyée avec succès')
      fetchAllFeedbacks()
    } catch (err) {
      console.warn('Error replying to feedback:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de l\'envoi de la réponse')
      throw err
    }
  }

  const deleteAdminReply = async (feedbackId) => {
    try {
      await api.deleteAdminReply(feedbackId)
      setSuccessMessage('Réponse supprimée avec succès')
      fetchAllFeedbacks()
    } catch (err) {
      console.warn('Error deleting reply:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de la suppression de la réponse')
      throw err
    }
  }

  const restoreFeedback = async (feedbackId) => {
    try {
      await api.restoreFeedback(feedbackId)
      setSuccessMessage('Feedback restauré avec succès')
      fetchAllFeedbacks()
    } catch (err) {
      console.warn('Error restoring feedback:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de la restauration')
      throw err
    }
  }

  // Handlers pour les actions
  const handleViewDetails = async (feedback) => {
    try {
      const details = await fetchFeedbackDetails(feedback.id)
      setSelectedFeedback(details || feedback)
      setShowDetailsModal(true)
    } catch (err) {
      // Si l'appel échoue, afficher les données que nous avons déjà
      setSelectedFeedback(feedback)
      setShowDetailsModal(true)
    }
  }

  const handleReply = (feedback) => {
    setSelectedFeedback(feedback)
    setReplyText(feedback.adminReply || '')
    setShowReplyModal(true)
  }

  const handleSubmitReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return
    
    try {
      await replyToFeedback(selectedFeedback.id, replyText)
      setShowReplyModal(false)
      setReplyText('')
      setSelectedFeedback(null)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  const handleDeleteReply = async (feedbackId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      try {
        await deleteAdminReply(feedbackId)
      } catch (err) {
        // L'erreur est déjà gérée dans la fonction
      }
    }
  }

  const handleSoftDelete = async (feedbackId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) {
      try {
        await softDeleteFeedback(feedbackId)
      } catch (err) {
        // L'erreur est déjà gérée dans la fonction
      }
    }
  }

  const handleRestore = async (feedbackId) => {
    if (window.confirm('Êtes-vous sûr de vouloir restaurer ce feedback ?')) {
      try {
        await restoreFeedback(feedbackId)
      } catch (err) {
        // L'erreur est déjà gérée dans la fonction
      }
    }
  }

  const handleViewBusinessStats = async (businessId, businessName) => {
    if (!businessId) {
      setError('ID de l\'entreprise non disponible')
      return
    }
    
    setSelectedBusinessId(businessId)
    try {
      const stats = await fetchBusinessStatistics(businessId)
      // Ajouter le nom de l'entreprise aux statistiques
      const statsWithName = {
        ...stats,
        businessName: businessName || 'Entreprise'
      }
      setBusinessStats(statsWithName)
      setShowBusinessStatsModal(true)
    } catch (err) {
      // Si les statistiques spécifiques ne sont pas disponibles,
      // créer des statistiques basiques
      const basicStats = {
        businessName: businessName || 'Entreprise',
        totalFeedbacks: feedbacks.filter(f => f.business?.id === businessId).length,
        averageRating: 0,
        ratingDistribution: {}
      }
      setBusinessStats(basicStats)
      setShowBusinessStatsModal(true)
    }
  }

  const handleViewGlobalStats = () => {
    if (statistics) {
      setShowStatisticsModal(true)
    }
  }

  // Effacer les messages de succès après 3 secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Fonctions utilitaires d'affichage
  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= numericRating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{numericRating.toFixed(1)}</span>
      </div>
    )
  }

  const renderRatingBar = (ratingDistribution) => {
    // Format: [{ rating: 5, count: 68 }, { rating: 4, count: 70 }, ...]
    const total = ratingDistribution.reduce((sum, item) => sum + item.count, 0)
    
    return (
      <div className="space-y-2">
        {ratingDistribution.map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0
          return (
            <div key={item.rating} className="flex items-center space-x-2">
              <div className="flex items-center w-16">
                <span className="text-sm w-4">{item.rating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm w-12 text-right">{item.count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch (err) {
      return 'Date invalide'
    }
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      'new': 'Nouveau',
      'viewed': 'Vu',
      'resolved': 'Résolu',
      'pending': 'En attente'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'new': 'bg-blue-100 text-blue-800',
      'viewed': 'bg-gray-100 text-gray-800',
      'resolved': 'bg-green-100 text-green-800',
      'pending': 'bg-orange-100 text-orange-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    fetchAllData()
  }

  /* ===========================
      LOADING
  ============================ */
  if (loading && feedbacks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="lg:ml-64 pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#038788] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des feedbacks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:ml-64 pt-16 lg:pt-4 lg:-mt-16 bg-gray-100">
      <AdminNavbar />

      <div className="p-6">
        {/* Messages de statut */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-green-500 hover:text-green-700">
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Feedbacks</h1>
            <p className="text-gray-600 mt-2">
              Gérez les retours clients, répondez aux commentaires et consultez les statistiques
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Rafraîchir
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        {statistics?.overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div 
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleViewGlobalStats}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Feedbacks</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.overview.totalFeedbacks || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-[#038788]" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(statistics.overview.averageRating || 0).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avec réponse</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.overview.withAdminReply || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ce mois-ci</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.overview.thisMonthFeedbacks || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par entreprise ou commentaire..."
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="new">Nouveau</option>
                <option value="viewed">Vu</option>
                <option value="resolved">Résolu</option>
              </select>
              
              <select
                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
              >
                <option value="0">Toutes les notes</option>
                <option value="1">1 étoile</option>
                <option value="2">2 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="5">5 étoiles</option>
              </select>
              
              <button
                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${showDeleted ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setShowDeleted(!showDeleted)}
              >
                <Trash2 className="h-4 w-4" />
                {showDeleted ? 'Masquer supprimés' : 'Voir supprimés'}
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des feedbacks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#038788]" />
              <span className="ml-2 text-gray-600">Chargement des feedbacks...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commentaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentFeedbacks.map((feedback) => (
                      <tr 
                        key={feedback.id} 
                        className={`hover:bg-gray-50 ${feedback.isDeleted ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-900 block">
                                {feedback.business?.name || 'Entreprise inconnue'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {feedback.business?.email || ''}
                              </span>
                              <button
                                onClick={() => handleViewBusinessStats(feedback.business?.id, feedback.business?.name)}
                                className="text-[#038788] hover:text-[#026b6b] text-xs mt-1 block"
                                disabled={!feedback.business?.id}
                                title="Voir les statistiques de l'entreprise"
                              >
                                Voir stats
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderStars(feedback.rating || 0)}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-900 truncate" title={feedback.comment}>
                            {feedback.comment || 'Aucun commentaire'}
                          </div>
                          {feedback.sentiment && (
                            <div className="text-xs text-gray-500 mt-1">
                              Sentiment: <span className={
                                feedback.sentiment === 'positive' ? 'text-green-600' :
                                feedback.sentiment === 'negative' ? 'text-red-600' :
                                'text-gray-600'
                              }>
                                {feedback.sentiment === 'positive' ? 'Positif' :
                                 feedback.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                            {getStatusDisplay(feedback.status)}
                          </span>
                          {feedback.adminReply && (
                            <div className="text-xs text-green-600 mt-1">Réponse admin</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(feedback.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(feedback)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Voir les détails"
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {!feedback.isDeleted && (
                              <>
                                <button
                                  onClick={() => handleReply(feedback)}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title={feedback.adminReply ? 'Modifier la réponse' : 'Répondre'}
                                  disabled={loading}
                                >
                                  <Reply className="h-4 w-4" />
                                </button>
                                
                                {feedback.adminReply && (
                                  <button
                                    onClick={() => handleDeleteReply(feedback.id)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                    title="Supprimer la réponse"
                                    disabled={loading}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleSoftDelete(feedback.id)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Supprimer le feedback"
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            
                            {feedback.isDeleted && (
                              <button
                                onClick={() => handleRestore(feedback.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Restaurer"
                                disabled={loading}
                              >
                                <Undo className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredFeedbacks.length > itemsPerPage && (
                <div className="bg-white px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredFeedbacks.length)}
                      </span>{' '}
                      sur <span className="font-medium">{filteredFeedbacks.length}</span> résultats
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredFeedbacks.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun feedback trouvé</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterRating > 0 || showDeleted
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Aucun feedback disponible pour le moment'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Détails du Feedback */}
        {showDetailsModal && selectedFeedback && (
          <Modal onClose={() => setShowDetailsModal(false)} title="Détails du Feedback">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Entreprise</label>
                <div className="mt-1 flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-900 font-medium block">
                      {selectedFeedback.business?.name || 'Entreprise inconnue'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedFeedback.business?.email || ''}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Note</label>
                  <div className="mt-1">
                    {renderStars(selectedFeedback.rating || 0)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedFeedback.status)}`}>
                      {getStatusDisplay(selectedFeedback.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Commentaire</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedFeedback.comment || 'Aucun commentaire'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Sentiment</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedFeedback.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      selectedFeedback.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedFeedback.sentiment === 'positive' ? 'Positif' :
                       selectedFeedback.sentiment === 'negative' ? 'Négatif' :
                       selectedFeedback.sentiment === 'neutral' ? 'Neutre' : 'Inconnu'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Catégorie</label>
                  <div className="mt-1 text-gray-900 capitalize">
                    {selectedFeedback.category?.replace('_', ' ') || 'Non spécifiée'}
                  </div>
                </div>
              </div>
              
              {selectedFeedback.adminReply && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Réponse Admin</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-gray-900">{selectedFeedback.adminReply}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-500">Créé le</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      {formatDate(selectedFeedback.createdAt)}
                    </span>
                  </div>
                </div>
                
                {selectedFeedback.isDeleted && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Supprimé
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Répondre */}
        {showReplyModal && selectedFeedback && (
          <Modal 
            onClose={() => setShowReplyModal(false)} 
            title={selectedFeedback.adminReply ? 'Modifier la réponse' : 'Répondre au feedback'}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire original
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedFeedback.comment}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre réponse
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#038788] focus:border-transparent"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tapez votre réponse ici..."
                  disabled={loading}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="px-4 py-2 bg-[#038788] text-white rounded-md hover:bg-[#026b6b] disabled:opacity-50 flex items-center gap-2"
                  disabled={!replyText.trim() || loading}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {selectedFeedback.adminReply ? 'Mettre à jour' : 'Envoyer la réponse'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Statistiques Globales */}
        {showStatisticsModal && statistics && (
          <Modal onClose={() => setShowStatisticsModal(false)} title="Statistiques Globales">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Feedbacks" value={statistics.overview?.totalFeedbacks || 0} />
                <StatCard 
                  label="Note moyenne" 
                  value={`${(statistics.overview?.averageRating || 0).toFixed(1)}/5`}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  label="Ce mois-ci" 
                  value={statistics.overview?.thisMonthFeedbacks || 0} 
                />
                <StatCard 
                  label="Avec réponse" 
                  value={statistics.overview?.withAdminReply || 0} 
                  color="green"
                />
              </div>
              
              {statistics.ratingDistribution && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Distribution des notes</h4>
                  {renderRatingBar(statistics.ratingDistribution)}
                </div>
              )}
              
              {statistics.sentimentDistribution && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Distribution des sentiments</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {statistics.sentimentDistribution.map((item) => (
                      <div key={item.sentiment} className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-500">
                          {item.sentiment === 'positive' ? 'Positif' :
                           item.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                        </div>
                        <div className="text-xl font-bold text-gray-900">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {statistics.topBusinesses && statistics.topBusinesses.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Top entreprises</h4>
                  <div className="space-y-2">
                    {statistics.topBusinesses.slice(0, 5).map((business, index) => (
                      <div key={business.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">{index + 1}.</span>
                          <span className="font-medium">{business.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {business.feedbackCount} feedbacks
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Modal Statistiques Business */}
        {showBusinessStatsModal && businessStats && (
          <Modal 
            onClose={() => setShowBusinessStatsModal(false)} 
            title={`Statistiques - ${businessStats.businessName || 'Entreprise'}`}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Feedbacks" value={businessStats.totalFeedbacks || 0} />
                <StatCard 
                  label="Note moyenne" 
                  value={businessStats.avgRating ? `${parseFloat(businessStats.avgRating).toFixed(1)}/5` : 'N/A'}
                />
              </div>
              
              {businessStats.ratingDistribution && Array.isArray(businessStats.ratingDistribution) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Distribution des notes</h4>
                  {renderRatingBar(businessStats.ratingDistribution)}
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

// Composant Modal réutilisable
function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Composant StatCard réutilisable
function StatCard({ label, value, color = 'gray' }) {
  const colorClasses = {
    gray: 'bg-gray-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
    blue: 'bg-blue-50',
  }
  
  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg`}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-3xl font-bold ${
        color === 'green' ? 'text-green-700' : 
        color === 'orange' ? 'text-orange-700' : 
        'text-gray-900'
      }`}>
        {value}
      </div>
    </div>
  )
}