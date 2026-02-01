"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/app/components/AdminNavbar'
import { auth } from '@/app/lib/auth'
import { api } from '@/app/lib/api'
import { 
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  MessageCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  UserPlus,
  Shield,
  AlertTriangle,
  Globe,
  Hash,
  MapPin,
  Users,
  FileText,
  MailCheck,
  MailWarning
} from 'lucide-react'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'

export default function AdminJoinRequestsPage() {
  const router = useRouter()

  // États pour les données
  const [joinRequests, setJoinRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestDetails, setRequestDetails] = useState(null)
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const statusOptions = [
    { value: 'all', label: 'Tous', icon: <Filter className="h-4 w-4" /> },
    { value: 'PENDING', label: 'En attente', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'APPROVED', label: 'Approuvées', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    { value: 'REJECTED', label: 'Rejetées', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800' }
  ]
  // États pour la pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  
  // États pour le chargement
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // États pour la modale de revue
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewStatus, setReviewStatus] = useState('APPROVED')
  const [rejectionReason, setRejectionReason] = useState('')


  // Vérifier l'authentification
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchJoinRequests()
  }, [router])

   // Fonction fetch optimisée avec useCallback
  const fetchJoinRequests = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError('')
      
      const params = {
        page,
        limit: 10,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined
      }
      
      console.log('Fetching join requests with params:', params)
      const response = await api.getAllJoinRequests(params)
      console.log('Join requests API response:', response)
      
      let requestsData = []
      let paginationData = {}
      
      // Adapter l'extraction à la structure réelle
      if (response?.data?.requests) {
        requestsData = response.data.requests
        paginationData = response.data.pagination || {}
      } else if (Array.isArray(response)) {
        requestsData = response
      } else if (response?.success && Array.isArray(response.data)) {
        requestsData = response.data
      }
      
      console.log('Join requests data extracted:', requestsData)
      
      setJoinRequests(requestsData)
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || 10,
        total: paginationData.total || requestsData.length,
        totalPages: paginationData.totalPages || 1
      })
      
    } catch (err) {
      console.error('Error fetching join requests:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Non authentifié')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err.message || 'Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }, [filterStatus, searchTerm, router]) // Dépendances

  // Effacer les messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error])

  // Recharger les données quand les filtres changent
  useEffect(() => {
    fetchJoinRequests(1)
  }, [fetchJoinRequests])

  // Récupérer les détails d'une demande
  const fetchRequestDetails = async (requestId) => {
    try {
      setLoadingDetails(true)
      setError('')
      
      const data = await api.getJoinRequest(requestId)
      console.log('Request details received:', data)
      
      setRequestDetails(data)
      
    } catch (err) {
      console.error('Error fetching request details:', err)
      setError(err.message || 'Erreur lors du chargement des détails')
    } finally {
      setLoadingDetails(false)
    }
  }

  // Sélectionner une demande
  const handleSelectRequest = (request) => {
    setSelectedRequest(request)
    setRequestDetails(null)
    fetchRequestDetails(request.id)
  }


  // Ouvrir la modale de revue
  const openReviewModal = (status = 'APPROVED') => {
    setReviewStatus(status)
    setRejectionReason('')
    setShowReviewModal(true)
  }

  // Examiner une demande
  const handleReviewRequest = async () => {
    if (!selectedRequest) return
    
    try {
      setReviewing(true)
      setError('')
      
      const reviewData = {
        status: reviewStatus
      }
      
      if (reviewStatus === 'REJECTED' && rejectionReason.trim()) {
        reviewData.rejectionReason = rejectionReason.trim()
      }
      
      const result = await api.reviewJoinRequest(selectedRequest.id, reviewData)
      console.log('Review result:', result)
      
      setSuccessMessage(`Demande ${reviewStatus === 'APPROVED' ? 'approuvée' : 'rejetée'} avec succès !`)
      
      // Rafraîchir les données
      fetchJoinRequests(pagination.page)
      fetchRequestDetails(selectedRequest.id)
      
      // Fermer la modale
      setShowReviewModal(false)
      
    } catch (err) {
      console.error('Error reviewing request:', err)
      setError(err.message || 'Erreur lors de l\'examen de la demande')
    } finally {
      setReviewing(false)
    }
  }

 const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      fetchJoinRequests(1)
    }
  }

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    // Pas besoin d'appeler fetchJoinRequests ici, useEffect le fera
  }

  // Navigation de page
  const handlePageChange = (newPage) => {
    fetchJoinRequests(newPage)
  }

  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr })
    } catch (err) {
      return 'Date invalide'
    }
  }

 const formatStatus = (status) => {
    const statusMap = {
      'PENDING': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      'APPROVED': { label: 'Approuvée', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
      'REJECTED': { label: 'Rejetée', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: <FileText className="h-4 w-4" /> }
  }

  // Obtenir les statistiques
  const getStatistics = () => {
    const stats = {
      total: joinRequests.length,
      pending: joinRequests.filter(r => r.status === 'PENDING').length,
      approved: joinRequests.filter(r => r.status === 'APPROVED').length,
      rejected: joinRequests.filter(r => r.status === 'REJECTED').length
    }
    return stats
  }
  // Composant de chargement principal
  if (loading && joinRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="lg:ml-64 pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#038788] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des demandes d'adhésion...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:ml-64 pt-16 lg:pt-4 lg:-mt-16 bg-gray-100">
      <AdminNavbar />

      <div className="p-4 md:p-6">
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
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demandes d'Adhésion</h1>
            <p className="text-gray-600 mt-2">
              Gérez les demandes d'inscription des entreprises
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchJoinRequests(pagination.page)}
              className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="hidden sm:inline">Rafraîchir</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{getStatistics().total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{getStatistics().pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approuvées</p>
                <p className="text-2xl font-bold text-gray-900">{getStatistics().approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejetées</p>
                <p className="text-2xl font-bold text-gray-900">{getStatistics().rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : Liste des demandes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 mb-4"> 
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrer par statut
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterStatus(option.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === option.value
                          ? 'bg-[#038788] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des demandes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Demandes</h3>
                  <span className="text-sm text-gray-500">
                    {pagination.total} demande{pagination.total !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[540px] overflow-y-auto">
                {joinRequests.map((request) => {
                  const statusInfo = formatStatus(request.status)
                  return (
                    <div
                      key={request.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedRequest?.id === request.id ? 'bg-blue-50 border-r-4 border-[#038788]' : ''
                      }`}
                      onClick={() => handleSelectRequest(request)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate">
                            {request.businessName || 'Sans nom'}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-1 truncate">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{request.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded truncate">
                            {request.businessType || 'Non spécifié'}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {joinRequests.length === 0 && !loading && (
                  <div className="text-center py-12 px-4">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== 'all'
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Aucune demande d\'adhésion disponible'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {pagination.total > 0 && pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {pagination.page} sur {pagination.totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Page précédente"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages || loading}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Page suivante"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite : Détails de la demande */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="space-y-6">
                {/* Header de la demande */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Building className="h-6 w-6 text-[#038788] flex-shrink-0" />
                        <span className="truncate">{selectedRequest.businessName || 'Entreprise sans nom'}</span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{selectedRequest.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{selectedRequest.phone || 'N/A'}</span>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 rounded whitespace-nowrap">
                          {selectedRequest.businessType || 'Non spécifié'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Boutons d'action */}
                    {selectedRequest.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openReviewModal('APPROVED')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 whitespace-nowrap"
                          title="Approuver la demande"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approuver</span>
                        </button>
                        <button
                          onClick={() => openReviewModal('REJECTED')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 whitespace-nowrap"
                          title="Rejeter la demande"
                        >
                          <X className="h-4 w-4" />
                          <span>Rejeter</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Détails de la demande */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Informations de contact */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Informations de contact
                    </h3>
                    
                    {loadingDetails ? (
                        <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-[#038788]" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a 
                                href={`mailto:${requestDetails?.email}`} 
                                className="hover:underline truncate"
                            >
                                {requestDetails?.email}
                            </a>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                            <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a 
                                href={`tel:${requestDetails?.phone}`} 
                                className=" hover:underline"
                            >
                                {requestDetails?.phone || 'N/A'}
                            </a>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                            <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{requestDetails?.address || 'N/A'}</span>
                            </div>
                        </div>
                        </div>
                    )}
                    </div>

                    {/* Informations de l'entreprise */}
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Informations de l'entreprise
                    </h3>
                    
                    {loadingDetails ? (
                        <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-[#038788]" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nom de l'entreprise</label>
                            <p className="text-gray-900">{requestDetails?.businessName || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Type d'entreprise</label>
                            <span className="px-2 py-1 bg-gray-100 rounded text-gray-900">
                            {requestDetails?.businessType || 'Non spécifié'}
                            </span>
                        </div>
                        
                        {/* Ajoutez d'autres champs si disponibles dans l'API */}
                        {requestDetails?.contactName && (
                            <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Contact principal</label>
                            <p className="text-gray-900">{requestDetails.contactName}</p>
                            </div>
                        )}
                        
                        {requestDetails?.website && (
                            <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Site web</label>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-gray-400" />
                                <a 
                                href={requestDetails.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#038788] hover:underline truncate"
                                >
                                {requestDetails.website}
                                </a>
                            </div>
                            </div>
                        )}
                        </div>
                    )}
                    </div>
                </div>

                {/* Historique et statut */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Historique et statut
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Statut actuel</label>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const statusInfo = formatStatus(selectedRequest.status)
                            return (
                              <>
                                {statusInfo.icon}
                                <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </>
                            )
                          })()}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date de soumission</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(selectedRequest.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {requestDetails?.reviewedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date d'examen</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(requestDetails.reviewedAt)}</span>
                        </div>
                      </div>
                    )}
                    
                    {requestDetails?.rejectionReason && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Raison du rejet</label>
                        <div className="bg-red-50 border border-red-200 rounded p-3 mt-1">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 whitespace-pre-wrap">{requestDetails.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Dans la section "Historique et statut" */}
                    {requestDetails?.generatedCode && (
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Code d'invitation</label>
                        <div className={`border rounded p-3 mt-1 ${
                        requestDetails?.status === 'APPROVED' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-green-500" />
                            <span className="font-mono text-gray-700">{requestDetails.generatedCode}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                requestDetails?.isUsed 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                                {requestDetails?.isUsed ? 'Utilisé' : 'Actif'}
                            </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {requestDetails?.status === 'APPROVED'
                            ? 'Ce code a été envoyé par email à l\'entreprise pour compléter l\'inscription.'
                            : 'Code généré mais non envoyé (demande non approuvée).'
                            }
                        </p>
                        </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 md:p-12 text-center">
                <UserPlus className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Sélectionnez une demande
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Choisissez une demande d'adhésion dans la liste à gauche pour afficher et gérer les détails
                </p>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4 flex-shrink-0" />
                    <span>Visualisez les informations de l'entreprise</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span>Approuvez les demandes éligibles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <X className="h-4 w-4 flex-shrink-0" />
                    <span>Rejetez les demandes non conformes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Ajoutez des commentaires de rejet</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modale de revue */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {reviewStatus === 'APPROVED' ? 'Approuver la demande' : 'Rejeter la demande'}
              </h3>
              
              <div className="space-y-4">
                {reviewStatus === 'REJECTED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raison du rejet (optionnel)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                      rows="3"
                      placeholder="Ex: Entreprise ne répondant pas aux critères d'éligibilité..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cette raison sera enregistrée mais ne sera pas envoyée automatiquement à l'entreprise.
                    </p>
                  </div>
                )}
                
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Important</div>
                      <p className="text-sm text-yellow-700 mt-1">
                        {reviewStatus === 'APPROVED' 
                          ? 'L\'entreprise recevra un email avec un code d\'invitation valable 24 heures pour compléter son inscription.'
                          : 'L\'entreprise ne recevra pas de notification automatique. Vous devrez peut-être la contacter séparément.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  disabled={reviewing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleReviewRequest}
                  className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                    reviewStatus === 'APPROVED' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={reviewing}
                >
                  {reviewing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : reviewStatus === 'APPROVED' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {reviewing ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}