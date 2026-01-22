import { useState } from 'react';

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

export default function FeedbackBox({ businessCode }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    category: FeedbackCategory.SERVICE,
    location: '',
    images: [],
    tags: [],
    customerName: '',
    customerEmail: '',
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const addImage = () => {
    if (currentImage.trim() && !formData.images.includes(currentImage.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, currentImage.trim()],
      });
      setCurrentImage('');
    }
  };

  const removeImage = (imageToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter(image => image !== imageToRemove),
    });
  };

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag') addTag();
      if (type === 'image') addImage();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcul du sentiment avant envoi
      const sentiment = calculateSentiment(formData.rating);
      
      // Préparer les données pour le backend
      const payload = {
        rating: formData.rating,
        comment: formData.comment,
        category: formData.category,
        location: formData.location,
        images: formData.images.length > 0 ? formData.images : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        ...(formData.customerName && { customerName: formData.customerName }),
        ...(formData.customerEmail && { customerEmail: formData.customerEmail }),
      };

      console.log('Envoi des données à:', `/api/v1/feedbacks/${businessCode}`);
      console.log('Payload:', payload);

      // Envoi au backend
      const response = await fetch(`/api/v1/feedbacks/${businessCode}`, {
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

      setSubmitted(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setFormData({
          rating: 5,
          comment: '',
          category: FeedbackCategory.SERVICE,
          location: '',
          images: [],
          tags: [],
          customerName: '',
          customerEmail: '',
        });
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-xl border border-green-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Merci pour votre feedback !</h3>
          <p className="text-green-600">Votre avis a été envoyé avec succès.</p>
          <p className="text-sm text-green-500 mt-2">(Le sentiment a été automatiquement détecté comme "{calculateSentiment(formData.rating)}")</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90%] mt-6 mx-auto bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-xl border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Note - Étoiles */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Notez votre expérience *
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-4xl transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 ${
                  star <= formData.rating 
                    ? calculateSentiment(formData.rating) === FeedbackSentiment.POSITIVE 
                      ? 'text-yellow-500' 
                      : calculateSentiment(formData.rating) === FeedbackSentiment.NEGATIVE 
                      ? 'text-red-500' 
                      : 'text-gray-400'
                    : 'text-gray-300'
                }`}
                aria-label={`Donner ${star} étoile${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
          <div className="text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              calculateSentiment(formData.rating) === FeedbackSentiment.POSITIVE 
                ? 'bg-green-100 text-green-800' 
                : calculateSentiment(formData.rating) === FeedbackSentiment.NEGATIVE 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {calculateSentiment(formData.rating) === FeedbackSentiment.POSITIVE && '👍 Positive'}
              {calculateSentiment(formData.rating) === FeedbackSentiment.NEGATIVE && '👎 Négative'}
              {calculateSentiment(formData.rating) === FeedbackSentiment.NEUTRAL && '😐 Neutre'}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              ({formData.rating}/5 étoiles)
            </span>
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Votre commentaire *
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            placeholder="Décrivez votre expérience en détail..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none h-32"
            required
            minLength={10}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Minimum 10 caractères</span>
            <span>{formData.comment.length}/500</span>
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            required
          >
            <option value={FeedbackCategory.SERVICE}>Service client</option>
            <option value={FeedbackCategory.PRODUCT_QUALITY}>Qualité des produits</option>
            <option value={FeedbackCategory.AMBIANCE}>Ambiance</option>
            <option value={FeedbackCategory.PRICING}>Prix</option>
            <option value={FeedbackCategory.CLEANLINESS}>Propreté</option>
            <option value={FeedbackCategory.OTHER}>Autre</option>
          </select>
        </div>

        {/* Localisation */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Localisation *
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Où s'est déroulée votre expérience ?"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
            <span className="text-xs text-gray-500 ml-2">Appuyez sur Entrée pour ajouter</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tag')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Ajouter un tag (ex: friendly, quick)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Ajouter
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={currentImage}
              onChange={(e) => setCurrentImage(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'image')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Ajouter
            </button>
          </div>
          {formData.images.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 truncate max-w-xs">{image}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton d'envoi */}
        <div className="flex justify-center items-center text-center">
          <button
            type="submit"
            disabled={isSubmitting || formData.comment.length < 10 || !formData.location}
            className={` py-3 px-10 rounded-3xl font-medium transition-all duration-200 ${
              isSubmitting || formData.comment.length < 10 || !formData.location
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r bg-[#038788] text-white hover:shadow-lg transform hover:-translate-y-0.5 '
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
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

      {/* Aperçu des données 
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu des données qui seront envoyées :</h4>
        <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-40">
          {JSON.stringify(
            {
              rating: formData.rating,
              comment: formData.comment,
              category: formData.category,
              location: formData.location,
              ...(formData.images.length > 0 && { images: formData.images }),
              ...(formData.tags.length > 0 && { tags: formData.tags }),
              ...(formData.customerName && { customerName: formData.customerName }),
              ...(formData.customerEmail && { customerEmail: formData.customerEmail }),
              sentiment: calculateSentiment(formData.rating), // Pour info seulement, calculé côté serveur
            },
            null,
            2
          )}
        </pre>
        <div className="text-xs text-gray-500 mt-2">
          Endpoint: POST <code className="bg-gray-100 px-1 rounded">/api/v1/feedbacks/{businessCode}</code>
        </div>
      </div>*/}
    </div>
  );
}