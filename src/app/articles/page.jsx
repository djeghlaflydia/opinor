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
                {/*<p className="text-sm md:text-base mb-3 md:mb-6 max-w-2xl">
                  Parce que chaque voix compte et chaque réputation mérite d'être protégée
                </p>*/}
                <p className="text-sm md:text-base mb-3 md:mb-6 max-w-2xl">
                  Ce qui s'écoute mal finit toujours par coûter cher</p>
                <p className="text-xs font-normal text-white/80">janv 26 . 10min lecture</p>
              </div>
            </div>
          </div>
          
          {/* Article content */}
          <article className="prose prose-sm md:prose-lg max-w-none">

            {/* Section 1 - Introduction */}
            <section className="mb-8 md:mb-10">
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                

                <p className="text-lg md:text-xl text-gray-800">
                  Aujourd'hui, les clients ne s'expriment plus au bon moment
                </p>
                
                <p className="text-lg md:text-xl text-gray-800">
                  Ils parlent quand la décision est déjà prise
                </p>
                
                <p className="text-lg md:text-xl text-gray-800">
                  Et souvent, ce n'est plus vous qui la contrôlez…
                </p>

                 {/* Section Perception */}
            <section className="mb-12">
              <div className="border-l-4 border-[#038788] pl-6 mb-8">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Un seul retour peut influencer une perception !
                </h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Plusieurs retours non lus construisent une trajectoire.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-center mb-4">
                    La question n'est donc pas s'il y a des avis.
                  </p>
                  <div className="text-center">
                    <div className="inline-block">
                      <p className="text-lg font-semibold text-gray-700 mb-2">La vraie question est :</p>
                      <p className="text-xl md:text-2xl font-bold text-[#038788]">
                        Qui les lit correctement ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Le Problème */}
            <section className="mb-12">
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-red-600">•</span>
                  LE PROBLÈME
                </h3>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Les entreprises ne manquent pas de feedback. Elles manquent de lecture stratégique.
                  </p>
                  <p className="text-gray-700">
                    Les signaux existent. Ils sont simplement ignorés jusqu'à ce qu'ils deviennent visibles.
                  </p>
                  
                  <div className="mt-6 p-4 bg-white rounded-lg">
                    <p className="text-gray-900 text-center">
                      À ce stade, il ne s'agit plus d'améliorer. Il s'agit de réparer.
                    </p>
                    <p className="text-[#038788] text-center mt-2">
                      Et réparer une réputation coûte toujours plus cher que de la piloter.
                    </p>
                  </div>
                </div>
              </div>
            </section>
              </div>
            </section>

            {/* Section 2 - Pourquoi Opinor existe */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    POURQUOI OPINOR EXISTE
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <p className="text-lg md:text-xl text-gray-800 ">
                  Opinor a été conçu pour intervenir avant le point de rupture.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-red-50/80 p-4 md:p-6 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-600 font-bold text-2xl">≠</span>
                      <p className="text-lg text-gray-800">Pas pour réagir</p>
                    </div>
                  </div>
                  <div className="bg-green-50/80 p-4 md:p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-bold text-2xl">=</span>
                      <p className="text-lg  text-gray-800">Pour anticiper</p>
                    </div>
                  </div>
                  <div className="bg-red-50/80 p-4 md:p-6 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-600 font-bold text-2xl">≠</span>
                      <p className="text-lg  text-gray-800">Pas pour commenter l'expérience client</p>
                    </div>
                  </div>
                  <div className="bg-green-50/80 p-4 md:p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-bold text-2xl">=</span>
                      <p className="text-lg  text-gray-800">Pour en faire un levier de décision</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Positionnement */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    POSITIONNEMENT
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#038788] shadow-sm">
                  <p className="text-2xl md:text-3xl text-gray-900 text-center mb-4">
                    Opinor n'est pas un outil.
                  </p>
                  <p className="text-2xl md:text-3xl text-[#038788] text-center">
                    C'est un système d'aide à la décision, fondé sur la voix client.
                  </p>
                </div>
                
                <p className="text-lg md:text-xl text-gray-800">
                  Sa méthodologie repose sur cinq piliers opérationnels, pensés pour les dirigeants qui pilotent sur le long terme
                </p>
                
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                  <div className="space-y-4 md:space-y-6">
                    {[
                      {
                        title: "Canal confidentiel",
                        description: "Un espace sécurisé où le client s'exprime librement."
                      },
                      {
                        title: "Lecture structurée",
                        description: "Les retours sont analysés avec méthode, pas sous pression."
                      },
                      {
                        title: "Décisions traçables",
                        description: "Chaque feedback alimente une action claire et mesurable."
                      },
                      {
                        title: "Prévention réputationnelle",
                        description: "Les signaux faibles sont identifiés avant qu'ils n'impactent la marque."
                      },
                      {
                        title: "Capital confiance",
                        description: "Un client écouté devient un allié, pas un risque."
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#038788] text-white rounded-lg flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center p-6 md:p-8 bg-gradient-to-r from-[#038788]/10 to-teal-500/10 rounded-2xl border border-[#038788]/20">
                  <p className="text-xl md:text-2xl font-semibold text-gray-900">
                    Opinor ne collecte pas des avis.
                  </p>
                  <p className="text-xl md:text-2xl font-semibold text-[#038788]">
                    Elle transforme la voix client en intelligence exploitable.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 - Notre vision */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    NOTRE VISION
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-200">
                  <p className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-4">
                    La réputation n'est pas un résultat.
                  </p>
                  <p className="text-2xl md:text-3xl font-semibold text-[#038788] text-center">
                    C'est une infrastructure stratégique
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-semibold text-gray-800">Ce qui se remplace vite</p>
                    <p className="text-gray-600 text-sm mt-1">n'est jamais un avantage compétitif</p>
                  </div>
                  <div className="p-4 bg-white border border-[#038788]/20 rounded-lg">
                    <p className="font-semibold text-gray-800">Ce qui prend des années à construire</p>
                    <p className="text-gray-600 text-sm mt-1">doit être protégé très en amont</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                    Dans une entreprise, presque tout est ajustable :
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <p className=" text-gray-800">Les opérations</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <p className=" text-gray-800">L'offre</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <p className=" text-gray-800">Les équipes</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-lg md:text-xl  text-gray-900 text-center">
                      La réputation, elle, s'accumule lentement et se détériore rapidement.
                    </p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                  <h4 className=" text-gray-900 mb-4">Lorsqu'elle est fragilisée, les effets sont systémiques :</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Allongement du cycle de confiance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Hausse du coût d'acquisition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Érosion progressive de la conversion</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-gray-900">
                    Une réputation affaiblie ralentit la croissance avant même qu'on s'en rende compte.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 - Ce sur quoi Opinor travaille */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    CE SUR QUOI OPINOR TRAVAILLE
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <p className="text-lg md:text-xl text-gray-800">
                  Opinor travaille sur ce qui influence réellement les décisions :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#038788]/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-[#038788]">👁️</span>
                    </div>
                    <p className=" text-gray-900 text-lg">La perception</p>
                  </div>
                  <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#038788]/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-[#038788]">📶</span>
                    </div>
                    <p className="text-gray-900 text-lg">Les signaux faibles</p>
                  </div>
                  <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#038788]/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-[#038788]">🔄</span>
                    </div>
                    <p className="text-gray-900 text-lg">Les expériences récurrentes</p>
                  </div>
                </div>
                
                <div className="text-center p-6 md:p-8 bg-gradient-to-r from-[#038788] to-teal-600 rounded-2xl">
                  <p className="text-xl md:text-2xl text-white mb-4">
                    Parce qu'un feedback n'est pas une note.
                  </p>
                  <p className="text-xl md:text-2xl  text-white">
                    C'est un indicateur avancé de ce qui fonctionne et de ce qui doit évoluer
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 - Nos racines */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    NOS RACINES
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                <p className=" text-gray-900 ">
                  Opinor a été conçu localement, avec une lecture précise du marché algérien.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-6">
                  <div className="bg-red-50/80 p-4 md:p-6 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 font-bold text-2xl">≠</span>
                      <p className="text-lg text-gray-800">Sans copier des modèles externes</p>
                    </div>
                  </div>
                  <div className="bg-red-50/80 p-4 md:p-6 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 font-bold text-2xl">≠</span>
                      <p className="text-lg text-gray-800">Sans transposer des solutions hors contexte</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-2xl border border-gray-200">
                  <div className="space-y-4 md:space-y-6">
                    {[
                      {
                        title: "Exigence professionnelle",
                        description: "Des standards élevés, adaptés à la réalité du terrain."
                      },
                      {
                        title: "Intelligence culturelle",
                        description: "Une compréhension fine des dynamiques relationnelles locales."
                      },
                      {
                        title: "Vision long terme",
                        description: "Grandir avec des entreprises qui construisent, pas qui improvisent"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-[#038788] text-white rounded-lg flex items-center justify-center">
                          <span className="font-bold text-lg">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{item.title}</h4>
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center p-6 md:p-8 bg-gradient-to-r from-[#038788]/10 to-teal-500/10 rounded-2xl border border-[#038788]/20">
                  <p className="text-xl md:text-2xl font-semibold text-gray-900">
                    Opinor est une solution business locale avec une vision internationale
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 - Ce qui nous guide */}
            <section className="scroll-mt-24 mb-8 md:mb-10">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    CE QUI NOUS GUIDE
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {[
                  {
                    number: "1",
                    title: "Écoute réelle",
                    description: "Chaque retour est pris au sérieux, même inconfortable."
                  },
                  {
                    number: "2",
                    title: "Clarté",
                    description: "Les données sont présentées sans filtre ni mise en scène."
                  },
                  {
                    number: "3",
                    title: "Confidentialité",
                    description: "Les échanges restent internes, par principe."
                  },
                  {
                    number: "4",
                    title: "Neutralité",
                    description: "Nous ne prenons pas parti. Nous clarifions."
                  },
                  {
                    number: "5",
                    title: "Progression continue",
                    description: "Chaque signal est une opportunité d'ajustement"
                  }
                ].map((principle) => (
                  <div key={principle.number} className="group">
                    <div className="flex items-start bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 mr-4 md:mr-6">
                        <div className="relative">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg">
                            {principle.number}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                          {principle.title}
                        </h3>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8 - Conclusion */}
            <section className="scroll-mt-24 mb-8 md:mb-12">
              <div className="flex items-start gap-3 mb-6 md:mb-8">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#038788] to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-white">✦</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    CONCLUSION
                  </h2>
                  <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#038788] to-teal-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-10 text-center">
                  <div className="absolute top-0 left-0 w-40 h-40 md:w-48 md:h-48 bg-[#038788]/10 rounded-full -translate-x-20 -translate-y-20 md:-translate-x-24 md:-translate-y-24"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 md:w-48 md:h-48 bg-teal-500/10 rounded-full translate-x-20 translate-y-20 md:translate-x-24 md:translate-y-24"></div>
                  <div className="relative z-10">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                      Une idée peut se copier.
                    </p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#038788] leading-tight">
                      Une réputation se construit !
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                  <p className="text-xl md:text-2xl  text-gray-900 mb-6 text-center">
                    Opinor s'adresse aux dirigeants qui ont compris que la croissance durable commence par une écoute bien structurée
                  </p>
                  
                  <div className="text-center p-6 md:p-8 bg-gradient-to-r from-[#038788]/5 to-teal-500/5 rounded-xl border border-[#038788]/10">
                    <p className="text-2xl md:text-3xl text-[#038788] mb-4">
                      La réputation ne se gère pas après coup.
                    </p>
                    <p className="text-2xl md:text-3xl text-gray-900">
                      Elle se pilote.
                    </p>
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
                    <blockquote className=" text-gray-700 mb-3 pl-2 border-l-3 border-[#038788]">
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
                  <blockquote className=" text-gray-700 mb-2 pl-2 border-l-2 border-[#038788] text-sm">
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