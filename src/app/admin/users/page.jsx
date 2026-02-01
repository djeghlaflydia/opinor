"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/app/components/AdminNavbar'
import { auth } from '@/app/lib/auth'
import { api } from '@/app/lib/api'
import { 
  Search, 
  Mail, 
  Building,
  Shield,
  ShieldOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  Send,
  Users,
  UserCheck,
  UserX,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  RefreshCw,
  Eye,
  Phone,
  Globe,
  Hash,
  Key,
  MessageSquare,
  CreditCard,
  Clock,
  Check,
  X,
  AlertCircle,
  User,
  TrendingUp,
  Lock,
  MapPin,
  Briefcase,
  Award,
  Star,
  MessageCircle,
  Download,
  Activity,
  Target,
  Tag
} from 'lucide-react'
import { format } from 'date-fns'

export default function AdminUsersPage() {
  const router = useRouter()

  // États pour les données
  const [users, setUsers] = useState([])
  const [statistics, setStatistics] = useState(null)
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterBusinessType, setFilterBusinessType] = useState('all')
  
  // États pour la pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [itemsPerPage] = useState(10)
  
  // États pour les modales
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showUnblockModal, setShowUnblockModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showBulkNotificationModal, setShowBulkNotificationModal] = useState(false)
  
  // États pour les notifications
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('system')
  const [selectedUsersForBulk, setSelectedUsersForBulk] = useState([])
  const [showUserSelection, setShowUserSelection] = useState(false)
  
  // Types de notifications prédéfinis
  const notificationTypes = [
    { value: 'system', label: 'Système', description: 'Notification système générale' },
    { value: 'critical_negative_feedback', label: 'Feedback négatif critique', description: 'Alerte pour feedback très négatif' },
    { value: 'critical_keywords', label: 'Mots-clés critiques', description: 'Détection de mots-clés critiques dans les feedbacks' },
    { value: 'low_satisfaction_score', label: 'Score de satisfaction bas', description: 'Score de satisfaction en dessous du seuil' },
    { value: 'positive_feedback', label: 'Feedback positif', description: 'Notification de feedback positif' },
    { value: 'compliment', label: 'Compliment', description: 'Client a fait un compliment' },
    { value: 'subscription_expiring', label: 'Abonnement expirant', description: 'Abonnement sur le point d\'expirer' },
    { value: 'payment_confirmed', label: 'Paiement confirmé', description: 'Confirmation de paiement' },
    { value: 'trial_ending', label: 'Essai se terminant', description: 'Fin de période d\'essai approchant' },
    { value: 'account_blocked', label: 'Compte bloqué', description: 'Notification de blocage de compte' },
    { value: 'account_unblocked', label: 'Compte débloqué', description: 'Notification de déblocage de compte' },
    { value: 'password_changed', label: 'Mot de passe changé', description: 'Changement de mot de passe réussi' },
    { value: 'admin_reply', label: 'Réponse admin', description: 'Réponse d\'un administrateur à un feedback' },
    { value: 'performance_drop', label: 'Baisse de performance', description: 'Baisse notable des performances' },
    { value: 'performance_improvement', label: 'Amélioration performance', description: 'Amélioration des performances' },
    { value: 'shift_performance', label: 'Performance par équipe', description: 'Performance par équipe ou par shift' },
    { value: 'report_ready', label: 'Rapport prêt', description: 'Rapport hebdomadaire/mensuel disponible' },
    { value: 'weekly_summary', label: 'Résumé hebdomadaire', description: 'Résumé des performances de la semaine' },
    { value: 'insight_alert', label: 'Alerte insight', description: 'Nouvel insight détecté' },
    { value: 'qr_first_scan', label: 'Premier scan QR', description: 'Premier scan d\'un QR code' },
    { value: 'qr_scan_milestone', label: 'Jalon scans QR', description: 'Nombre significatif de scans QR atteint' },
    { value: 'app_update', label: 'Mise à jour app', description: 'Nouvelle version de l\'application disponible' },
    { value: 'new_feedback', label: 'Nouveau feedback', description: 'Nouveau feedback reçu' },
    { value: 'achievement_unlocked', label: 'Succès débloqué', description: 'Nouveau succès débloqué' },
    { value: 'rating_alert', label: 'Alerte évaluation', description: 'Changement significatif dans les évaluations' }
  ]
  
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

  // Charger les données initiales
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError('')
      await Promise.all([
        fetchUsers(),
        fetchUserStatistics()
      ])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les utilisateurs avec filtres et pagination
  const fetchUsers = async (page = 1) => {
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
      
      if (filterBusinessType !== 'all') {
        params.businessType = filterBusinessType
      }
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      console.log('Fetching users with params:', params)
      
      const response = await api.getAllUsers(params)
      console.log('API Response structure:', response)
      
      // Extraire les données de la structure imbriquée
      let usersData = []
      let paginationData = {}
      
      if (response?.data?.data?.users) {
        // Structure: response.data.data.users
        usersData = response.data.data.users
        paginationData = response.data.data.pagination || {}
      } else if (response?.data?.users) {
        // Structure: response.data.users
        usersData = response.data.users
        paginationData = response.data.pagination || {}
      } else if (response?.users) {
        // Structure directe: response.users
        usersData = response.users
        paginationData = response.pagination || {}
      }
      
      console.log('Users data extracted:', usersData)
      console.log('Pagination data:', paginationData)
      
      setUsers(usersData || [])
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || itemsPerPage,
        total: paginationData.total || paginationData.totalUsers || usersData.length,
        totalPages: paginationData.totalPages || 1
      })
      
    } catch (err) {
      console.error('Error fetching users:', err)
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

  // Récupérer les statistiques des utilisateurs
  const fetchUserStatistics = async () => {
    try {
      const response = await api.getUserStatistics()
      console.log('User statistics response:', response)
      
      setStatistics(response)
    } catch (err) {
      console.warn('Error fetching user statistics:', err)
      // Calculer les statistiques à partir des utilisateurs actuels
      calculateStatisticsFromUsers()
    }
  }

  // Calculer les statistiques à partir des utilisateurs
  const calculateStatisticsFromUsers = () => {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.isActive && !u.isBlocked).length
    const blockedUsers = users.filter(u => u.isBlocked).length
    const inactiveUsers = users.filter(u => !u.isActive).length
    
    // Compter les types d'entreprise
    const businessTypes = {}
    users.forEach(user => {
      const type = user.businessType || 'UNKNOWN'
      businessTypes[type] = (businessTypes[type] || 0) + 1
    })
    
    setStatistics({
      overview: {
        totalUsers,
        activeUsers,
        blockedUsers,
        inactiveUsers,
        businessTypes
      }
    })
  }

  // Quand les utilisateurs changent, recalculer les statistiques si nécessaire
  useEffect(() => {
    if (users.length > 0 && !statistics) {
      calculateStatisticsFromUsers()
    }
  }, [users, statistics])

  // Récupérer les détails d'un utilisateur
  const fetchUserDetails = async (userId) => {
    try {
      // Puisque l'endpoint /api/v1/admin/users/{id} n'existe pas,
      // on utilise les données déjà chargées
      const user = users.find(u => u.id === userId)
      
      if (!user) {
        console.warn(`User ${userId} not found in current list`)
        return {
          id: userId,
          name: 'Utilisateur non trouvé',
          email: 'N/A',
          isActive: false,
          isBlocked: false
        }
      }
      
      return user
      
    } catch (err) {
      console.warn('Error fetching user details:', err)
      const user = users.find(u => u.id === userId)
      return user || null
    }
  }

  // Actions sur les utilisateurs
  const blockUser = async (userId) => {
    try {
      await api.blockUser(userId)
      setSuccessMessage('Utilisateur bloqué avec succès')
      setShowBlockModal(false)
      fetchUsers(pagination.page)
    } catch (err) {
      console.warn('Error blocking user:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors du blocage')
      throw err
    }
  }

  const unblockUser = async (userId) => {
    try {
      await api.unblockUser(userId)
      setSuccessMessage('Utilisateur débloqué avec succès')
      setShowUnblockModal(false)
      fetchUsers(pagination.page)
    } catch (err) {
      console.warn('Error unblocking user:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors du déblocage')
      throw err
    }
  }

  const sendNotification = async (userId, notificationData) => {
    try {
      // S'assurer que le type est valide
      if (!notificationTypes.some(t => t.value === notificationData.type)) {
        setError(`Type de notification invalide. Choisissez parmi: ${notificationTypes.map(t => t.value).join(', ')}`)
        return
      }
      
      await api.sendNotificationToUser(userId, notificationData)
      setSuccessMessage('Notification envoyée avec succès')
      setShowNotificationModal(false)
      resetNotificationForm()
    } catch (err) {
      console.warn('Error sending notification:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de l\'envoi de la notification')
      throw err
    }
  }

  const sendBulkNotification = async (notificationData) => {
    try {
      // S'assurer que le type est valide
      if (!notificationTypes.some(t => t.value === notificationData.type)) {
        setError(`Type de notification invalide. Choisissez parmi: ${notificationTypes.map(t => t.value).join(', ')}`)
        return
      }
      
      await api.sendBulkNotification(notificationData)
      setSuccessMessage(`Notifications envoyées à ${selectedUsersForBulk.length} utilisateurs`)
      setShowBulkNotificationModal(false)
      resetNotificationForm()
      setSelectedUsersForBulk([])
    } catch (err) {
      console.warn('Error sending bulk notification:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de l\'envoi des notifications')
      throw err
    }
  }

  const sendNotificationToAll = async (notificationData) => {
    try {
      // S'assurer que le type est valide
      if (!notificationTypes.some(t => t.value === notificationData.type)) {
        setError(`Type de notification invalide. Choisissez parmi: ${notificationTypes.map(t => t.value).join(', ')}`)
        return
      }
      
      if (window.confirm(`Êtes-vous sûr de vouloir envoyer cette notification à tous les utilisateurs (${users.length}) ?`)) {
        await api.sendNotificationToAllUsers(notificationData)
        setSuccessMessage(`Notification envoyée à tous les utilisateurs (${users.length})`)
        resetNotificationForm()
      }
    } catch (err) {
      console.warn('Error sending notification to all:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err?.message || 'Erreur lors de l\'envoi de la notification')
      throw err
    }
  }

  // Handlers pour les actions
  const handleViewDetails = async (user) => {
    try {
      const details = await fetchUserDetails(user.id)
      setSelectedUser(details || user)
      setShowDetailsModal(true)
    } catch (err) {
      setSelectedUser(user)
      setShowDetailsModal(true)
    }
  }

  const handleBlockClick = (user) => {
    setSelectedUser(user)
    setShowBlockModal(true)
  }

  const handleUnblockClick = (user) => {
    setSelectedUser(user)
    setShowUnblockModal(true)
  }

  const handleNotificationClick = (user) => {
    setSelectedUser(user)
    setNotificationTitle('')
    setNotificationMessage('')
    setNotificationType('system')
    setShowNotificationModal(true)
  }

  const handleBulkNotificationClick = () => {
    setShowBulkNotificationModal(true)
  }

  const handleNotificationToAllClick = () => {
    const notificationData = {
      title: notificationTitle || 'Notification système',
      message: notificationMessage,
      type: notificationType
    }
    sendNotificationToAll(notificationData)
  }

  const handleSelectUserForBulk = (userId) => {
    setSelectedUsersForBulk(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAllUsers = () => {
    if (selectedUsersForBulk.length === users.length) {
      setSelectedUsersForBulk([])
    } else {
      setSelectedUsersForBulk(users.map(user => user.id))
    }
  }

  const handleSubmitNotification = async () => {
    if (!selectedUser || !notificationMessage.trim()) {
      setError('Veuillez saisir un message pour la notification')
      return
    }
    
    const notificationData = {
      title: notificationTitle || 'Notification système',
      message: notificationMessage,
      type: notificationType
    }
    
    try {
      await sendNotification(selectedUser.id, notificationData)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  const handleSubmitBulkNotification = async () => {
    if (selectedUsersForBulk.length === 0 || !notificationMessage.trim()) {
      setError('Veuillez sélectionner au moins un utilisateur et saisir un message')
      return
    }
    
    const notificationData = {
      userIds: selectedUsersForBulk,
      title: notificationTitle || 'Notification système',
      message: notificationMessage,
      type: notificationType
    }
    
    try {
      await sendBulkNotification(notificationData)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  const handleConfirmBlock = async () => {
    if (!selectedUser) return
    try {
      await blockUser(selectedUser.id)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  const handleConfirmUnblock = async () => {
    if (!selectedUser) return
    try {
      await unblockUser(selectedUser.id)
    } catch (err) {
      // L'erreur est déjà gérée dans la fonction
    }
  }

  // Appliquer les filtres
  const applyFilters = () => {
    fetchUsers(1) // Revenir à la page 1
  }

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterBusinessType('all')
    fetchUsers(1)
  }

  // Réinitialiser le formulaire de notification
  const resetNotificationForm = () => {
    setNotificationTitle('')
    setNotificationMessage('')
    setNotificationType('system')
  }

  // Navigation de page
  const handlePageChange = (newPage) => {
    fetchUsers(newPage)
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
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch (err) {
      return 'Date invalide'
    }
  }

  const getStatusDisplay = (user) => {
    if (user.isBlocked) {
      return 'Bloqué'
    }
    if (!user.isActive) {
      return 'Inactif'
    }
    return 'Actif'
  }

  const getStatusColor = (user) => {
    if (user.isBlocked) {
      return 'bg-red-100 text-red-800'
    }
    if (!user.isActive) {
      return 'bg-gray-100 text-gray-800'
    }
    return 'bg-green-100 text-green-800'
  }

  const getBusinessTypeDisplay = (type) => {
    const typeMap = {
      'RETAIL': 'Commerce',
      'CLINIC': 'Clinique',
      'BEACH': 'Plage',
      'HOTEL': 'Hôtel',
      'RESTAURANT': 'Restaurant',
      'SERVICE': 'Service',
      'OTHER': 'Autre',
      'MEDICAL': 'Médical',
      'EDUCATION': 'Éducation',
      'ENTERTAINMENT': 'Divertissement'
    }
    return typeMap[type] || type
  }

  const getBusinessTypeColor = (type) => {
    const colorMap = {
      'RETAIL': 'bg-blue-100 text-blue-800',
      'CLINIC': 'bg-purple-100 text-purple-800',
      'BEACH': 'bg-teal-100 text-teal-800',
      'HOTEL': 'bg-amber-100 text-amber-800',
      'RESTAURANT': 'bg-orange-100 text-orange-800',
      'SERVICE': 'bg-pink-100 text-pink-800',
      'MEDICAL': 'bg-red-100 text-red-800',
      'EDUCATION': 'bg-indigo-100 text-indigo-800',
      'ENTERTAINMENT': 'bg-yellow-100 text-yellow-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    }
    return colorMap[type] || 'bg-gray-100 text-gray-800'
  }

  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.businessName || 'N/A'
  }

  const getNotificationTypeLabel = (type) => {
    const notificationType = notificationTypes.find(t => t.value === type)
    return notificationType ? notificationType.label : type
  }

  const getStatusFilterOptions = () => {
    return [
      { value: 'all', label: 'Tous les statuts' },
      { value: 'active', label: 'Actifs' },
      { value: 'blocked', label: 'Bloqués' },
      { value: 'inactive', label: 'Inactifs' }
    ]
  }

  // Composant de chargement
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="lg:ml-64 pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#038788] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des utilisateurs...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-2">
              Gérez les propriétaires d'entreprise, bloquez/débloquez les comptes, envoyez des notifications
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkNotificationClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={refreshing || users.length === 0}
            >
              <Send className="h-4 w-4" />
              Notifier plusieurs
            </button>
            <button
              onClick={() => fetchUsers(pagination.page)}
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
                  <p className="text-sm text-gray-500">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.overview.totalUsers || users.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-[#038788]" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.overview.activeUsers || users.filter(u => u.isActive && !u.isBlocked).length || 0}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bloqués</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statistics.overview.blockedUsers || users.filter(u => u.isBlocked).length || 0}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Types d'entreprise</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {Object.keys(statistics.overview.businessTypes || {}).length || 
                     new Set(users.map(u => u.businessType).filter(Boolean)).size || 0}
                  </p>
                </div>
                <Building className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>
        )}

       {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Première ligne : Recherche et filtres */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                {/* Champ de recherche */}
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom, email, entreprise, code unique..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                    />
                  </div>
                </div>

                {/* Filtre par statut */}
                <div className="flex-1 min-w-[150px]">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#038788]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    {getStatusFilterOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={applyFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50 h-[42px]"
                    disabled={refreshing}
                  >
                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                    Appliquer
                  </button>
                  
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 h-[42px]"
                    disabled={refreshing}
                  >
                    <X className="h-4 w-4" />
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {refreshing ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#038788]" />
              <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          {showUserSelection && (
                            <input
                              type="checkbox"
                              checked={selectedUsersForBulk.length === users.length}
                              onChange={handleSelectAllUsers}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-[#038788] focus:ring-[#038788]"
                            />
                          )}
                          Utilisateur
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code Unique
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-gray-50 ${user.isBlocked ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {showUserSelection && (
                              <input
                                type="checkbox"
                                checked={selectedUsersForBulk.includes(user.id)}
                                onChange={() => handleSelectUserForBulk(user.id)}
                                className="mr-3 h-4 w-4 rounded border-gray-300 text-[#038788] focus:ring-[#038788]"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {getFullName(user)}
                                  </span>
                                  {user.isBlocked && (
                                    <Lock className="h-4 w-4 text-red-500 inline ml-2" />
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-900 block">
                                {user.businessName || 'Non spécifié'}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                {user.businessType && (
                                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getBusinessTypeColor(user.businessType)} whitespace-nowrap`}>
                                    {getBusinessTypeDisplay(user.businessType)}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-gray-900">
                              {user.uniqueCode || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user)} whitespace-nowrap`}>
                              {getStatusDisplay(user)}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Voir les détails"
                              disabled={refreshing}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleNotificationClick(user)}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Envoyer une notification"
                              disabled={refreshing}
                            >
                              <Bell className="h-4 w-4" />
                            </button>
                            
                            {user.isBlocked ? (
                              <button
                                onClick={() => handleUnblockClick(user)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Débloquer l'utilisateur"
                                disabled={refreshing}
                              >
                                <Shield className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockClick(user)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Bloquer l'utilisateur"
                                disabled={refreshing}
                              >
                                <ShieldOff className="h-4 w-4" />
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

              {users.length === 0 && !refreshing && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterBusinessType !== 'all'
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Aucun utilisateur disponible pour le moment'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Détails de l'Utilisateur */}
        {showDetailsModal && selectedUser && (
          <Modal onClose={() => setShowDetailsModal(false)} title="Détails de l'Utilisateur">
            <div className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Informations Personnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom complet</label>
                    <div className="mt-1 text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {getFullName(selectedUser)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="mt-1 text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedUser.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Utilisateur</label>
                    <div className="mt-1 text-gray-900 font-mono text-sm break-all">
                      {selectedUser.id}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut du compte</label>
                    <div className="mt-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser)} whitespace-nowrap`}>
                        {getStatusDisplay(selectedUser)}
                        {selectedUser.isBlocked && <Lock className="h-3 w-3 ml-1" />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de l'entreprise */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Informations de l'Entreprise</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom de l'entreprise</label>
                    <div className="mt-1 text-gray-900 flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      {selectedUser.businessName || 'Non spécifié'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type d'entreprise</label>
                    <div className="mt-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getBusinessTypeColor(selectedUser.businessType)} whitespace-nowrap`}>
                        {getBusinessTypeDisplay(selectedUser.businessType)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Code Unique</label>
                    <div className="mt-1 text-gray-900 font-mono text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      {selectedUser.uniqueCode || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de blocage */}
              {selectedUser.isBlocked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-900 mb-2">Informations de blocage</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-red-700">Raison du blocage</label>
                      <div className="mt-1 text-red-900">
                        {selectedUser.blockedReason || 'Non spécifiée'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700">Date du blocage</label>
                      <div className="mt-1 text-red-900">
                        {selectedUser.blockedAt ? formatDate(selectedUser.blockedAt) : 'Date inconnue'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates importantes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Dates importantes</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date d'inscription</label>
                    <div className="mt-1 text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(selectedUser.createdAt)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dernière activité</label>
                    <div className="mt-1 text-gray-900 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Information non disponible'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleNotificationClick(selectedUser)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Notifier
                  </button>
                  {selectedUser.isBlocked ? (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleUnblockClick(selectedUser)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Débloquer
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleBlockClick(selectedUser)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                    >
                      <ShieldOff className="h-4 w-4" />
                      Bloquer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Bloquer l'Utilisateur */}
        {showBlockModal && selectedUser && (
          <Modal onClose={() => setShowBlockModal(false)} title="Confirmer le blocage">
            <div className="space-y-4">
              <div className="flex items-center justify-center text-yellow-600 mb-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <p className="text-center text-gray-700">
                Êtes-vous sûr de vouloir bloquer l'utilisateur <span className="font-semibold">{getFullName(selectedUser)}</span> ?
                L'utilisateur ne pourra plus se connecter.
              </p>
              <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Conséquences :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>L'utilisateur ne pourra plus se connecter</li>
                  <li>L'entreprise ne pourra plus recevoir de feedbacks</li>
                  <li>Toutes les sessions actives seront fermées</li>
                </ul>
              </div>
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmBlock}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  disabled={refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Bloquer
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Débloquer l'Utilisateur */}
        {showUnblockModal && selectedUser && (
          <Modal onClose={() => setShowUnblockModal(false)} title="Confirmer le déblocage">
            <div className="space-y-4">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <p className="text-center text-gray-700">
                Êtes-vous sûr de vouloir débloquer l'utilisateur <span className="font-semibold">{getFullName(selectedUser)}</span> ?
                L'utilisateur pourra à nouveau se connecter.
              </p>
              {selectedUser.blockedReason && (
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  <p className="font-medium">Raison actuelle du blocage :</p>
                  <p className="italic">{selectedUser.blockedReason}</p>
                </div>
              )}
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowUnblockModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmUnblock}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  disabled={refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Débloquer
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Envoyer une Notification */}
        {showNotificationModal && selectedUser && (
          <Modal onClose={() => setShowNotificationModal(false)} title="Envoyer une Notification">
            <div className="space-y-4">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Destinataire: <span className="font-semibold">{getFullName(selectedUser)}</span> ({selectedUser.email})
                </p>
                {selectedUser.uniqueCode && (
                  <p className="text-sm text-gray-700 mt-1">
                    Code Unique: <span className="font-mono">{selectedUser.uniqueCode}</span>
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la notification
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Titre de la notification..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#038788] focus:border-transparent"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Tapez votre message ici..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de notification
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {notificationTypes.find(t => t.value === notificationType)?.description || 'Sélectionnez un type'}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={refreshing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitNotification}
                  className="px-4 py-2 bg-[#038788] text-white rounded-md hover:bg-[#026b6b] flex items-center gap-2"
                  disabled={!notificationMessage.trim() || refreshing}
                >
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Envoyer
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Notification en Masse */}
        {showBulkNotificationModal && (
          <Modal onClose={() => setShowBulkNotificationModal(false)} title="Notification en Masse">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Sélectionnez les utilisateurs à notifier
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedUsersForBulk.length} utilisateur sélectionné sur {users.length}
                  </p>
                </div>
                <button
                  onClick={() => setShowUserSelection(!showUserSelection)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {showUserSelection ? 'Masquer la sélection' : 'Sélectionner manuellement'}
                </button>
              </div>
              
              {showUserSelection && (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedUsersForBulk.includes(user.id)}
                          onChange={() => handleSelectUserForBulk(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#038788] focus:ring-[#038788]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{getFullName(user)}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          {user.uniqueCode && (
                            <p className="text-xs text-gray-400 font-mono truncate">{user.uniqueCode}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(user)} whitespace-nowrap`}>
                        {getStatusDisplay(user)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUsersForBulk(users.filter(u => u.isActive && !u.isBlocked).map(u => u.id))}
                  className="flex-1 text-xs px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 whitespace-nowrap"
                >
                  Sélectionner actifs
                </button>
                <button
                  onClick={() => setSelectedUsersForBulk(users.filter(u => u.isBlocked).map(u => u.id))}
                  className="flex-1 text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 whitespace-nowrap"
                >
                  Sélectionner bloqués
                </button>
                <button
                  onClick={() => setSelectedUsersForBulk([])}
                  className="flex-1 text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 whitespace-nowrap"
                >
                  Tout désélectionner
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la notification
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Titre de la notification..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#038788] focus:border-transparent"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Tapez votre message ici..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de notification
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {notificationTypes.find(t => t.value === notificationType)?.description || 'Sélectionnez un type'}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <div className="flex space-x-3">
                  <button
                    onClick={selectedUsersForBulk.length > 0 ? handleSubmitBulkNotification : handleNotificationToAllClick}
                    className="px-4 py-2 bg-[#038788] text-white rounded-md hover:bg-[#026b6b] flex items-center gap-2"
                    disabled={!notificationMessage.trim() || refreshing}
                  >
                    {refreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {selectedUsersForBulk.length > 0 
                          ? `Envoyer (${selectedUsersForBulk.length})`
                          : 'Notifier tous les utilisateurs'
                        }
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowBulkNotificationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={refreshing}
                  >
                    Annuler
                  </button>
                </div>
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