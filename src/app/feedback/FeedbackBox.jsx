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

export default function FeedbackBox({ businessCode, onSuccess }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  // Fonction pour simuler l'upload d'image (à remplacer par votre vrai API)
  const simulateImageUpload = async (file) => {
    return new Promise((resolve) => {
      // Simuler un upload avec un délai
      setTimeout(() => {
        // En production, vous utiliserez un vrai service comme Cloudinary, AWS S3, etc.
        // Pour l'exemple, on simule une URL
        const fakeUrl = `https://example.com/uploads/${Date.now()}_${file.name}`;
        resolve(fakeUrl);
      }, 1500);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Limiter le nombre d'images
    if (formData.images.length + files.length > 5) {
      alert('Maximum 5 images autorisées');
      return;
    }

    // Limiter la taille des fichiers (5MB par fichier)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Certains fichiers dépassent 5MB');
      return;
    }

    // Ajouter les fichiers à la liste d'upload
    setUploadingImages(prev => [...prev, ...files]);

    // Simuler l'upload pour chaque fichier
    for (const file of files) {
      try {
        // Mettre à jour la progression
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));

        // Simuler la progression
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[file.name] || 0;
            if (current >= 95) {
              clearInterval(interval);
              return prev;
            }
            return {
              ...prev,
              [file.name]: current + 5
            };
          });
        }, 50);

        // Simuler l'upload
        const imageUrl = await simulateImageUpload(file);

        // Nettoyer l'intervalle
        clearInterval(interval);

        // Mettre à jour la progression à 100%
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));

        // Ajouter l'URL à formData.images
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));

        // Retirer de la liste d'upload après un délai
        setTimeout(() => {
          setUploadingImages(prev => prev.filter(f => f !== file));
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 1000);

      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert(`Erreur lors de l'upload de ${file.name}`);
        
        // Retirer de la liste d'upload en cas d'erreur
        setUploadingImages(prev => prev.filter(f => f !== file));
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }

    // Réinitialiser l'input file
    e.target.value = '';
  };

  const removeImage = (imageUrl) => {
    setFormData({
      ...formData,
      images: formData.images.filter(image => image !== imageUrl),
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier si des images sont encore en cours d'upload
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
        location: formData.location,
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
            className="w-full h-36 px-5 py-4 rounded-xl
              bg-white/90 border border-gray-200
              focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
              transition-all shadow-sm hover:shadow-md resize-none text-sm"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Minimum 10 caractères</span>
            <span>{formData.comment.length}/500</span>
          </div>
        </div>

        {/* 📂 Catégorie */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catégorie *
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
            <option value={FeedbackCategory.PRODUCT_QUALITY}>Qualité des produits</option>
            <option value={FeedbackCategory.AMBIANCE}>Ambiance</option>
            <option value={FeedbackCategory.PRICING}>Prix</option>
            <option value={FeedbackCategory.CLEANLINESS}>Propreté</option>
            <option value={FeedbackCategory.OTHER}>Autre</option>
          </select>
        </div>

        {/* 📍 Localisation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Localisation *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Où s'est déroulée votre expérience ?"
            required
            className="w-full px-5 py-4 rounded-xl
              bg-white/90 border border-gray-200
              focus:ring-1 focus:ring-[#038788]/20 focus:border-[#038788]
              transition-all shadow-sm hover:shadow-md text-sm"
          />
        </div>

        {/* 🖼️ Upload d'images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Photos ({formData.images.length}/5)
            <span className="text-xs font-normal text-gray-500 ml-2">JPG, PNG jusqu'à 5MB</span>
          </label>
          
          {/* Bouton d'upload */}
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={formData.images.length >= 5 || uploadingImages.length > 0}
              className={`w-full py-4 px-6 rounded-xl border-2 border-dashed 
                flex flex-col items-center justify-center gap-2
                transition-all duration-300
                ${
                  formData.images.length >= 5 || uploadingImages.length > 0
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-[#038788]/30 bg-[#038788]/5 hover:bg-[#038788]/10 hover:border-[#038788]/50'
                }`}
            >
              <svg className="w-8 h-8 text-[#038788]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-gray-700">
                {formData.images.length >= 5 ? 'Maximum 5 photos atteint' : 'Ajouter des photos'}
              </span>
              <span className="text-xs text-gray-500">
                Cliquez ou glissez-déposez vos images
              </span>
            </button>
          </div>

          {/* Images uploadées */}
          {(formData.images.length > 0 || uploadingImages.length > 0) && (
            <div className="space-y-3 overflow-hidden">
              {/* Images en cours d'upload */}
              {uploadingImages.map((file, index) => (
                <div key={`uploading-${index}`} className="bg-gray-50/80 overflow-hidden rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2 overflow-hidden">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 overflow-hidden bg-[#038788]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#038788]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#038788]">
                      {uploadProgress[file.name] || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#038788] to-teal-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.name] || 0}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Images déjà uploadées */}
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="bg-white/90 overflow-hidden rounded-xl p-4 border border-gray-200 group hover:border-[#038788]/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#038788]/10 to-teal-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#038788]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                          Photo {index + 1}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {imageUrl.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(imageUrl)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🏷️ Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags <span className="text-xs text-gray-500">(Entrée pour ajouter)</span>
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
            disabled={isSubmitting || formData.comment.length < 10 || !formData.location || uploadingImages.length > 0}
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