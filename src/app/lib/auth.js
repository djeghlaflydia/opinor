import Cookies from 'js-cookie';

export const auth = {
  // Sauvegarder le token
  setToken(token, userData = null) {
    if (typeof window !== 'undefined') {
      // Token dans cookie
      Cookies.set('adminToken', token, { 
        expires: 1, // 1 jour
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Données utilisateur dans localStorage
      if (userData) {
        localStorage.setItem('adminUser', JSON.stringify(userData));
      }
    }
  },
  
  // Récupérer le token
  getToken() {
    if (typeof window !== 'undefined') {
      return Cookies.get('adminToken');
    }
    return null;
  },
  
  // Vérifier si connecté
  isAuthenticated() {
    return !!this.getToken();
  },
  
  // Déconnexion
  logout() {
    if (typeof window !== 'undefined') {
      Cookies.remove('adminToken');
      localStorage.removeItem('adminUser');
    }
  },
  
  // Stocker les données utilisateur
  setUserData(data) {
    if (typeof window !== 'undefined' && data) {
      localStorage.setItem('adminUser', JSON.stringify(data));
    }
  },
  
  // Récupérer les données utilisateur
  getUserData() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('adminUser');
      return data ? JSON.parse(data) : null;
    }
    return null;
  },
  
  // Vérifier le token localement (simplifié)
  verifyLocalToken() {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérification basique - vous pouvez ajouter plus de logique ici
    try {
      const userData = this.getUserData();
      return !!userData;
    } catch (error) {
      return false;
    }
  }
};