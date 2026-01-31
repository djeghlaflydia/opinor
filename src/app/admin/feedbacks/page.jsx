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
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Filter,
  X,
  Hash,
  Key
} from 'lucide-react'
import { format } from 'date-fns'

export default function AdminFeedbacksPage() {
  const router = useRouter()

  // États pour les données
  const [feedbacks, setFeedbacks] = useState([])
  const [statistics, setStatistics] = useState(null)
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRating, setFilterRating] = useState(0)
  const [filterSentiment, setFilterSentiment] = useState('all')
  const [filterHasReply, setFilterHasReply] = useState('all')
  const [filterUniqueCode, setFilterUniqueCode] = useState('') // Nouveau filtre pour uniqueCode
  const [showDeleted, setShowDeleted] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  
  // États pour la pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [itemsPerPage] = useState(10)
  
  // États pour les modales
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  
  // États pour le chargement
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Vérifier l'authentification
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchAllData()
  }, [router])

  // Mettre à jour les filtres actifs
  useEffect(() => {
    const filters = []
    
    if (filterStatus !== 'all') {
      filters.push(`Statut: ${getStatusDisplay(filterStatus)}`)
    }
    
    if (filterRating > 0) {
      filters.push(`Note: ${filterRating} étoiles`)
    }
    
    if (filterSentiment !== 'all') {
      filters.push(`Sentiment: ${getSentimentDisplay(filterSentiment)}`)
    }
    
    if (filterHasReply !== 'all') {
      filters.push(`Réponse: ${filterHasReply === 'true' ? 'Avec réponse' : 'Sans réponse'}`)
    }
    
    if (filterUniqueCode) {
      filters.push(`Code: ${filterUniqueCode}`)
    }
    
    if (showDeleted) {
      filters.push('Inclure supprimés')
    }
    
    if (searchTerm) {
      filters.push(`Recherche: "${searchTerm}"`)
    }
    
    setActiveFilters(filters)
  }, [searchTerm, filterStatus, filterRating, filterSentiment, filterHasReply, filterUniqueCode, showDeleted])

  // Charger les données initiales
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError('')
      await Promise.all([
        fetchFeedbacks(),
        fetchGlobalStatistics()
      ])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les feedbacks avec filtres et pagination
  const fetchFeedbacks = async (page = 1) => {
    try {
      setRefreshing(true)
      
      // Construire les paramètres de requête
      const params = {
        page: page,
        limit: itemsPerPage
      }
      
      // Ajouter les filtres
      if (filterStatus !== 'all') {
        params.status = filterStatus
      }
      
      if (filterRating > 0) {
        params.rating = filterRating
      }
      
      if (filterSentiment !== 'all') {
        params.sentiment = filterSentiment
      }
      
      if (filterHasReply !== 'all') {
        params.hasAdminReply = filterHasReply === 'true'
      }
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      // Ajouter le filtre uniqueCode si spécifié
      if (filterUniqueCode) {
        params.uniqueCode = filterUniqueCode.toUpperCase().trim()
      }
      
      if (showDeleted) {
        params.includeDeleted = true
      }
      
      console.log('Fetching feedbacks with params:', params)
      
      const response = await api.getAllFeedbacks(params)
      console.log('API Response structure:', response)
      
      // Extraire les données de la structure imbriquée
      let feedbacksData = []
      let paginationData = {}
      
      if (response?.data?.data?.feedbacks) {
        feedbacksData = response.data.data.feedbacks
        paginationData = response.data.data.pagination || {}
      } else if (response?.feedbacks) {
        feedbacksData = response.feedbacks
        paginationData = response.pagination || {}
      } else if (Array.isArray(response)) {
        feedbacksData = response
      } else if (response?.data?.feedbacks) {
        feedbacksData = response.data.feedbacks
        paginationData = response.data.pagination || {}
      }
      
      setFeedbacks(feedbacksData || [])
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || itemsPerPage,
        total: paginationData.total || feedbacksData.length,
        totalPages: paginationData.totalPages || 1
      })
      
    } catch (err) {
      console.error('Error fetching feedbacks:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized') || err?.message?.includes('Non authentifié')) {
        auth.logout()
        router.push('/login')
        return
      }
      throw err
    } finally {
      setRefreshing(false)
    }
  }

  // Récupérer les statistiques globales
  const fetchGlobalStatistics = async () => {
    try {
      const response = await api.getFeedbackStatistics()
      console.log('Statistics response:', response)
      
      let statsData = null
      if (response?.data?.data) {
        statsData = response.data.data
      } else if (response?.data) {
        statsData = response.data
      } else {
        statsData = response
      }
      
      setStatistics(statsData)
    } catch (err) {
      console.warn('Error fetching statistics:', err)
    }
  }

  // Récupérer les détails d'un feedback
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

  // Actions sur les feedbacks
  const softDeleteFeedback = async (feedbackId) => {
    try {
      await api.softDeleteFeedback(feedbackId)
      setSuccessMessage('Feedback supprimé avec succès')
      setShowDeleteModal(false)
      fetchFeedbacks(pagination.page)
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
      fetchFeedbacks(pagination.page)
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
      setShowDeleteReplyModal(false)
      fetchFeedbacks(pagination.page)
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
      setShowRestoreModal(false)
      fetchFeedbacks(pagination.page)
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

  const handleSoftDeleteClick = (feedback) => {
    setSelectedFeedback(feedback)
    setShowDeleteModal(true)
  }

  const handleDeleteReplyClick = (feedback) => {
    setSelectedFeedback(feedback)
    setShowDeleteReplyModal(true)
  }

  const handleRestoreClick = (feedback) => {
    setSelectedFeedback(feedback)
    setShowRestoreModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedFeedback) return
    try {
      await softDeleteFeedback(selectedFeedback.id)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  const handleConfirmDeleteReply = async () => {
    if (!selectedFeedback) return
    try {
      await deleteAdminReply(selectedFeedback.id)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  const handleConfirmRestore = async () => {
    if (!selectedFeedback) return
    try {
      await restoreFeedback(selectedFeedback.id)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  // Appliquer les filtres
  const applyFilters = () => {
    fetchFeedbacks(1) // Revenir à la page 1
  }

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterRating(0)
    setFilterSentiment('all')
    setFilterHasReply('all')
    setFilterUniqueCode('')
    setShowDeleted(false)
    fetchFeedbacks(1)
  }

  // Supprimer un filtre spécifique
  const removeFilter = (filterText) => {
    if (filterText.includes('Statut:')) {
      setFilterStatus('all')
    } else if (filterText.includes('Note:')) {
      setFilterRating(0)
    } else if (filterText.includes('Sentiment:')) {
      setFilterSentiment('all')
    } else if (filterText.includes('Réponse:')) {
      setFilterHasReply('all')
    } else if (filterText.includes('Code:')) {
      setFilterUniqueCode('')
    } else if (filterText.includes('Inclure supprimés')) {
      setShowDeleted(false)
    } else if (filterText.includes('Recherche:')) {
      setSearchTerm('')
    }
  }

  // Navigation de page
  const handlePageChange = (newPage) => {
    fetchFeedbacks(newPage)
  }

  // Effacer les messages de succès
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

  const getSentimentDisplay = (sentiment) => {
    const sentimentMap = {
      'positive': 'Positif',
      'negative': 'Négatif',
      'neutral': 'Neutre'
    }
    return sentimentMap[sentiment] || sentiment
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

  const getSentimentColor = (sentiment) => {
    const colorMap = {
      'positive': 'bg-green-100 text-green-800',
      'negative': 'bg-red-100 text-red-800',
      'neutral': 'bg-gray-100 text-gray-800'
    }
    return colorMap[sentiment] || 'bg-gray-100 text-gray-800'
  }

  // Composant de chargement
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
              onClick={() => fetchFeedbacks(pagination.page)}
              className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
              disabled={loading || refreshing}
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Rafraîchir
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        {statistics?.overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
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

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Première ligne : Recherche par code unique */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrer par code unique
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Saisir le code unique..."
                    className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                    value={filterUniqueCode}
                    onChange={(e) => setFilterUniqueCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                    maxLength="8"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
                  disabled={refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                  Appliquer
                </button>
                
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  disabled={refreshing}
                >
                  <X className="h-4 w-4" />
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Deuxième ligne : Filtres avancés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtres avancés
              </label>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[150px]">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Statut: Tous</option>
                    <option value="new">Nouveau</option>
                    <option value="viewed">Vu</option>
                    <option value="resolved">Résolu</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[150px]">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                    value={filterRating}
                    onChange={(e) => setFilterRating(Number(e.target.value))}
                  >
                    <option value="0">Note: Toutes</option>
                    <option value="1">1 étoile</option>
                    <option value="2">2 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="5">5 étoiles</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[150px]">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                    value={filterSentiment}
                    onChange={(e) => setFilterSentiment(e.target.value)}
                  >
                    <option value="all">Sentiment: Tous</option>
                    <option value="positive">Positif</option>
                    <option value="negative">Négatif</option>
                    <option value="neutral">Neutre</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[150px]">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                    value={filterHasReply}
                    onChange={(e) => setFilterHasReply(e.target.value)}
                  >
                    <option value="all">Réponse: Toutes</option>
                    <option value="true">Avec réponse</option>
                    <option value="false">Sans réponse</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowDeleted(!showDeleted)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showDeleted 
                      ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  {showDeleted ? 'Masquer supprimés' : 'Voir supprimés'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des feedbacks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {refreshing ? (
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
                        Code Unique
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
                    {feedbacks.map((feedback) => (
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
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-mono font-medium text-gray-900">
                              {feedback.business?.uniqueCode || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderStars(feedback.rating || 0)}
                          {feedback.sentiment && (
                            <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                              {getSentimentDisplay(feedback.sentiment)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="text-sm text-gray-900 truncate" title={feedback.comment}>
                            {feedback.comment || 'Aucun commentaire'}
                          </div>
                          {feedback.adminReply && (
                            <div className="text-xs text-green-600 mt-1 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Réponse admin
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                            {getStatusDisplay(feedback.status)}
                          </span>
                          {feedback.isDeleted && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Supprimé
                            </span>
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
                              disabled={refreshing}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {!feedback.isDeleted && (
                              <>
                                <button
                                  onClick={() => handleReply(feedback)}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title={feedback.adminReply ? 'Modifier la réponse' : 'Répondre'}
                                  disabled={refreshing}
                                >
                                  <Reply className="h-4 w-4" />
                                </button>
                                
                                {feedback.adminReply && (
                                  <button
                                    onClick={() => handleDeleteReplyClick(feedback)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                    title="Supprimer la réponse"
                                    disabled={refreshing}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleSoftDeleteClick(feedback)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Supprimer le feedback"
                                  disabled={refreshing}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            
                            {feedback.isDeleted && (
                              <button
                                onClick={() => handleRestoreClick(feedback)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Restaurer"
                                disabled={refreshing}
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
              {pagination.total > 0 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">
                        {((pagination.page - 1) * pagination.limit) + 1}
                      </span> à{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      sur <span className="font-medium">{pagination.total}</span> résultats
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1 || refreshing}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {pagination.page} sur {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages || refreshing}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {feedbacks.length === 0 && !refreshing && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun feedback trouvé</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterRating > 0 || showDeleted || filterUniqueCode
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
                  <label className="text-sm font-medium text-gray-500">Code Unique</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-gray-900 font-mono font-medium">
                      {selectedFeedback.business?.uniqueCode || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Note</label>
                  <div className="mt-1">
                    {renderStars(selectedFeedback.rating || 0)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedFeedback.status)}`}>
                      {getStatusDisplay(selectedFeedback.status)}
                    </span>
                    {selectedFeedback.isDeleted && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Supprimé
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Sentiment</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(selectedFeedback.sentiment)}`}>
                      {getSentimentDisplay(selectedFeedback.sentiment)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Commentaire</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.comment || 'Aucun commentaire'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Catégorie</label>
                <div className="mt-1 text-gray-900 capitalize">
                  {selectedFeedback.category?.replace('_', ' ') || 'Non spécifiée'}
                </div>
              </div>
              
              {selectedFeedback.adminReply && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Réponse Admin</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.adminReply}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500">Créé le</label>
                <div className="mt-1 text-gray-900">
                  {formatDate(selectedFeedback.createdAt)}
                </div>
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
                  disabled={refreshing}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="px-4 py-2 bg-[#038788] text-white rounded-md hover:bg-[#026b6b] disabled:opacity-50 flex items-center gap-2"
                  disabled={!replyText.trim() || refreshing}
                >
                  {refreshing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {selectedFeedback.adminReply ? 'Mettre à jour' : 'Envoyer la réponse'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de confirmation pour la suppression de feedback */}
        {showDeleteModal && selectedFeedback && (
          <Modal onClose={() => setShowDeleteModal(false)} title="Confirmer la suppression">
            <div className="space-y-4">
              <div className="flex items-center justify-center text-yellow-600 mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <p className="text-center text-gray-700">
                Êtes-vous sûr de vouloir supprimer ce feedback ?
                Cette action est réversible.
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  disabled={refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Supprimer
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de confirmation pour la suppression de réponse */}
        {showDeleteReplyModal && selectedFeedback && (
          <Modal onClose={() => setShowDeleteReplyModal(false)} title="Confirmer la suppression">
            <div className="space-y-4">
              <div className="flex items-center justify-center text-yellow-600 mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <p className="text-center text-gray-700">
                Êtes-vous sûr de vouloir supprimer cette réponse admin ?
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowDeleteReplyModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDeleteReply}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  disabled={refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Supprimer la réponse
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de confirmation pour la restauration */}
        {showRestoreModal && selectedFeedback && (
          <Modal onClose={() => setShowRestoreModal(false)} title="Confirmer la restauration">
            <div className="space-y-4">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <p className="text-center text-gray-700">
                Êtes-vous sûr de vouloir restaurer ce feedback ?
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmRestore}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  disabled={refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Restaurer
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

// Composant Modal réutilisable
function Modal({ onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 bg-black/20 lg:ml-64 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
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