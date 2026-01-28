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

  const quotes = [
    {
      id: 1,
      name: "Warren Buffett",
      role: "Investisseur légendaire et dirigeant de Berkshire Hathaway",
      quote: "« It takes 20 years to build a reputation and five minutes to ruin it »",
      description: "Il considère la réputation comme l'actif le plus précieux d'une entreprise.",
      image: "/warren-buffett.jpg"
    },
    {
      id: 2,
      name: "W. Edwards Deming",
      role: "Pionnier du management de la qualité moderne",
      quote: "« Without data, you're just another person with an opinion »",
      description: "Il a introduit l'amélioration continue et la prise de décision basée sur les données.",
      image: "/deming.jpg"
    },
    {
      id: 3,
      name: "Jeff Bezos",
      role: "Fondateur d'Amazon",
      quote: "« Your brand is what other people say about you when you're not in the room »",
      description: "Il a bâti l'une des entreprises les plus centrées client au monde, où la réputation est définie par la voix du client.",
      image: "/jeff-bezos.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto lg:flex lg:justify-between px-4 sm:px-6 md:px-8 lg:px-22 py-4 md:py-6 gap-8 lg:gap-12">
        
        {/* Colonne principale - Article */}
        <div className='lg:w-[65%] w-full'>
          <div className='relative mb-6 md:mb-8'>
            <img 
              src="/article.png" 
              alt="Articles Banner" 
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 rounded-b-2xl">
              <div className="text-white">
                <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">🌿 PHILOSOPHIE OPINOR</p>
                <p className="text-sm md:text-base mb-3 md:mb-6 max-w-2xl">
                  Parce que chaque voix compte et chaque réputation mérite d'être protégée
                </p>
                <p className="text-xs font-normal text-white/80">janv 26 . 10min lecture</p>
              </div>
            </div>
          </div>
          
          {/* Article content */}
          <article className="prose prose-sm md:prose-lg max-w-none">

            {/* Section 1 - Pourquoi Opinor existe? */}
            <section className="mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Pourquoi Opinor existe?
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <p>
                  Aujourd'hui, un client ne parle plus au gérant, 
                  <span className="font-semibold"> Il parle à Internet…</span>
                </p>
                <p>
                  Une seule story, 
                  Un seul commentaire, 
                  Et <span className="font-bold">l'image</span> d'un <em>commerce</em> <span className="font-bold">peut changer</span>…..
                </p>
                
                {/* Problème */}
                <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 rounded-2xl p-4 md:p-6 lg:p-6 border border-amber-100 shadow-sm my-6 md:my-8">
                  <div className="flex items-start gap-3 mb-3 md:mb-4">
                    <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600 font-bold">!</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">Le vrai problème ?</h3>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-gray-700">
                      Les commerçants ne <span className="font-bold text-gray-900">manquent</span> pas de 
                      <span className="font-bold text-gray-900"> retours client</span> !!
                    </p>
                    <p className="text-gray-700">
                      Ils <span className="font-bold text-gray-900">les découvrent</span> simplement une fois que 
                      <span className="font-bold text-gray-900"> l'impact</span> est 
                      <span className="font-bold text-gray-900"> déjà visible</span>.
                    </p>
                    <p className="text-gray-700  ">
                      Et les clients, eux, n'osent pas dire ce qu'ils pensent en face…
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-50/80 rounded-2xl p-4 md:p-6 lg:p-6 border border-green-100 shadow-sm my-6 md:my-8">
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-700 mb-3 md:mb-4">
                    Opinor existe pour changer ça !
                  </p>
                  <p className="text-gray-700 mb-3 md:mb-4">Notre rôle est simple :</p>
                  <ul className="space-y-2 md:space-y-3 pl-4 md:pl-5">
                    {[
                      "Donner au client un endroit pour parler, en privé",
                      "Permettre au commerçant d'écouter, sans stress",
                      "Transformer les retours en actions concrètes",
                      "Protéger la réputation d'un établissement avant qu'elle ne soit touchée",
                      "Créer un climat de confiance entre le commerçant et le client"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span className="text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-base md:text-lg italic text-center text-gray-600">
                      « Opinor est une solution à un vrai besoin »
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 - Notre vision */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Notre vision
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <p className="text-lg md:text-xl text-gray-700">
                  Nous croyons que la réputation est la vraie richesse d'un commerce :
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-base md:text-lg">
                      Un décor peut être refait,<br />
                      Un menu peut changer,
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-gray-600 text-base md:text-lg">
                      Une équipe peut être remplacée,<br />
                      Mais une <span className="font-bold text-gray-900">réputation abîmée demande des années</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 md:p-6 rounded-2xl border border-sky-100">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                    C'est pourquoi nous travaillons avec ce qui compte vraiment :
                  </h3>
                  <ul className="space-y-2 md:space-y-3 pl-2 md:pl-4">
                    {["Les émotions", "Les impressions", "Les moments vécus"].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 md:gap-3">
                        <div className="w-2 h-2 bg-[#038788] rounded-full"></div>
                        <span className="text-gray-700 text-base md:text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#038788] to-teal-600 p-6 md:p-8 text-center">
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 md:-translate-y-16 md:translate-x-16"></div>
                  <div className="relative z-10">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">
                      Parce qu'un avis n'est pas seulement une <span className="text-emerald-200">note</span>
                    </p>
                    <p className="text-lg md:text-xl text-white/90  ">
                      C'est une <span className="font-semibold">expérience</span>, C'est une <span className="font-semibold">histoire</span> !
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Principes */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Ce qui nous guide
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    number: "1",
                    title: "On écoute — vraiment",
                    description: "Chaque avis mérite attention… Même s'il dérange"
                  },
                  {
                    number: "2",
                    title: "On dit la vérité",
                    description: "Les données sont claires, honnêtes (Pas de maquillage)"
                  },
                  {
                    number: "3",
                    title: "On protège la confidentialité",
                    description: "Ce qui se dit chez un commerce reste chez le commerce"
                  },
                  {
                    number: "4",
                    title: "On reste neutres",
                    description: "Nous ne défendons personne, nous aidons les deux côtés à se comprendre"
                  },
                  {
                    number: "5",
                    title: "On avance",
                    description: "Chaque retour est une opportunité d'améliorer"
                  }
                ].map((principle) => (
                  <div key={principle.number} className="group">
                    <div className="flex items-start bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex-shrink-0 mr-4 md:mr-6">
                        <div className="relative">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                            {principle.number}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                          {principle.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 - Racines */}
            <section className="scroll-mt-24 mb-8 md:mb-12">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Nos racines
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                    Opinor est né ici, en <span className="text-[#038788]">Algérie</span>
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
                    Conçu avec <span className="font-semibold">nos réalités</span>, <span className="font-semibold">nos valeurs</span> et <span className="font-semibold">notre quotidien en tête</span>
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[#038788]">✓</span>
                        </div>
                        <span className="text-gray-700 text-sm md:text-base">Une approche professionnelle moderne</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[#038788]">✓</span>
                        </div>
                        <span className="text-gray-700 text-sm md:text-base">Notre chaleur humaine</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[#038788]">✓</span>
                        </div>
                        <span className="text-gray-700 text-sm md:text-base">Notre culture du respect</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[#038788]">✓</span>
                        </div>
                        <span className="text-gray-700 text-sm md:text-base">Et notre envie d'évolution!!</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#038788]/5 to-teal-500/5 p-4 md:p-6 rounded-xl border border-[#038788]/20">
                    <p className="text-lg md:text-xl font-bold text-gray-800 text-center  ">
                      <span className="text-[#038788]">Opinor</span>, c'est une <span className="text-[#038788]">solution sérieuse</span>…
                      avec une âme locale
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Notre promesse */}
            <section className="scroll-mt-24 mb-8 md:mb-12">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Notre promesse
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-10 text-center">
                  <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-[#038788]/10 rounded-full -translate-x-16 -translate-y-16 md:-translate-x-20 md:-translate-y-20"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-teal-500/10 rounded-full translate-x-16 translate-y-16 md:translate-x-20 md:translate-y-20"></div>
                  <div className="relative z-10">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-6 leading-tight">
                      « On peut copier une idée
                    </p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#038788] leading-tight">
                      On ne copie pas une Réputation ! »
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                  <p className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                    <span className="text-[#038788]  ">Opinor</span> ne vend pas un service,&nbsp;
                    <span className="text-[#038788]  ">Opinor</span> vous offre un système qui :
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3 md:space-y-4">
                      {[
                        "Protège votre image",
                        "Renforce votre relation avec vos clients",
                        "Améliore vos résultats"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#038788] to-teal-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-br from-[#038788]/5 to-teal-500/5 rounded-xl p-4 md:p-6 flex items-center justify-center">
                      <p className="text-base md:text-lg font-bold text-gray-900 text-center">
                        Et vous aide à <span className="text-[#038788]">tenir vos promesses, chaque jour</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 - Notre mission */}
            <section className="mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Notre mission
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <p className="text-lg md:text-xl font-semibold text-gray-800">
                  Créer un environnement où :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6 md:my-8">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <p className="text-sm md:text-base">Le client peut s'exprimer,</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-sm md:text-base">Le commerçant peut écouter,</p>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm md:text-base">La confiance devient normale,</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-sm md:text-base">Et la qualité évolue pas à pas, avec méthode</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#038788] to-teal-600 p-6 md:p-10 text-center">
                  <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white/5 rounded-full -translate-x-24 -translate-y-24 md:-translate-x-32 md:-translate-y-32"></div>
                  <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/5 rounded-full translate-x-24 translate-y-24 md:translate-x-32 md:translate-y-32"></div>
                  <div className="relative z-10">
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6">
                      « Opinor est :
                    </p>
                    <div className="space-y-2 md:space-y-4 text-base md:text-xl text-white/90">
                      <p className="font-semibold">Un nouveau réflexe, Un nouveau standard,</p>
                      <p className="  text-white">
                        Une nouvelle approche du pilotage <span className="font-bold">qualité</span> et <span className="font-bold">réputation »</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </article>
        </div>

        {/* Sidebar - Hidden on mobile, shown on large screens */}
        <div className='hidden lg:block lg:w-[35%] w-full'>
          <div className="bg-gray-50 rounded-xl p-2 sticky top-6">
            {/* Section Citations inspirantes */}
            <div className="border-gray-200">
              <div className="space-y-4">
                {quotes.map((person) => (
                  <div key={person.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={person.image} 
                          alt={person.name}
                          className="w-full h-full object-cover rounded-full border-2 border-[#038788]/20"
                        />
                      </div>
                      <div className='mt-1'>
                        <h4 className="font-bold text-gray-800">{person.name}</h4>
                        <p className="text-xs text-gray-600">{person.role}</p>
                      </div>
                    </div>
                    <blockquote className="italic text-gray-700 mb-3 pl-2 border-l-3 border-[#038788]">
                      {person.quote}
                    </blockquote>
                    <p className="text-sm text-gray-600">
                      {person.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only sidebar at bottom */}
        <div className='lg:hidden w-full mt-8'>
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Citations inspirantes</h3>
            <div className="space-y-4">
              {quotes.map((person) => (
                <div key={person.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img 
                        src={person.image} 
                        alt={person.name}
                        className="w-full h-full object-cover rounded-full border-2 border-[#038788]/20"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-600">{person.role}</p>
                    </div>
                  </div>
                  <blockquote className="italic text-gray-700 mb-2 pl-2 border-l-2 border-[#038788] text-sm">
                    {person.quote}
                  </blockquote>
                  <p className="text-xs text-gray-600">
                    {person.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ArticlesPage;