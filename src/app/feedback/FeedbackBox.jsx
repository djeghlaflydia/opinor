import { useState, useRef } from 'react';

// Enums pour correspondre au backend
const FeedbackSentiment = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};

const FeedbackCategory = {
  SERVICE: 'service',
  PRODUCT_QUALITY: 'product_quality',
  AMBIANCE: 'ambiance',
  PRICING: 'pricing',
  CLEANLINESS: 'cleanliness',
  OTHER: 'other',
};

// Nouveaux enums pour les nouvelles sections
const VisitReason = {
  SIMPLE_DINNER: 'simple_dinner',
  LIVELY_EVENING: 'lively_evening',
  CELEBRATION: 'celebration',
  GROUP_OUTING: 'group_outing',
  OTHER: 'other',
};

const FirstVisitStatus = {
  YES: 'yes',
  RETURNING: 'returning',
  REGULAR: 'regular',
};

const ReturnIntention = {
  DEFINITELY: 'definitely',
  PROBABLY: 'probably',
  UNSURE: 'unsure',
  UNLIKELY: 'unlikely',
};

// Tags prédéfinis pour les émotions/sentiments
const PREDEFINED_TAGS = [
  { id: 'satisfait', label: 'Satisfait(e)' },
  { id: 'delighted', label: 'Ravi(e)' },
  { id: 'impressed', label: 'Impressionné(e)' },
  { id: 'relaxed', label: 'Détendu(e)' },
  { id: 'welcome', label: 'Bien accueilli(e)' },
  { id: 'disappointed', label: 'Déçu(e)' },
  { id: 'frustrated', label: 'Frustré(e)' },
  { id: 'indifferent', label: 'Indifférent(e)' },
  { id: 'rushed', label: 'Pressé(e)' },
  { id: 'valued', label: 'Valorisé(e)' },
  { id: 'special', label: 'Spécial(e)' },
  { id: 'disoriented', label: 'Désorienté(e)' },
  { id: 'surprised', label: 'Surpris(e)' },
  { id: 'inspired', label: 'Inspiré(e)' },
  { id: 'energized', label: 'Energisé(e)' },
  { id: 'calm', label: 'Calme' },
  { id: 'confused', label: 'Confus(e)' },
  { id: 'annoyed', label: 'Agacé(e)' },
  { id: 'excited', label: 'Excité(e)' },
  { id: 'grateful', label: 'Reconnaissant(e)' },
];

// Groupes de tags pour organisation
const TAG_CATEGORIES = {
  POSITIVE: ['satisfait', 'delighted', 'impressed', 'relaxed', 'welcome', 'valued', 'special', 'surprised', 'inspired', 'energized', 'excited', 'grateful'],
  NEUTRAL: ['indifferent', 'calm', 'confused'],
  NEGATIVE: ['disappointed', 'frustrated', 'rushed', 'disoriented', 'annoyed']
};

