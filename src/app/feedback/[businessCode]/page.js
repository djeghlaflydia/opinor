// app/feedback/[businessCode]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import { Fasthand } from "next/font/google";
import FeedbackBox from "../FeedbackBox";

const fasthand = Fasthand({ subsets: ["latin"], weight: "400" });

export default function FeedbackPage() {
  const params = useParams();
  const businessCode = params.businessCode;

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
      
      <div className="mt-8 max-w-[90%] mx-auto bg-white bg-opacity-80 p-8 rounded-3xl shadow-lg">
        <h1 className={`${fasthand.className} text-4xl text-center`}>Donnez votre avis</h1>
        <p className="text-md text-center mt-4">
          Prenez quelques secondes pour évaluer votre expérience. Votre retour est précieux.
        </p>
      </div>

      <FeedbackBox businessCode={businessCode} />
    </div>
  );
}