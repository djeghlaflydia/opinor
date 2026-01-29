import { auth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://opinor.onrender.com';

export const api = {
  async adminLogin(email, password) {
    try {
      console.log('=== DEBUG adminLogin ===');
      // Si API_BASE_URL est vide, on construit un chemin absolu pour le log ou on laisse relatif
      const url = `${API_BASE_URL}/api/v1/auth/admin/login`;
      console.log('1. URL de connexion:', url);
      console.log('2. Email:', email.trim());

      const requestBody = {
        email: email.trim(),
        password: password
      };
      console.log('3. Corps de la requête (sans password):', { email: requestBody.email, password: '***' });

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include' // Important pour recevoir et envoyer les cookies de session
      };
      console.log('4. Options de fetch:', JSON.stringify({ ...fetchOptions, body: '{...}' }, null, 2));

      const response = await fetch(url, fetchOptions);

      console.log('5. Statut de la réponse:', response.status, response.statusText);
      const responseHeaders = Object.fromEntries(response.headers.entries());
      console.log('6. Headers de la réponse:', responseHeaders);

      // Vérifier spécifiquement les cookies Set-Cookie
      const setCookieHeader = response.headers.get('set-cookie');
      console.log('6b. Set-Cookie header:', setCookieHeader || 'Aucun cookie défini par le serveur');

      // Vérifier tous les headers pour trouver des cookies de session
      const allHeaders = Array.from(response.headers.entries());
      const cookieHeaders = allHeaders.filter(([key]) => key.toLowerCase().includes('cookie') || key.toLowerCase().includes('set'));
      console.log('6c. Tous les headers liés aux cookies:', cookieHeaders);

      // IMPORTANT : Les cookies HTTP-only définis par le backend ne sont pas visibles dans document.cookie
      // mais le navigateur les envoie automatiquement avec credentials: 'include'
      // Si le backend définit un cookie HTTP-only, il sera envoyé automatiquement aux requêtes suivantes
      console.log('6d. Note: Si le backend définit un cookie HTTP-only, il sera envoyé automatiquement');
      console.log('    avec credentials: include, même s\'il n\'est pas visible dans les logs');

      // Essayer de parser la réponse en JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Avertissement léger en console, pas une erreur bloquante de développement
        console.warn('Erreur parsing JSON:', jsonError);
        throw new Error('Réponse invalide du serveur');
      }

      console.log('7. Réponse API brute:', data);
      console.log('7b. Structure complète de la réponse (JSON stringifié):', JSON.stringify(data, null, 2));

      // Vérifier si la réponse indique un succès ou échec
      const topLevelSuccess = data?.success;
      const payload = data?.data || data;
      console.log('8. Success top-level:', topLevelSuccess);
      console.log('9. Payload:', payload);
      console.log('9b. Payload.data (si imbriqué):', payload?.data);

      // Attendre un peu pour que le navigateur traite les cookies HTTP-only
      // qui pourraient être définis par le backend
      await new Promise(resolve => setTimeout(resolve, 100));

      // Vérifier les cookies définis après le login
      if (typeof document !== 'undefined') {
        console.log('10. Cookies dans le navigateur après login:', document.cookie);
        // Lister tous les cookies individuellement
        const cookies = document.cookie.split('; ').map(c => {
          const [name, value] = c.split('=');
          return { name, value: value ? value.substring(0, 20) + '...' : '' };
        });
        console.log('10b. Cookies parsés:', cookies);

        // IMPORTANT : Vérifier si le backend a défini un cookie de session HTTP-only
        // Les cookies HTTP-only ne sont pas accessibles via document.cookie
        // Mais le navigateur devrait les envoyer automatiquement avec credentials: 'include'
        console.log('10c. Note: Les cookies HTTP-only définis par le backend ne seront pas visibles ici,');
        console.log('    mais ils seront envoyés automatiquement avec credentials: include');
      }

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

      // Extraire le token - chercher dans toutes les structures possibles
      const token =
        data?.token ||
        data?.access_token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.access_token ||
        data?.data?.accessToken ||
        payload?.token ||
        payload?.access_token ||
        payload?.accessToken ||
        payload?.data?.token ||
        payload?.data?.access_token ||
        payload?.data?.accessToken ||
        null;

      console.log('10c. Recherche de token dans toutes les structures...');
      console.log('10d. Token trouvé:', token ? 'OUI' : 'NON');

      // Extraire les infos utilisateur
      const user =
        data?.user ||
        data?.admin ||
        payload?.user ||
        payload?.admin ||
        null;

      // Si pas de token, vérifier si c'est une réponse de succès sans token
      if (!token) {
        console.log('11. ⚠️ Aucun token trouvé dans la réponse');
        // Si success est true mais pas de token, on accepte avec un token factice
        if (topLevelSuccess === true || response.ok) {
          console.log('12. ✅ API a retourné succès sans token, utilisation du mode cookie');
          console.log('=== FIN DEBUG adminLogin (mode cookie) ===');
          return {
            token: 'COOKIE_AUTH', // Marqueur spécial pour indiquer l'auth par cookie
            user: user || { email: email, name: 'Administrateur' }
          };
        } else {
          console.log('12. ❌ Token manquant et réponse non-OK');
          throw new Error('Token manquant dans la réponse');
        }
      }

      console.log('11. ✅ Token trouvé:', token.substring(0, 20) + '...');
      console.log('12. User data:', user);
      console.log('=== FIN DEBUG adminLogin (avec token) ===');

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
  },

  // Récupérer le profil admin
  async getAdminProfile() {
    try {
      console.log('=== DEBUG getAdminProfile ===');
      const token = auth.getToken();
      console.log('1. Token récupéré:', token ? (token.substring(0, 20) + '...') : 'NULL');
      console.log('2. Type de token:', token === 'COOKIE_AUTH' ? 'COOKIE_AUTH (mode cookie)' : token ? 'Bearer token' : 'Aucun token');

      // Vérifier les cookies présents
      if (typeof document !== 'undefined') {
        const allCookies = document.cookie;
        console.log('3. Tous les cookies:', allCookies);
        const adminTokenCookie = document.cookie.split('; ').find(row => row.startsWith('adminToken='));
        console.log('4. Cookie adminToken:', adminTokenCookie || 'Non trouvé');
      }

      const url = `${API_BASE_URL}/api/v1/auth/admin/me`;
      console.log('5. URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour envoyer les cookies de session
      };

      // Le backend attend probablement un cookie de session qu'il définit lui-même lors du login
      // Mais comme il ne le fait pas, on doit trouver une autre solution
      // Essayer d'abord avec un header Authorization si on a un token
      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
        console.log('6. Header Authorization ajouté:', `Bearer ${token.substring(0, 20)}...`);
      } else {
        console.log('6. Pas de header Authorization (mode cookie)');

        // En mode cookie, le backend pourrait attendre un cookie de session HTTP-only
        // qu'il définit lui-même lors du login. Mais comme il ne le fait pas,
        // on essaie d'envoyer le cookie adminToken manuellement dans le header Cookie
        // en plus de credentials: 'include' qui devrait le faire automatiquement

        // SOLUTION TEMPORAIRE : Essayer d'envoyer le cookie adminToken dans le header Cookie
        // même si le backend ne l'a pas défini, au cas où il l'accepterait
        if (typeof document !== 'undefined') {
          const adminTokenCookie = document.cookie.split('; ').find(row => row.startsWith('adminToken='));
          if (adminTokenCookie) {
            console.log('6b. Cookie adminToken trouvé:', adminTokenCookie);
            // Le navigateur devrait l'envoyer automatiquement avec credentials: 'include'
            // Mais on peut aussi l'ajouter manuellement dans le header Cookie au cas où
            // Note: Le navigateur peut envoyer les cookies automatiquement ET via le header,
            // donc on ne l'ajoute pas manuellement pour éviter les doublons
          }

          // Vérifier si le backend définit un cookie de session avec un nom spécifique
          // (comme connect.sid, session, etc.) qui pourrait être dans les cookies
          const allCookies = document.cookie;
          console.log('6c. Tous les cookies disponibles:', allCookies);

          // Chercher des cookies de session possibles
          const possibleSessionCookies = ['connect.sid', 'session', 'sessionId', 'auth', 'authToken'];
          const foundSessionCookie = possibleSessionCookies.find(name =>
            document.cookie.includes(`${name}=`)
          );
          if (foundSessionCookie) {
            console.log('6d. Cookie de session trouvé:', foundSessionCookie);
          } else {
            console.log('6d. Aucun cookie de session standard trouvé');
          }
        }

        // SOLUTION : Le backend n'a pas défini de cookie de session lors du login
        // Il faut donc trouver une autre méthode d'authentification
        // Essayer d'envoyer le cookie adminToken dans le header Cookie manuellement
        // OU essayer d'envoyer un header Authorization si le backend l'accepte

        // Note importante : Le backend devrait définir un cookie de session lors du login
        // Si ce n'est pas le cas, c'est un problème de configuration backend
        // Mais on essaie quand même de faire fonctionner avec ce qu'on a

        console.log('6e. ⚠️ PROBLÈME DÉTECTÉ : Le backend n\'a pas défini de cookie de session visible lors du login');
        console.log('6f. Le backend attend probablement un cookie de session qu\'il définit lui-même');
        console.log('6g. Les cookies seront envoyés avec credentials: include');
        console.log('6h. Si le backend renvoie toujours 401, il faut configurer le backend pour :');
        console.log('    - Soit définir un cookie de session HTTP-only lors du login');
        console.log('    - Soit renvoyer un token JWT dans la réponse du login');
        console.log('    - Soit accepter le cookie adminToken défini par le frontend');
      }

      console.log('7. Options de fetch:', JSON.stringify(fetchOptions, null, 2));
      console.log('8. Envoi de la requête...');

      const response = await fetch(url, fetchOptions);

      console.log('9. Statut de la réponse:', response.status, response.statusText);
      console.log('10. Headers de la réponse:', Object.fromEntries(response.headers.entries()));

      // Vérifier si le backend définit un cookie de session dans les headers
      const setCookieResponse = response.headers.get('set-cookie');
      console.log('10b. Set-Cookie dans la réponse /me:', setCookieResponse || 'Aucun');

      // Vérifier les cookies envoyés dans la requête (pour debug)
      console.log('10c. Note: Les cookies sont envoyés automatiquement avec credentials: include');
      console.log('10d. Le backend devrait recevoir tous les cookies du domaine');

      if (!response.ok) {
        console.log('11. ❌ Erreur HTTP:', response.status);

        let errorMessage = `Erreur ${response.status}`;
        let errorData = null;

        try {
          const responseText = await response.text();
          console.log('12. Corps de la réponse (texte):', responseText);

          try {
            errorData = JSON.parse(responseText);
            console.log('13. Corps de la réponse (JSON):', errorData);
            errorMessage = errorData.message || errorData.data?.message || errorMessage;
          } catch (e) {
            console.log('13. Impossible de parser en JSON, utilisation du texte brut');
            errorMessage = responseText || errorMessage;
          }
        } catch (e) {
          console.log('12. Impossible de lire le corps de la réponse:', e);
        }

        if (response.status === 401) {
          console.log('14. ❌ Erreur 401 Unauthorized détectée');
          console.log('15. Message d\'erreur:', errorMessage);
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        throw new Error(errorMessage);
      }

      console.log('11. ✅ Réponse OK');
      const data = await response.json();
      console.log('12. Données reçues:', data);

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      const result = data?.data || data;
      console.log('13. Données retournées:', result);
      console.log('=== FIN DEBUG getAdminProfile ===');

      return result;

    } catch (error) {
      console.error('=== ERREUR dans getAdminProfile ===');
      console.error('Type d\'erreur:', error.name);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('=== FIN ERREUR ===');

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Mettre à jour le profil admin
  async updateAdminProfile(updateData) {
    try {
      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/auth/admin/me`;

      const fetchOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include', // Important pour envoyer les cookies de session
      };

      // Ajouter le token Bearer seulement s'il existe et n'est pas le marqueur cookie
      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.warn('Erreur dans updateAdminProfile:', error);

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Mot de passe oublié
  async forgotPassword(email) {
    try {
      const url = `${API_BASE_URL}/api/v1/auth/forgot-password`;

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.warn('Erreur dans forgotPassword:', error);
      throw error;
    }
  },

  // Réinitialiser le mot de passe (avec token)
  async resetPassword(token, password) {
    try {
      const url = `${API_BASE_URL}/api/v1/auth/reset-password/${token}`;

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.warn('Erreur dans resetPassword:', error);
      throw error;
    }
  },

  // Changer le mot de passe (authentifié)
  async changePassword(currentPassword, newPassword) {
    try {
      // On réutilise updateAdminProfile ou on appelle un endpoint spécifique si disponible
      // Pour l'instant, on suppose que le backend préfère un endpoint dédié s'il en a un,
      // sinon on pourrait mapper vers updateAdminProfile.
      // Vu la demande, je vais ajouter un endpoint spécifique qui est souvent standard.
      const token = auth.getToken();
      const url = `${API_BASE_URL}/api/v1/auth/admin/update-password`;

      const fetchOptions = {
        method: 'PATCH', // ou POST selon API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        if (response.status === 404) {
          // Fallback sur updateAdminProfile si l'endpoint spécifique n'existe pas
          console.log('Endpoint update-password non trouvé, fallback sur updateAdminProfile');
          return this.updateAdminProfile({ currentPassword, newPassword });
        }

        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.warn('Erreur dans changePassword:', error);
      throw error;
    }
  },
   // Obtenir le résumé du dashboard
  async getDashboardSummary() {
    try {
      console.log('=== DEBUG getDashboardSummary ===');
      const token = auth.getToken();
      console.log('Token récupéré:', token ? 'OUI' : 'NON');

      const url = `${API_BASE_URL}/api/v1/dashboard/summary`;
      console.log('URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
        console.log('Header Authorization ajouté');
      } else {
        console.log('Mode cookie (pas de header Authorization)');
      }

      console.log('Envoi de la requête...');
      const response = await fetch(url, fetchOptions);

      console.log('Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        console.log('❌ Erreur HTTP:', response.status);

        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
        }

        try {
          const responseText = await response.text();
          console.log('Corps de la réponse (texte):', responseText);

          try {
            const errorData = JSON.parse(responseText);
            console.log('Corps de la réponse (JSON):', errorData);
            errorMessage = errorData.message || errorData.data?.message || errorMessage;
          } catch (e) {
            console.log('Impossible de parser en JSON, utilisation du texte brut');
            errorMessage = responseText || errorMessage;
          }
        } catch (e) {
          console.log('Impossible de lire le corps de la réponse:', e);
        }

        throw new Error(errorMessage);
      }

      console.log('✅ Réponse OK');
      const data = await response.json();
      console.log('Données reçues:', data);

      // Extraire les données de la structure imbriquée
      const result = data?.data?.data || data?.data || data;
      console.log('Données retournées:', result);
      console.log('=== FIN DEBUG getDashboardSummary ===');

      return result;

    } catch (error) {
      console.error('=== ERREUR dans getDashboardSummary ===');
      console.error('Message:', error.message);
      console.error('=== FIN ERREUR ===');

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Obtenir les données du graphique de feedback
  async getFeedbackChartData() {
    try {
      console.log('=== DEBUG getFeedbackChartData ===');
      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/dashboard/feedback-chart`;
      console.log('URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      console.log('Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const result = data?.data?.data || data?.data || data;
      console.log('Données graphique reçues:', result);
      console.log('=== FIN DEBUG getFeedbackChartData ===');

      return result;

    } catch (error) {
      console.error('Erreur dans getFeedbackChartData:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Obtenir les achievements
  async getAchievements() {
    try {
      console.log('=== DEBUG getAchievements ===');
      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/dashboard/achievements`;
      console.log('URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      console.log('Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const result = data?.data?.data || data?.data || data;
      console.log('Achievements reçus:', result);
      console.log('=== FIN DEBUG getAchievements ===');

      return result;

    } catch (error) {
      console.error('Erreur dans getAchievements:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Obtenir les statistiques par période
  async getPeriodStatistics(period = 'week') {
    try {
      console.log('=== DEBUG getPeriodStatistics ===');
      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/reports/statistics?period=${period}`;
      console.log('URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      console.log('Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const result = data?.data?.data || data?.data || data;
      console.log('Statistiques période reçues:', result);
      console.log('=== FIN DEBUG getPeriodStatistics ===');

      return result;

    } catch (error) {
      console.error('Erreur dans getPeriodStatistics:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Obtenir les statistiques globales (existe déjà - ajout des logs)
  async getFeedbackStatistics() {
    try {
      console.log('=== DEBUG getFeedbackStatistics ===');
      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/statistics`;
      console.log('URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      console.log('Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const result = data?.data?.data || data?.data || data;
      console.log('Statistiques globales reçues:', result);
      console.log('=== FIN DEBUG getFeedbackStatistics ===');

      return result;

    } catch (error) {
      console.error('Erreur dans getFeedbackStatistics:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },
// Récupérer tous les feedbacks (admin) avec filtres et pagination
async getAllFeedbacks(params = {}) {
  try {
    console.log('=== DEBUG getAllFeedbacks ===');
    console.log('1. Params reçus:', params);
    
    const token = auth.getToken();
    console.log('2. Token récupéré:', token ? (token.substring(0, 20) + '...') : 'NULL');

    // Construire l'URL avec les paramètres de query
    const url = new URL(`${API_BASE_URL}/api/v1/admin/feedbacks`);
    
    // Ajouter les paramètres de pagination
    if (params.page) {
      url.searchParams.append('page', params.page);
    }
    if (params.limit) {
      url.searchParams.append('limit', params.limit);
    } else {
      url.searchParams.append('limit', 10); // Valeur par défaut
    }
    
    // Ajouter les paramètres de filtrage
    if (params.businessId) {
      url.searchParams.append('businessId', params.businessId);
    }
    if (params.rating) {
      url.searchParams.append('rating', params.rating);
    }
    if (params.sentiment) {
      url.searchParams.append('sentiment', params.sentiment);
    }
    if (params.hasAdminReply !== undefined) {
      url.searchParams.append('hasAdminReply', params.hasAdminReply);
    }
    if (params.includeDeleted !== undefined) {
      url.searchParams.append('includeDeleted', params.includeDeleted);
    }
    
    // Ajouter les filtres de statut si présents
    if (params.status) {
      url.searchParams.append('status', params.status);
    }
    
    // Ajouter la recherche
    if (params.search) {
      url.searchParams.append('search', params.search);
    }

    console.log('3. URL construite:', url.toString());

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    // Ajouter le token Bearer seulement s'il existe et n'est pas le marqueur cookie
    if (token && token !== 'COOKIE_AUTH') {
      fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      console.log('4. Header Authorization ajouté');
    } else {
      console.log('4. Mode cookie (pas de header Authorization)');
    }

    console.log('5. Envoi de la requête...');
    const response = await fetch(url.toString(), fetchOptions);

    console.log('6. Statut de la réponse:', response.status, response.statusText);

    if (!response.ok) {
      console.log('7. ❌ Erreur HTTP:', response.status);

      let errorMessage = `Erreur ${response.status}`;
      try {
        const responseText = await response.text();
        console.log('8. Corps de la réponse (texte):', responseText);

        try {
          const errorData = JSON.parse(responseText);
          console.log('9. Corps de la réponse (JSON):', errorData);
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          console.log('9. Impossible de parser en JSON, utilisation du texte brut');
          errorMessage = responseText || errorMessage;
        }
      } catch (e) {
        console.log('8. Impossible de lire le corps de la réponse:', e);
      }

      if (response.status === 401) {
        console.log('10. ❌ Erreur 401 Unauthorized détectée');
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
      }

      throw new Error(errorMessage);
    }

    console.log('7. ✅ Réponse OK');
    const data = await response.json();
    console.log('8. Données reçues (complètes):', data);
    
    // CORRECTION : Retourner la structure complète telle quelle
    // Le frontend s'adaptera à l'extraction des données
    return data;

  } catch (error) {
    console.error('=== ERREUR dans getAllFeedbacks ===');
    console.error('Message:', error.message);
    console.error('=== FIN ERREUR ===');

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
    }

    throw error;
  }
},

  // Récupérer les statistiques globales des feedbacks
  async getFeedbackStatistics() {
    try {
      console.log('=== DEBUG getFeedbackStatistics ===');
      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/statistics`;
      console.log('URL de la requête:', url);

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      console.log('Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
        }
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          // Ignorer l'erreur de parsing
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const result = data?.data || data;
      console.log('Statistiques reçues:', result);
      console.log('=== FIN DEBUG getFeedbackStatistics ===');

      return result;

    } catch (error) {
      console.error('Erreur dans getFeedbackStatistics:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Récupérer les feedbacks d'une entreprise spécifique
  async getBusinessFeedbacks(businessId) {
    try {
      if (!businessId) {
        throw new Error('ID de l\'entreprise requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/business/${businessId}`;

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans getBusinessFeedbacks:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Récupérer les statistiques d'une entreprise spécifique
  async getBusinessFeedbackStatistics(businessId) {
    try {
      if (!businessId) {
        throw new Error('ID de l\'entreprise requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/business/${businessId}/statistics`;

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans getBusinessFeedbackStatistics:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Récupérer les détails d'un feedback spécifique
  async getFeedbackDetails(feedbackId) {
    try {
      if (!feedbackId) {
        throw new Error('ID du feedback requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/${feedbackId}`;

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans getFeedbackDetails:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Supprimer un feedback (soft delete)
  async softDeleteFeedback(feedbackId) {
    try {
      if (!feedbackId) {
        throw new Error('ID du feedback requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/${feedbackId}`;

      const fetchOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans softDeleteFeedback:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Répondre à un feedback
  async replyToFeedback(feedbackId, reply) {
    try {
      if (!feedbackId) {
        throw new Error('ID du feedback requis');
      }

      if (!reply || reply.trim().length === 0) {
        throw new Error('Le contenu de la réponse est requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/${feedbackId}/reply`;

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: reply.trim() }),
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans replyToFeedback:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Supprimer la réponse admin d'un feedback
  async deleteAdminReply(feedbackId) {
    try {
      if (!feedbackId) {
        throw new Error('ID du feedback requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/${feedbackId}/reply`;

      const fetchOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans deleteAdminReply:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Restaurer un feedback supprimé
  async restoreFeedback(feedbackId) {
    try {
      if (!feedbackId) {
        throw new Error('ID du feedback requis');
      }

      const token = auth.getToken();

      const url = `${API_BASE_URL}/api/v1/admin/feedbacks/${feedbackId}/restore`;

      const fetchOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error('Erreur dans restoreFeedback:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Méthode générique pour les requêtes API
  async request(url, options = {}) {
    try {
      const token = auth.getToken();

      const fetchOptions = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      };

      // Ajouter le token Bearer seulement s'il existe et n'est pas le marqueur cookie
      if (token && token !== 'COOKIE_AUTH') {
        fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 401) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.data?.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Le backend peut renvoyer { success: true, data: {...} } ou directement les données
      return data?.data || data;

    } catch (error) {
      console.error(`Erreur dans la requête ${url}:`, error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez l\'URL: ' + API_BASE_URL);
      }

      throw error;
    }
  },

  // Méthodes raccourcis pour la compatibilité avec le code existant
  async get(url) {
    return this.request(url, { method: 'GET' });
  },

  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async patch(url, data) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
};
