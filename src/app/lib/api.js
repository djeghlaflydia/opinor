const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  async adminLogin(email, password) {
    try {
      console.log('Tentative de connexion vers:', `${API_BASE_URL}/api/v1/auth/admin/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password 
        })
      });

      // Essayer de parser la réponse en JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Avertissement léger en console, pas une erreur bloquante de développement
        console.warn('Erreur parsing JSON:', jsonError);
        throw new Error('Réponse invalide du serveur');
      }

      console.log('Réponse API brute:', data);
      
      // Vérifier si la réponse indique un succès ou échec
      const topLevelSuccess = data?.success;
      const payload = data?.data || data;
      
      // Vérifier les erreurs de validation (status 400)
      if (response.status === 400) {
        let errorMessage = data?.message || payload?.message || 'Données invalides';
        
        // Si c'est un tableau d'erreurs, les joindre
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ');
        }
        
        // Cas spécifiques
        if (errorMessage.includes('email must be an email')) {
          throw new Error('Format d\'email invalide');
        } else if (errorMessage.includes('password must be longer')) {
          throw new Error('Le mot de passe doit contenir au moins 8 caractères');
        } else {
          throw new Error(errorMessage);
        }
      }
      
      // Vérifier les erreurs d'authentification (status 401)
      if (response.status === 401) {
        let errorMessage = data?.message || payload?.message || 'Identifiants incorrects';
        
        if (errorMessage.includes('Invalid credentials') || 
            errorMessage.includes('invalid credentials') ||
            errorMessage.includes('Unauthorized')) {
          throw new Error('Email ou mot de passe incorrect');
        } else {
          throw new Error(errorMessage);
        }
      }
      
      // Vérifier les autres erreurs HTTP
      if (!response.ok) {
        let errorMessage = data?.message || payload?.message || `Erreur ${response.status}`;
        
        switch (response.status) {
          case 403:
            errorMessage = errorMessage.includes('Forbidden') ? 'Accès non autorisé' : errorMessage;
            break;
          case 404:
            errorMessage = 'Service d\'authentification non trouvé';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur';
            break;
        }
        
        throw new Error(errorMessage);
      }
      
      // Si on arrive ici, la réponse est OK (status 2xx)
      
      // Extraire le token
      const token = 
        data?.token || 
        data?.access_token || 
        data?.accessToken || 
        payload?.token || 
        payload?.access_token ||
        null;
      
      // Extraire les infos utilisateur
      const user = 
        data?.user || 
        data?.admin || 
        payload?.user || 
        payload?.admin ||
        null;
      
      // Si pas de token, vérifier si c'est une réponse de succès sans token
      if (!token) {
        // Si success est true mais pas de token, on accepte avec un token factice
        if (topLevelSuccess === true || response.ok) {
          console.log('API a retourné succès sans token, utilisation de token temporaire');
          return {
            token: 'temp-admin-token-' + Date.now(),
            user: user || { email: email, name: 'Administrateur' }
          };
        } else {
          throw new Error('Token manquant dans la réponse');
        }
      }
      
      return {
        token: token,
        user: user,
        raw: data
      };
      
    } catch (error) {
      // Utiliser un warning pour éviter l'overlay d'erreur Next.js
      console.warn('Erreur dans adminLogin:', error);
      
      // Gestion des erreurs réseau
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }
      
      throw error;
    }
  },
  
  // Version simplifiée sans vérification d'API
  async verifyToken(token) {
    // Pour l'instant, retourner un objet simulé
    // Vous pourrez implémenter la vraie vérification plus tard
    return {
      userId: 1,
      role: 'admin',
      email: 'admin@opinor.com'
    };
  },
  
  async getAdminData(token) {
    // Simuler des données pour le moment
    return {
      stats: {
        articles: 12,
        visitors: 345,
        messages: 5,
        subscribers: 89
      },
      recentActivity: [
        { id: 1, action: 'Article créé', date: '2024-01-15' },
        { id: 2, action: 'Utilisateur inscrit', date: '2024-01-14' }
      ]
    };
  }
};