export default function FeedbackBox({ businessCode, onSuccess }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    category: FeedbackCategory.SERVICE,
    visitReason: VisitReason.SIMPLE_DINNER,
    isFirstVisit: FirstVisitStatus.YES,
    willReturn: ReturnIntention.DEFINITELY,
    location: '',
    images: [],
    tags: [], // SEULEMENT les tags que l'utilisateur a cliqué
    customerName: '',
    customerEmail: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  // Calcul automatique du sentiment basé sur la note
  const calculateSentiment = (rating) => {
    if (rating >= 4) return FeedbackSentiment.POSITIVE;
    if (rating <= 2) return FeedbackSentiment.NEGATIVE;
    return FeedbackSentiment.NEUTRAL;
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  // Ajouter un tag prédéfini
  const addTag = (tagId) => {
    const tag = PREDEFINED_TAGS.find(t => t.id === tagId);
    if (tag && !formData.tags.includes(tagId)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagId], // SEULEMENT les IDs des tags sélectionnés
      });
    }
  };

  // Retirer un tag
  const removeTag = (tagId) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(id => id !== tagId), // Retirer du tableau
    });
  };

  // Filtrer les tags POUR L'AFFICHAGE SEULEMENT
  const getFilteredTags = () => {
    let filtered = PREDEFINED_TAGS;
    
    // Filtre par recherche texte
    if (tagSearch.trim()) {
      filtered = filtered.filter(tag =>
        tag.label.toLowerCase().includes(tagSearch.toLowerCase()) ||
        tag.id.toLowerCase().includes(tagSearch.toLowerCase())
      );
    } else {
      // Filtre par sentiment SEULEMENT pour l'affichage
      const sentiment = calculateSentiment(formData.rating);
      if (sentiment === FeedbackSentiment.POSITIVE) {
        filtered = filtered.filter(tag => TAG_CATEGORIES.POSITIVE.includes(tag.id));
      } else if (sentiment === FeedbackSentiment.NEGATIVE) {
        filtered = filtered.filter(tag => TAG_CATEGORIES.NEGATIVE.includes(tag.id));
      }
      // Pour NEUTRAL, on montre tout ou un mix
    }
    
    // Limiter à 6 tags si pas en mode "voir tout"
    if (!showAllTags && !tagSearch.trim()) {
      return filtered.slice(0, 6);
    }
    
    return filtered;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Créer le payload avec SEULEMENT les données que l'utilisateur a choisies
      const payload = {
        rating: formData.rating,
        comment: formData.comment,
        category: formData.category,
        // CRITIQUE: envoyer SEULEMENT formData.tags (les tags que l'utilisateur a cliqué)
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        visitReason: formData.visitReason || undefined,
        isFirstVisit: formData.isFirstVisit || undefined,
        willReturn: formData.willReturn || undefined,
        location: formData.location || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        ...(formData.customerName && { customerName: formData.customerName }),
        ...(formData.customerEmail && { customerEmail: formData.customerEmail }),
      };
      
      console.log('=== DEBUG PAYLOAD ===');
      console.log('Tags sélectionnés par l\'utilisateur:', formData.tags);
      console.log('Payload complet:', payload);
      console.log('Nombre de tags:', formData.tags.length);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://opinor.onrender.com';
      const apiUrl = `${apiBaseUrl}/api/v1/feedbacks/${businessCode}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi');
      }

      const result = await response.json();
      console.log('Réponse du serveur:', result);

      if (onSuccess) {  
        onSuccess();    
      }

    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tags filtrés pour l'affichage (seulement)
  const filteredTags = getFilteredTags();

  return (
    <div className="relative mx-auto mt-6 bg-white/95 bg-opacity-80 p-6 rounded-3xl shadow-lg">
      <form onSubmit={handleSubmit} className="relative space-y-8">
        {/* ⭐ Note */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-4xl transition-all duration-300
                  hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]
                  focus:outline-none rounded-xl
                  ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                `}
                aria-label={`Donner ${star} étoile${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm
                ${
                  calculateSentiment(formData.rating) === FeedbackSentiment.POSITIVE
                    ? 'bg-green-100/80 text-green-700'
                    : calculateSentiment(formData.rating) === FeedbackSentiment.NEGATIVE
                    ? 'bg-red-100/80 text-red-700'
                    : 'bg-gray-100/80 text-gray-700'
                }`}
            >
              {calculateSentiment(formData.rating) === FeedbackSentiment.POSITIVE && '👍 Positive'}
              {calculateSentiment(formData.rating) === FeedbackSentiment.NEGATIVE && '👎 Négative'}
              {calculateSentiment(formData.rating) === FeedbackSentiment.NEUTRAL && '😐 Neutre'}
            </span>

            <span className="text-sm text-gray-500">
              ({formData.rating}/5)
            </span>
          </div>
        </div>

        {/* ✍️ Commentaire */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Votre commentaire *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            placeholder="Décrivez votre expérience en détail..."
            required
            minLength={10}
            maxLength={500}
            className={`w-full h-36 px-5 py-4 rounded-xl
              bg-white/90 border transition-all shadow-sm hover:shadow-md resize-none text-sm
              ${formData.comment.length < 10 && formData.comment.length > 0 
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-200 focus:ring-[#038788]/20 focus:border-[#038788]'
              }`}
          />
          <div className="flex justify-between text-xs mt-1">
            <span className={
              formData.comment.length < 10 && formData.comment.length > 0 
                ? 'text-red-500 font-medium' 
                : 'text-gray-500'
            }>
              {formData.comment.length < 10 && formData.comment.length > 0 
                ? `Encore ${10 - formData.comment.length} caractères requis` 
                : 'Minimum 10 caractères'
              }
            </span>
            <span className="text-gray-500">{formData.comment.length}/500</span>
          </div>
        </div>

        {/* 🎯 Motif principal de la visite - DROPDOWN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Motif principal de la visite
          </label>
          <select
            value={formData.visitReason}
            onChange={(e) =>
              setFormData({ ...formData, visitReason: e.target.value })
            }
            className="w-full px-5 py-4 rounded-xl
              bg-white/90 border border-gray-200
              focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
              transition-all shadow-sm hover:shadow-md text-sm"
          >
            <option value={VisitReason.SIMPLE_DINNER}>Dîner simple</option>
            <option value={VisitReason.LIVELY_EVENING}>Soirée animée</option>
            <option value={VisitReason.CELEBRATION}>Anniversaire / événement</option>
            <option value={VisitReason.GROUP_OUTING}>Sortie en groupe</option>
            <option value={VisitReason.OTHER}>Autres</option>
          </select>
        </div>

        {/* 📂 Qu'est-ce qui a le plus influencé ce ressenti ? - DROPDOWN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Qu'est-ce qui a le plus influencé ce ressenti ? *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            className="w-full px-5 py-4 rounded-xl
              bg-white/90 border border-gray-200
              focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
              transition-all shadow-sm hover:shadow-md text-sm"
          >
            <option value={FeedbackCategory.SERVICE}>Service client</option>
            <option value={FeedbackCategory.PRODUCT_QUALITY}>Qualité du service</option>
            <option value={FeedbackCategory.AMBIANCE}>Ambiance</option>
            <option value={FeedbackCategory.PRICING}>Prix</option>
            <option value={FeedbackCategory.CLEANLINESS}>Propreté</option>
            <option value={FeedbackCategory.OTHER}>Autre</option>
          </select>
        </div>

        {/* 🎫 Était-ce votre première visite ? - DROPDOWN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Était-ce votre première visite ?
          </label>
          <select
            value={formData.isFirstVisit}
            onChange={(e) =>
              setFormData({ ...formData, isFirstVisit: e.target.value })
            }
            className="w-full px-5 py-4 rounded-xl
              bg-white/90 border border-gray-200
              focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
              transition-all shadow-sm hover:shadow-md text-sm"
          >
            <option value={FirstVisitStatus.YES}>Oui</option>
            <option value={FirstVisitStatus.RETURNING}>Non, je suis déjà venu(e)</option>
            <option value={FirstVisitStatus.REGULAR}>Non, je suis un client fidèle</option>
          </select>
        </div>

        {/* 🔄 Reviendriez-vous dans ce restaurant ? - DROPDOWN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reviendriez-vous dans ce restaurant ?
          </label>
          <select
            value={formData.willReturn}
            onChange={(e) =>
              setFormData({ ...formData, willReturn: e.target.value })
            }
            className="w-full px-5 py-4 rounded-xl
              bg-white/90 border border-gray-200
              focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
              transition-all shadow-sm hover:shadow-md text-sm"
          >
            <option value={ReturnIntention.DEFINITELY}>Oui, sans hésiter</option>
            <option value={ReturnIntention.PROBABLY}>Oui, probablement</option>
            <option value={ReturnIntention.UNSURE}>Je ne sais pas</option>
            <option value={ReturnIntention.UNLIKELY}>Probablement pas</option>
          </select>
        </div>

        {/* 🏷️ Tags prédéfinis */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            À la fin de votre visite, vous vous êtes senti(e)...
          </label>

          {/* Tags disponibles */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-600">Choisissez des sentiments:</p>
              {filteredTags.length < PREDEFINED_TAGS.length && !tagSearch.trim() && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-sm text-[#038788] hover:underline"
                >
                  {showAllTags ? 'Voir moins' : `Voir plus`}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => 
                    formData.tags.includes(tag.id) 
                      ? removeTag(tag.id) 
                      : addTag(tag.id)
                  }
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm
                    transition-all duration-200 shadow-sm hover:shadow-md
                    ${
                      formData.tags.includes(tag.id)
                        ? 'bg-gradient-to-r from-[#038788] to-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {tag.label}
                  {formData.tags.includes(tag.id) && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 Submit */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting || formData.comment.length < 10}
            className={`relative overflow-hidden py-4 px-14 rounded-full
              font-semibold transition-all duration-300
              ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#038788] text-white hover:shadow-[0_15px_40px_rgba(3,135,136,0.4)] cursor-pointer hover:-translate-y-1 active:scale-95'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}