"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/app/components/AdminNavbar'
import { auth } from '@/app/lib/auth'
import { api } from '@/app/lib/api'
import { 
  QrCode, 
  Search, 
  Download, 
  RefreshCw, 
  BarChart3, 
  TrendingUp,
  Calendar,
  MapPin,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
  Hash,
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  Star,
  Globe,
  AlertTriangle,
  Printer
} from 'lucide-react'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'

export default function AdminQRCodePage() {
  const router = useRouter()

  // États pour les données
  const [businesses, setBusinesses] = useState([])
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [qrCodeStats, setQrCodeStats] = useState(null)
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [businessTypes] = useState(['restaurant', 'hotel', 'retail', 'service', 'other'])
  
  // États pour la pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  
  // États pour le chargement
  const [loading, setLoading] = useState(true)
  const [loadingQRCode, setLoadingQRCode] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [copied, setCopied] = useState(false)

  // Vérifier l'authentification
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchBusinesses()
  }, [router])

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

  // Récupérer la liste des entreprises
  const fetchBusinesses = async (page = 1) => {
    try {
      setLoading(true)
      setError('')
      
      const params = {
        page,
        limit: 10,
        businessType: filterType !== 'all' ? filterType : undefined,
        search: searchTerm || undefined
      }
      
      console.log('Fetching businesses with params:', params)
      const response = await api.getAllUsers(params)
      console.log('Businesses API response:', response)
      
      let businessesData = []
      let paginationData = {}
      
      // CORRECTION : Extraire correctement les données selon la structure de l'API
      if (response?.data?.users) {
        // Structure: { data: { users: [...], pagination: {...} } }
        businessesData = response.data.users
        paginationData = response.data.pagination || {}
      } else if (response?.users) {
        // Structure alternative: { users: [...], pagination: {...} }
        businessesData = response.users
        paginationData = response.pagination || {}
      } else if (Array.isArray(response)) {
        // Juste un tableau
        businessesData = response
      } else if (response?.data && Array.isArray(response.data)) {
        // Structure: { data: [...] }
        businessesData = response.data
      }
      
      console.log('Businesses data extracted:', businessesData)
      
      // Filtrer pour n'avoir que les entreprises
      const filteredBusinesses = Array.isArray(businessesData) 
        ? businessesData.filter(user => 
            user.role !== 'admin' && (user.businessType || user.role === 'business')
          )
        : []
      
      console.log('Filtered businesses:', filteredBusinesses)
      
      setBusinesses(filteredBusinesses)
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || 10,
        total: paginationData.total || filteredBusinesses.length,
        totalPages: paginationData.totalPages || 1
      })
      
    } catch (err) {
      console.error('Error fetching businesses:', err)
      if (err?.message?.includes('401') || err?.message?.includes('Non authentifié')) {
        auth.logout()
        router.push('/login')
        return
      }
      setError(err.message || 'Erreur lors du chargement des entreprises')
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les données du QR Code
  const fetchQRCodeData = async (businessId) => {
    try {
      setLoadingQRCode(true)
      setError('')
      
      const data = await api.getBusinessQRCode(businessId)
      console.log('QR Code data received:', data)
      
      // CORRECTION : Vérifier si le QR Code existe dans différentes structures
      let qrCodeInfo = null
      
      if (data?.qrCode) {
        qrCodeInfo = data
      } else if (data?.data?.qrCode) {
        qrCodeInfo = data.data
      }
      
      if (qrCodeInfo && qrCodeInfo.qrCode) {
        setQrCodeData(qrCodeInfo)
        setSuccessMessage('QR Code chargé avec succès')
        
        // Récupérer les statistiques
        await fetchQRCodeStatistics(businessId)
      } else {
        setQrCodeData(null)
        setQrCodeStats(null)
        setError('Aucun QR Code trouvé pour cette entreprise')
      }
      
    } catch (err) {
      console.error('Error fetching QR code:', err)
      if (err?.message?.includes('404')) {
        setQrCodeData(null)
        setQrCodeStats(null)
        setError('Cette entreprise n\'a pas encore de QR Code')
      } else if (err?.message?.includes('401')) {
        auth.logout()
        router.push('/login')
      } else {
        setError(err.message || 'Erreur lors du chargement du QR Code')
      }
    } finally {
      setLoadingQRCode(false)
    }
  }

  // Récupérer les statistiques
  const fetchQRCodeStatistics = async (businessId) => {
    try {
      setLoadingStats(true)
      
      const data = await api.getQRCodeStatistics(businessId)
      console.log('QR Code stats received:', data)
      
      // CORRECTION : Extraire les statistiques de différentes structures
      let stats = null
      
      if (data?.totalScans !== undefined) {
        stats = data
      } else if (data?.data?.totalScans !== undefined) {
        stats = data.data
      }
      
      if (stats) {
        setQrCodeStats(stats)
      }
      
    } catch (err) {
      console.error('Error fetching QR code statistics:', err)
      // Ne pas afficher d'erreur pour les statistiques, c'est optionnel
    } finally {
      setLoadingStats(false)
    }
  }

  // Régénérer un QR Code
  const handleRegenerateQRCode = async () => {
    if (!selectedBusiness) return
    
    if (!confirm('Êtes-vous sûr de vouloir régénérer ce QR Code ? L\'ancien code ne fonctionnera plus.')) {
      return
    }
    
    try {
      setRegenerating(true)
      setError('')
      
      const result = await api.regenerateQRCode(selectedBusiness.id)
      console.log('QR Code regenerated result:', result)
      
      // CORRECTION : Extraire les données régénérées
      let qrCodeDataRegenerated = result?.data
      
      if (qrCodeDataRegenerated) {
        setQrCodeData(qrCodeDataRegenerated)
        setSuccessMessage(result.message || 'QR Code régénéré avec succès !')
        
        // Réinitialiser et recharger les statistiques
        setQrCodeStats(null)
        await fetchQRCodeStatistics(selectedBusiness.id)
      } else {
        throw new Error('Données du QR Code manquantes dans la réponse')
      }
      
    } catch (err) {
      console.error('Error regenerating QR code:', err)
      setError(err.message || 'Erreur lors de la régénération du QR Code')
    } finally {
      setRegenerating(false)
    }
  }

  // Sélectionner une entreprise
  const handleSelectBusiness = (business) => {
    console.log('Selecting business:', business)
    setSelectedBusiness(business)
    setQrCodeData(null)
    setQrCodeStats(null)
    setError('')
    setSuccessMessage('')
    fetchQRCodeData(business.id)
  }

  // Copier le lien
  const handleCopyLink = () => {
    if (!qrCodeData?.feedbackUrl) return
    
    navigator.clipboard.writeText(qrCodeData.feedbackUrl)
    setCopied(true)
    setSuccessMessage('Lien copié dans le presse-papier !')
    
    setTimeout(() => setCopied(false), 2000)
  }

  // Télécharger le QR Code
  const handleDownloadQRCode = () => {
    if (!qrCodeData?.qrCode) return
    
    const link = document.createElement('a')
    link.href = qrCodeData.qrCode
    link.download = `qrcode-${selectedBusiness?.uniqueCode || 'business'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setSuccessMessage('QR Code téléchargé avec succès !')
  }

  // Imprimer le QR Code
  const handlePrintQRCode = () => {
    if (!qrCodeData?.qrCode) return
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${selectedBusiness?.name || 'Entreprise'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 40px;
            }
            .header {
              margin-bottom: 30px;
            }
            .qr-code {
              margin: 20px auto;
              padding: 20px;
              border: 2px solid #ccc;
              display: inline-block;
            }
            .info {
              margin-top: 30px;
              text-align: left;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            }
            .url {
              word-break: break-all;
              background: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              margin: 10px 0;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>QR Code Feedback</h1>
            <h2>${selectedBusiness?.name || 'Entreprise'}</h2>
            <p>Code Unique: ${selectedBusiness?.uniqueCode || 'N/A'}</p>
          </div>
          
          <div class="qr-code">
            <img src="${qrCodeData.qrCode}" alt="QR Code" width="300" height="300">
          </div>
          
          <div class="info">
            <h3>Instructions:</h3>
            <p>1. Scannez ce QR Code avec votre téléphone</p>
            <p>2. Donnez votre avis sur notre service</p>
            <p>3. Vos feedbacks nous aident à nous améliorer</p>
            
            <div class="url">
              <strong>URL:</strong><br>
              ${qrCodeData.feedbackUrl}
            </div>
            
            <p><small>Généré le: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</small></p>
          </div>
          
          <div class="no-print" style="margin-top: 40px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #038788; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimer
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #ccc; color: #333; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
              Fermer
            </button>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Appliquer les filtres
  const applyFilters = () => {
    fetchBusinesses(1)
  }

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    fetchBusinesses(1)
  }

  // Navigation de page
  const handlePageChange = (newPage) => {
    fetchBusinesses(newPage)
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

  // Formater le type d'entreprise
  const formatBusinessType = (type) => {
    const typeLower = (type || '').toLowerCase()
    const types = {
      'restaurant': '🍽️ Restaurant',
      'hotel': '🏨 Hôtel',
      'retail': '🛒 Commerce',
      'service': '🔧 Service',
      'other': '🏢 Autre'
    }
    return types[typeLower] || type
  }

  // Calculer le taux de conversion
  const calculateConversionRate = () => {
    if (!qrCodeStats) return 0
    const totalScans = qrCodeStats.totalScans || qrCodeStats.scans || 0
    const feedbacks = qrCodeStats.feedbacksGenerated || 0
    if (totalScans === 0) return 0
    return ((feedbacks / totalScans) * 100).toFixed(1)
  }

  // CORRECTION : Fonction pour extraire le nom de l'entreprise
  const getBusinessName = (business) => {
    return business?.name || business?.businessName || business?.companyName || 'Entreprise sans nom'
  }

  // CORRECTION : Fonction pour extraire le code unique
  const getBusinessUniqueCode = (business) => {
    return business?.uniqueCode || business?.code || business?.reference || 'N/A'
  }

  // CORRECTION : Fonction pour extraire l'email
  const getBusinessEmail = (business) => {
    return business?.email || business?.contactEmail || 'N/A'
  }

  // Composant de chargement principal
  if (loading && businesses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="lg:ml-64 pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#038788] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des entreprises...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des QR Codes</h1>
            <p className="text-gray-600 mt-2">
              Gérez les QR Codes des entreprises et suivez les statistiques de scans
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchBusinesses(pagination.page)}
              className="flex items-center gap-2 px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="hidden sm:inline">Rafraîchir</span>
            </button>
          </div>
        </div>

        {/* Contenu principal en 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : Liste des entreprises */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar - Prend tout l'espace disponible */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom ou code unique"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                    />
                  </div>
                </div>
                
                {/* Boutons - S'adaptent à la ligne */}
                <div className="flex gap-2 items-end">
                  <button
                    onClick={applyFilters}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] disabled:opacity-50"
                    disabled={loading}
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des entreprises */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Entreprises</h3>
                  <span className="text-sm text-gray-500">
                    {pagination.total} entreprise{pagination.total !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[540px] overflow-y-auto">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedBusiness?.id === business.id ? 'bg-blue-50 border-r-4 border-[#038788]' : ''
                    }`}
                    onClick={() => handleSelectBusiness(business)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">
                          {getBusinessName(business)}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                        business.isBlocked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {business.isBlocked ? 'Bloqué' : 'Actif'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3 flex-shrink-0" />
                        <span className="font-mono truncate">{getBusinessUniqueCode(business)}</span>
                      </div>
                      <div className="truncate">{getBusinessEmail(business)}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded truncate">
                          {formatBusinessType(business.businessType)}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(business.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {businesses.length === 0 && !loading && (
                  <div className="text-center py-12 px-4">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterType !== 'all'
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Aucune entreprise disponible'}
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

          {/* Colonne droite : Détails du QR Code */}
          <div className="lg:col-span-2">
            {selectedBusiness ? (
              <div className="space-y-6">
                {/* Header de l'entreprise */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Building className="h-6 w-6 text-[#038788] flex-shrink-0" />
                        <span className="truncate">{getBusinessName(selectedBusiness)}</span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Hash className="h-4 w-4 flex-shrink-0" />
                          <span className="font-mono truncate">{getBusinessUniqueCode(selectedBusiness)}</span>
                        </div>
                        <div className="truncate">{getBusinessEmail(selectedBusiness)}</div>
                        <span className="px-2 py-1 bg-gray-100 rounded whitespace-nowrap">
                          {formatBusinessType(selectedBusiness.businessType)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleRegenerateQRCode}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 whitespace-nowrap"
                      disabled={regenerating || loadingQRCode}
                      title="Générer un nouveau QR Code"
                    >
                      {regenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Régénérer QR</span>
                    </button>
                  </div>
                </div>

                {/* QR Code et Statistiques - sur 2 colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* QR Code Card */}
                  <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      QR Code
                    </h3>
                    
                    {loadingQRCode ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[#038788] mx-auto mb-4" />
                          <p className="text-gray-600">Chargement du QR Code...</p>
                        </div>
                      </div>
                    ) : qrCodeData?.qrCode ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative group">
                            <img
                              src={qrCodeData.qrCode}
                              alt="QR Code"
                              className="w-48 h-48 border-2 border-gray-200 rounded-lg p-4 transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Lien de feedback</label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={qrCodeData.feedbackUrl || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm truncate"
                                title={qrCodeData.feedbackUrl}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCopyLink}
                                className="px-3 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] flex items-center gap-1 flex-shrink-0"
                                title="Copier le lien"
                              >
                                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <a
                                href={qrCodeData.feedbackUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 border border-[#038788] text-[#038788] rounded-lg hover:bg-[#038788] hover:text-white flex items-center gap-1 flex-shrink-0"
                                title="Ouvrir le lien"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={handleDownloadQRCode}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            title="Télécharger le QR Code"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Télécharger</span>
                          </button>
                          <button
                            onClick={handlePrintQRCode}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                            title="Imprimer le QR Code"
                          >
                            <Printer className="h-4 w-4" />
                            <span className="hidden sm:inline">Imprimer</span>
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500 space-y-1 pt-2 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span>Scans totaux:</span>
                            <span className="font-medium">{qrCodeData.scans || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Créé le:</span>
                            <span>{formatDate(qrCodeData.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mis à jour:</span>
                            <span>{formatDate(qrCodeData.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">QR Code non disponible</h3>
                        <p className="text-gray-500 mb-4">
                          Cette entreprise n'a pas encore de QR Code généré.
                        </p>
                        <button
                          onClick={handleRegenerateQRCode}
                          className="px-4 py-2 bg-[#038788] text-white rounded-lg hover:bg-[#026b6b] flex items-center gap-2 mx-auto"
                          disabled={regenerating}
                        >
                          {regenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Générer un QR Code
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Statistiques Card */}
                  <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Statistiques
                    </h3>
                    
                    {loadingStats ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-[#038788]" />
                      </div>
                    ) : qrCodeStats ? (
                      <div className="space-y-6">
                        {/* Statistiques principales */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-blue-700">Scans totaux</span>
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {(qrCodeStats.totalScans || qrCodeStats.scans || 0).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-green-700">Taux de conversion</span>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                              {calculateConversionRate()}%
                            </div>
                          </div>
                        </div>
                        
                        {/* Statistiques détaillées */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Activité récente
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-gray-50 rounded p-3 text-center">
                                <div className="text-xs text-gray-500">Aujourd'hui</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {qrCodeStats.scansToday || 0}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded p-3 text-center">
                                <div className="text-xs text-gray-500">Cette semaine</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {qrCodeStats.scansThisWeek || 0}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded p-3 text-center">
                                <div className="text-xs text-gray-500">Ce mois</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {qrCodeStats.scansThisMonth || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Engagement
                            </h4>
                            <div className="bg-gray-50 rounded p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <div className="text-3xl font-bold text-gray-900">
                                    {(qrCodeStats.feedbacksGenerated || 0).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-500">Feedbacks générés</div>
                                </div>
                                <Star className="h-8 w-8 text-yellow-500" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Top locations */}
                          {qrCodeStats.topLocations && qrCodeStats.topLocations.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Top emplacements
                              </h4>
                              <div className="space-y-2">
                                {qrCodeStats.topLocations.map((location, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 truncate flex-1">
                                      {location.location}
                                    </span>
                                    <div className="flex items-center gap-2 ml-2">
                                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        {location.scans?.toLocaleString() || 0}
                                      </span>
                                      <span className="text-xs text-gray-500 whitespace-nowrap">
                                        ({location.percentage || 0}%)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Statistiques non disponibles</h3>
                        <p className="text-gray-500">
                          Les statistiques seront disponibles après les premiers scans du QR Code.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 md:p-12 text-center">
                <QrCode className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Sélectionnez une entreprise
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Choisissez une entreprise dans la liste à gauche pour afficher et gérer son QR Code
                </p>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4 flex-shrink-0" />
                    <span>Visualisez le QR Code et le lien de feedback</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Download className="h-4 w-4 flex-shrink-0" />
                    <span>Téléchargez le QR Code en haute résolution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4 flex-shrink-0" />
                    <span>Suivez les statistiques de scans et conversion</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 flex-shrink-0" />
                    <span>Régénérez le QR Code si nécessaire</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guide d'utilisation - EN DEHORS du grid, prend toute la largeur */}
        {selectedBusiness && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Guide d'utilisation du QR Code</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-blue-700 font-medium mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    1. Télécharger
                  </div>
                  <p className="text-sm text-blue-600">
                    Téléchargez le QR Code en haute résolution pour impression.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-green-700 font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    2. Placer
                  </div>
                  <p className="text-sm text-green-600">
                    Placez le QR Code aux endroits visibles : caisse, tables, sortie, etc.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-purple-700 font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    3. Analyser
                  </div>
                  <p className="text-sm text-purple-600">
                    Suivez les statistiques pour mesurer l'engagement des clients.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Important</div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Le QR Code génère un lien unique pour cette entreprise. Si vous régénérez le QR Code,
                      l'ancien lien ne fonctionnera plus et devra être remplacé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}