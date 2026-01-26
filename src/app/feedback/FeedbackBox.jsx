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
    tags: [],
    customerName: '',
    customerEmail: '',
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

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

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag') addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (uploadingImages.length > 0) {
        alert('Veuillez attendre la fin des uploads d\'images');
        setIsSubmitting(false);
        return;
      }

      const sentiment = calculateSentiment(formData.rating);
      
      const payload = {
        rating: formData.rating,
        comment: formData.comment,
        category: formData.category,
        //visitReason: formData.visitReason || undefined,
        //isFirstVisit: formData.isFirstVisit || undefined,
        //willReturn: formData.willReturn || undefined,
        location: formData.location|| undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        ...(formData.customerName && { customerName: formData.customerName }),
        ...(formData.customerEmail && { customerEmail: formData.customerEmail }),
      };
      
      console.log('=== DEBUG API URL ===');
      console.log('Type de NEXT_PUBLIC_API_URL:', typeof process.env.NEXT_PUBLIC_API_URL);
      console.log('Valeur NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Est-ce vide?', !process.env.NEXT_PUBLIC_API_URL);
      console.log('businessCode:', businessCode);
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://opinor.onrender.com';
      const apiUrl = `${apiBaseUrl}/api/v1/feedbacks/${businessCode}`;
      console.log('URL finale:', apiUrl);

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

        {/* 🏷️ Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            À la fin de votre visite, vous vous êtes senti(e)?
          </label>

          <div className="flex">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tag')}
              placeholder="ex: friendly, quick, delicious"
              className="flex-1 min-w-0 px-4 py-3 rounded-l-xl
                bg-white/90 border border-gray-200
                focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
                text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={addTag}
              className="flex-shrink-0 px-3 sm:px-4 rounded-r-xl 
                bg-gradient-to-r from-[#038788] to-teal-600 
                text-white hover:opacity-90 transition
                text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Ajouter</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2
                    bg-gradient-to-r from-[#038788]/10 to-blue-500/10
                    text-[#038788] px-4 py-1.5 rounded-full text-sm
                    shadow-sm hover:scale-105 transition"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 🚀 Submit */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting || formData.comment.length < 10}
            className={`relative overflow-hidden py-4 px-14 rounded-full
              font-semibold transition-all duration-300
              ${
                isSubmitting || uploadingImages.length > 0
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
            ) : uploadingImages.length > 0 ? (
              'Upload des images...'
            ) : (
              'Envoyer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}