"use client";
import React, { useEffect } from 'react';
import Header from '../components/header';

const ArticlesPage = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      window.location.href = `/${hash}`;
    }
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-12">
        <div className='w-[60%] relative'>
          <img 
            src="/article.png" 
            alt="Articles Banner" 
            className="w-full h-auto mb-6" 
          />
          <div className="absolute bottom-10 left-4 right-4 text-white p-4 rounded-lg">
            <p className="text-3xl mb-2">🌿 PHILOSOPHIE OPINOR</p>
            <p className="text-base mb-6">Parce que chaque voix compte et chaque réputation mérite d’être protégée</p>
            <p className="text-xs font-normal text-white/80">janv 26 . 10min lecture</p>
          </div>
        </div>
        <div className='w-[40%]'>hiii</div>
      </main>
    </div>
  );
};

export default ArticlesPage;