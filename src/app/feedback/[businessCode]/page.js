// app/feedback/[businessCode]/page.jsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Fasthand } from "next/font/google";
import FeedbackBox from "../FeedbackBox";
import React, { useState, useEffect } from "react";
import { Phone, Mail, Instagram, User, MessageSquare } from "lucide-react";

const fasthand = Fasthand({ subsets: ["latin"], weight: "400" });

export default function FeedbackPage() {
  const phoneNumber = "+213774338408";
  const emailAddress = "hello.opinor@workmail.com";
  const params = useParams();
  const router = useRouter();
  const businessCode = params.businessCode;
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Vérifier dans le localStorage si un feedback a déjà été soumis pour ce business
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const submittedFeedback = localStorage.getItem(`feedback_submitted_${businessCode}`);
      if (submittedFeedback) {
        setFeedbackSubmitted(true);
      }
    }
  }, [businessCode]);

  // Fonction pour gérer la soumission réussie
  const handleFeedbackSuccess = () => {
    setFeedbackSubmitted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`feedback_submitted_${businessCode}`, 'true');
    }
  };

  // Fonction pour soumettre un nouveau feedback
  const handleNewFeedback = () => {
    setFeedbackSubmitted(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`feedback_submitted_${businessCode}`);
    }
  };

  // Vérifier si le businessCode est valide
  if (!businessCode || businessCode.length < 6) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Code invalide</h2>
          <p className="text-gray-600 mb-4">Le code business dans l'URL n'est pas valide.</p>
          <p className="text-sm text-gray-500">
            Scannez un QR code valide ou vérifiez l'URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat p-8"
      style={{ backgroundImage: 'url(/form.png)' }}
    >
      <img
        src="/logo.svg"
        alt="Opinor Logo"
        width={200}
        height={200}
        className="mx-auto"
      />
      
      {!feedbackSubmitted ? (
        <>
          {/* Section d'entête - visible avant soumission */}
          <div className="mt-8 max-w-[90%] mx-auto bg-white/95 bg-opacity-80  p-8 rounded-3xl shadow-lg">
            <h1 className={`${fasthand.className} text-4xl text-center`}>Donnez votre avis</h1>
            <p className="text-md text-center mt-4">
              Prenez quelques secondes pour évaluer votre expérience. Votre retour est précieux.
            </p>
          </div>

          {/* Formulaire de feedback */}
          <FeedbackBox businessCode={businessCode} onSuccess={handleFeedbackSuccess} />
        </>
      ) : (
        <>
          {/* Section de remerciement - visible après soumission */}
          <div className="mt-8 max-w-[90%] mx-auto bg-white/95 bg-opacity-80  p-8 rounded-3xl shadow-lg">
            <img
              src="/vector.svg"
              alt="vecteur"
              width={180}
              height={180}
              className="mx-auto"
            />
            <h1 className={`${fasthand.className} text-3xl text-center mt-4`}>Merci pour votre retour</h1>
            <p className="text-sm text-center mt-4">
              Votre avis a bien été enregistré. Il contribuera à améliorer l'expérience client.
            </p>
            
            {/* Bouton pour soumettre un autre avis */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNewFeedback}
                className="px-6 py-3 bg-[#038788] text-white rounded-3xl font-medium hover:bg-[#026C6C] transition-colors duration-200"
              >
                Donner un autre avis
              </button>
            </div>
          </div>

          {/* Section réseaux sociaux */}
          <div className="mt-8 max-w-[90%] mx-auto bg-white/95 bg-opacity-80  p-8 rounded-3xl shadow-lg">
            <h1 className={`${fasthand.className} text-3xl text-center`}>Retrouvez-nous sur</h1>
            <div className="flex gap-6 justify-center item-center mt-4">
              <a
                href="https://www.instagram.com/opinor.app?igsh=ZTRpY244cDVrdzRu&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="transition"
              >
                <Instagram className="w-9 h-9 md:w-12 md:h-12 p-1.5 text-[#038788]" />
              </a>
              <a
                href="https://www.linkedin.com/in/opinor-app-96b479357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center transition"
              >
                <p className="font-bold text-2xl text-[#026C6C]">in</p>
              </a>
              <a 
                href={`mailto:${emailAddress}`}
                className="text-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center transition"
              >
                <Mail className="w-6 h-6 md:w-8 md:h-8 text-[#026C6C]" />
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="text-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center transition"
              >
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-[#026C6C]" />
              </a>
            </div>
          </div>
      {/* Footer - toujours visible */}
      <p className='text-white text-center mt-2'>{emailAddress}</p>
      <p className='text-white text-center mt-6 text-lg'>© 2026 Opinor. Tous droits réservés.</p>
        </>
      )}

    </div>
  );
}