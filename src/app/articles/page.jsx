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
      image: "/warren-buffett.jpg" // Remplacez par le chemin réel de l'image
    },
    {
      id: 2,
      name: "W. Edwards Deming",
      role: "Pionnier du management de la qualité moderne",
      quote: "« Without data, you're just another person with an opinion »",
      description: "Il a introduit l'amélioration continue et la prise de décision basée sur les données.",
      image: "/deming.jpg" // Remplacez par le chemin réel de l'image
    },
    {
      id: 3,
      name: "Jeff Bezos",
      role: "Fondateur d'Amazon",
      quote: "« Your brand is what other people say about you when you're not in the room »",
      description: "Il a bâti l'une des entreprises les plus centrées client au monde, où la réputation est définie par la voix du client.",
      image: "/jeff-bezos.jpg" // Remplacez par le chemin réel de l'image
    }
  ];

  return (
    <div>
      <Header />
      <main className="mx-auto flex justify-between md:px-22 px-8 py-6 gap-12">
        
        {/* Colonne principale - Article */}
        <div className='lg:w-[65%] w-full'>
          <div className='relative'>
            <img 
              src="/article.png" 
              alt="Articles Banner" 
              className="w-full h-[500px] mb-6" 
            />
            <div className="absolute bottom-6 left-4 right-4 text-white p-4 rounded-lg">
              <p className="text-3xl mb-2">🌿 PHILOSOPHIE OPINOR</p>
              <p className="text-base mb-6">Parce que chaque voix compte et chaque réputation mérite d'être protégée</p>
              <p className="text-xs font-normal text-white/80">janv 26 . 10min lecture</p>
            </div>
          </div>
          
          {/* Article content */}
          <article className="prose prose-lg max-w-none">

            <section className="mb-10">
              <div className="flex items-start gap-3 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Pourquoi Opinor existe?
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                  </div>
                </div>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
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
                  <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/80 rounded-2xl p-6 lg:p-6 border border-amber-100 shadow-sm my-8">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <span className="text-amber-600 font-bold">!</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Le vrai problème ?</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Les commerçants ne <span className="font-bold text-gray-900">manquent</span> pas de 
                        <span className="font-bold text-gray-900"> retours client</span> !!
                      </p>
                      <p className="text-gray-700">
                        Ils <span className="font-bold text-gray-900">les découvrent</span> simplement une fois que 
                        <span className="font-bold text-gray-900"> l'impact</span> est 
                        <span className="font-bold text-gray-900"> déjà visible</span>.
                      </p>
                      <p className="text-gray-700 italic">
                        Et les clients, eux, n'osent pas dire ce qu'ils pensent en face…
                      </p>
                    </div>
                  </div>
                <div className="bg-green-50/80 rounded-2xl p-6 lg:p-6 border border-green-100 shadow-sm my-8">
                  <p className="text-2xl font-bold text-green-700 mb-4">
                    Opinor existe pour changer ça !
                  </p>
                  <p className="text-gray-700 mb-4">Notre rôle est simple :</p>
                  <ul className="space-y-3 pl-5">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Donner au client un endroit pour parler, en privé</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Permettre au commerçant d'écouter, sans stress</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Transformer les retours en actions concrètes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Protéger la réputation d'un établissement avant qu'elle ne soit touchée</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Créer un climat de confiance entre le commerçant et le client</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-lg italic text-center text-gray-600">
                      « Opinor est une solution à un vrai besoin »
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 - Notre vision */}
              <section className="scroll-mt-24  mb-10">
                <div className="flex items-start gap-3 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Notre vision
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <p className="text-xl text-gray-700">
                    Nous croyons que la réputation est la vraie richesse d'un commerce :
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      
                      <p className="text-gray-600 text-lg">
                        Un décor peut être refait,<br />
                        Un menu peut changer,
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      
                      <p className="text-gray-600 text-lg">
                        Une équipe peut être remplacée,<br />
                        Mais une <span className="font-bold text-gray-900">réputation abîmée demande des années</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-100">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        C'est pourquoi nous travaillons avec ce qui compte vraiment :
                      </h3>
                    </div>
                    <ul className="space-y-3 pl-4">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#038788] rounded-full"></div>
                        <span className="text-gray-700 text-lg">Les émotions</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#038788] rounded-full"></div>
                        <span className="text-gray-700 text-lg">Les impressions</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#038788] rounded-full"></div>
                        <span className="text-gray-700 text-lg">Les moments vécus</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#038788] to-teal-600 p-8 text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <p className="text-2xl lg:text-3xl font-bold text-white mb-4">
                        Parce qu'un avis n'est pas seulement une <span className="text-emerald-200">note</span>
                      </p>
                      <p className="text-xl text-white/90 italic">
                        C'est une <span className="font-semibold">expérience</span>, C'est une <span className="font-semibold">histoire</span> !
                      </p>
                    </div>
                  </div>
                </div>
              </section>

            {/* Section 3 - Principes */}
              <section className="scroll-mt-24 mb-10">
                <div className="flex items-start gap-3 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Ce qui nous guide
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
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
                      <div className="flex items-start bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#038788]/30">
                        <div className="flex-shrink-0 mr-6">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {principle.number}
                            </div>
                            <div className="absolute -inset-2 bg-[#038788]/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#038788] transition-colors">
                            {principle.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {principle.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

             {/* Section 4 - Racines */}
              <section className="scroll-mt-24 mb-12">
                <div className="flex items-start gap-3 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Nos racines
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      Opinor est né ici, en <span className="text-[#038788]">Algérie</span>
                    </p>
                    <p className="text-xl text-gray-700 mb-6">
                      Conçu avec <span className="font-semibold">nos réalités</span>, <span className="font-semibold">nos valeurs</span> et <span className="font-semibold">notre quotidien en tête</span>
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                            <span className="text-[#038788]">✓</span>
                          </div>
                          <span className="text-gray-700">Une approche professionnelle moderne</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                            <span className="text-[#038788]">✓</span>
                          </div>
                          <span className="text-gray-700">Notre chaleur humaine</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                            <span className="text-[#038788]">✓</span>
                          </div>
                          <span className="text-gray-700">Notre culture du respect</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#038788]/10 rounded-lg flex items-center justify-center">
                            <span className="text-[#038788]">✓</span>
                          </div>
                          <span className="text-gray-700">Et notre envie d'évolution!!</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#038788]/5 to-teal-500/5 p-6 rounded-xl border border-[#038788]/20">
                      <p className="text-xl font-bold text-gray-800 text-center italic">
                        <span className="text-[#038788]">Opinor</span>, c'est une <span className="text-[#038788]">solution sérieuse</span>…
                        avec une âme locale
                      </p>
                    </div>
                  </div>
                </div>
              </section>

            <section className="scroll-mt-24 mb-12">
                <div className="flex items-start gap-3 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Notre promesse
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-10 text-center">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-[#038788]/10 rounded-full -translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full translate-x-20 translate-y-20"></div>
                    <div className="relative z-10">
                      <p className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                        « On peut copier une idée
                      </p>
                      <p className="text-3xl lg:text-4xl font-bold text-[#038788] leading-tight">
                        On ne copie pas une Réputation ! »
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <p className="text-xl font-bold text-gray-900 mb-6">
                      <span className="text-[#038788] italic">Opinor</span> &nbsp;ne vend pas un service,&nbsp;
                      <span className="text-[#038788] italic">Opinor</span> &nbsp;vous offre un système qui :
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {[
                          "Protège votre image",
                          "Renforce votre relation avec vos clients",
                          "Améliore vos résultats"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#038788] to-teal-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gradient-to-br from-[#038788]/5 to-teal-500/5 rounded-xl p-6 flex items-center justify-center">
                        <p className="text-lg font-bold text-gray-900 text-center">
                          Et vous aide à <span className="text-[#038788]">tenir vos promesses, chaque jour</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            <section className="mb-10">
              <div className="flex items-start gap-3 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">✦</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Notre mission
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                  </div>
                </div>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p className="text-xl font-semibold text-gray-800">
                  Créer un environnement où :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <p>Le client peut s'exprimer,</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p>Le commerçant peut écouter,</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p>La confiance devient normale,</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#038788] text-white rounded-full p-2 mr-3 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p>Et la qualité évolue pas à pas, avec méthode</p>
                    </div>
                  </div>
                </div>
               <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#038788] to-teal-600 p-10 text-center">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-32 translate-y-32"></div>
                    <div className="relative z-10">
                      <p className="text-2xl lg:text-3xl font-bold text-white mb-6">
                        « Opinor est :
                      </p>
                      <div className="space-y-4 text-xl text-white/90">
                        <p className="font-semibold">Un nouveau réflexe, Un nouveau standard,</p>
                        <p className="italic text-white">
                          Une nouvelle approche du pilotage <span className="font-bold">qualité</span> et <span className="font-bold">réputation »</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </section>

          </article>
        </div>

        {/* Sidebar */}
        <div className='lg:w-[35%] w-full'>
          <div className="bg-gray-50 rounded-xl p-2 sticky top-0">
            
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

      </main>
    </div>
  );
};

export default ArticlesPage;