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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-[#038788]">✦</span> Pourquoi Opinor existe?
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Aujourd'hui, un client ne parle plus au gérant,<br />
                  <span className="font-semibold">Il parle à Internet…</span>
                </p>
                <p>
                  Une seule story,<br />
                  Un seul commentaire,<br />
                  Et <span className="font-bold">l'image</span> d'un <em>commerce</em> <span className="font-bold">peut changer</span>…..
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                  <p className="text-xl font-semibold text-gray-800">Le vrai problème ?</p>
                  <p className="text-gray-700 mt-2">
                    Les commerçants ne <span className="font-bold">manquent</span> pas de <span className="font-bold">retours client</span> !! 
                    <br /><br />
                    Ils <span className="font-bold">les découvrent</span> simplement une fois que <span className="font-bold">l'impact</span> est <span className="font-bold">déjà visible</span>.
                    <br /><br />
                    Et les clients, eux, n'osent pas dire ce qu'ils pensent en face….
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                  <p className="text-xl font-semibold text-gray-800 mb-2">Mais,</p>
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
                    <p className="text-lg italic text-gray-600">
                      « Opinor est une solution à un vrai besoin »
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-[#038788]">✦</span> Notre vision
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Nous croyons que la réputation est la vraie richesse d'un commerce :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-2">Un décor peut être refait,</p>
                    <p className="text-gray-600 text-sm">Un menu peut changer,</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-2">Une équipe peut être remplacée,</p>
                    <p className="text-gray-600 text-sm">Mais une <span className="font-bold">réputation abîmée demande des années</span></p>
                  </div>
                </div>
                <p>
                  C'est pourquoi nous travaillons avec ce qui compte vraiment :
                </p>
                <ul className="space-y-2 pl-5 text-lg">
                  <li className="flex items-center">
                    <span className="text-[#038788] mr-2">•</span>
                    <span>les émotions, les impressions, les moments vécus</span>
                  </li>
                </ul>
                <div className="bg-blue-50 p-6 rounded-xl my-6">
                  <p className="text-xl text-gray-800 mb-2">
                    Parce qu'un avis n'est pas seulement une <span className="font-bold">note</span>
                  </p>
                  <p className="text-lg italic text-gray-700">
                    C'est une <em>expérience</em><br />
                    C'est une <em>histoire !</em>
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-[#038788]">✦</span> Ce qui nous guide (nos principes)
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Nous avons posé des règles simples :
              </p>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span className="bg-[#038788] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                    On écoute — vraiment
                  </h3>
                  <p className="text-gray-700 pl-11">Chaque avis mérite attention… Même s'il dérange</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span className="bg-[#038788] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                    On dit la vérité
                  </h3>
                  <p className="text-gray-700 pl-11">Les données sont claires, honnêtes (Pas de maquillage)</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span className="bg-[#038788] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                    On protège la confidentialité
                  </h3>
                  <p className="text-gray-700 pl-11">Ce qui se dit chez un commerce reste chez le commerce</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span className="bg-[#038788] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                    On reste neutres
                  </h3>
                  <p className="text-gray-700 pl-11">
                    Nous ne défendons personne<br />
                    Nous aidons les deux côtés à se comprendre
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span className="bg-[#038788] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                    On avance
                  </h3>
                  <p className="text-gray-700 pl-11">Chaque retour est une opportunité d'améliorer</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-[#038788]">✦</span> Nos racines
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p className="text-2xl font-bold text-[#038788]">
                  Opinor est né ici, en <span className="text-gray-800">Algérie</span>
                </p>
                <p>
                  Conçu avec <em>nos réalités</em>, <em>nos valeurs et notre quotidien en tête</em>
                </p>
                <p className="text-xl font-semibold text-gray-800 mt-4 mb-3">
                  Nous mélangeons :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="text-[#038788] mr-2">—</span>
                      <span>Une approche professionnelle moderne</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-[#038788] mr-2">—</span>
                      <span>Notre chaleur humaine</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="text-[#038788] mr-2">—</span>
                      <span>Notre culture du respect</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-[#038788] mr-2">—</span>
                      <span>Et notre envie d'évolution!!</span>
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#038788]/10 to-blue-100 p-6 rounded-xl border border-[#038788]/20">
                  <p className="text-xl font-bold text-gray-800">
                    <em>Opinor</em>, c'est une <em>solution sérieuse</em>… avec une âme locale
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-[#038788]">✦</span> Notre promesse
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <div className="text-center bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    « On peut copier une idée
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-[#038788]">
                    On ne copie pas une Réputation ! »
                  </p>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  <em>Opinor</em> ne <span className="font-bold">vend</span> pas un <span className="font-bold">service</span>
                </p>
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  <em>Opinor</em> vous offre un <span className="font-bold">système</span> qui :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-[#038788]/5 p-4 rounded-lg">
                    <p className="font-medium text-gray-800">• Protège votre image</p>
                    <p className="font-medium text-gray-800">• Renforce votre relation avec vos clients</p>
                  </div>
                  <div className="bg-[#038788]/5 p-4 rounded-lg">
                    <p className="font-medium text-gray-800">• Améliore vos résultats</p>
                    <p className="font-medium text-gray-800">• Et vous aide à <span className="font-bold">tenir vos promesses, chaque jour</span></p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-[#038788]">✦</span> Notre mission
              </h2>
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
                <div className="bg-gradient-to-r from-[#038788] to-teal-600 text-white p-8 rounded-2xl text-center">
                  <p className="text-2xl md:text-3xl font-bold mb-2">
                    « Opinor est :
                  </p>
                  <div className="space-y-2 text-xl">
                    <p>Un nouveau réflexe, Un nouveau standard,</p>
                    <p className="italic">Une nouvelle approche du pilotage <span className="font-bold">qualité</span> et <span className="font-bold">réputation »</span></p>
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