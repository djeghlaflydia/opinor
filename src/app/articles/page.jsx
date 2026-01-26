"use client";
import React, { useEffect } from 'react';
import Header from '../components/header';

const ArticlesPage = () => {
  // Gérer les ancres lorsqu'on arrive sur la page
  useEffect(() => {
    // Si l'URL contient une ancre, rediriger vers la landing page
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      // Rediriger vers la landing page avec l'ancre
      window.location.href = `/${hash}`;
    }
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Articles</h1>
        <p className="text-lg text-gray-700">
          Bienvenue dans la section des articles. Ici, vous trouverez une collection d'articles informatifs et intéressants sur divers sujets liés à notre domaine. Explorez nos articles pour en savoir plus et rester à jour avec les dernières tendances et informations.
        </p>
      </main>
    </div>
  );
};

export default ArticlesPage;