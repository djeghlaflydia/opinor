import React from "react";

const Features = () => {
  return (
    <section className="relative flex flex-col items-center justify-start text-white px-8 lg:px-16 py-20 overflow-hidden bg-white">
      {/* Image de fond (en haut à droite, dans la section seulement) */}
      <img
        src="/bg.png"
        alt="Background"
        className="absolute top-[-300px] right-0 w-[55%] h-auto select-none pointer-events-none object-contain"
      />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col gap-12 w-full max-w-6xl">
        {/* Ligne 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 block lg:hidden transition col-span-1 sm:col-span-2">
            <h3 className="text-2xl lg:text-4xl text-black font-semibold mb-4">
              Des fonctionnalités claires pour écouter et agir
            </h3>
            <p className=" text-[#64748B]/80 opacity-80">
              Opinor simplifie la collecte et l’analyse d’avis anonymes pour que
              chaque commerce puisse améliorer son expérience client sans perdre
              de temps.
            </p>
          </div>
          {/* Carte 1 */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
            <img
              src="/icon1.svg"
              alt="QR Code Feedback"
              className="h-auto w-auto mb-2 select-none"
            />
            <h3 className="text-lg text-black font-semibold mb-2">
              QR Code Feedback
            </h3>
            <p className="text-sm text-[#64748B] opacity-80">
              Permettez à vos clients de donner leur avis en un simple scan.
            </p>
            <div className="w-[30%] h-[2px] bg-[#0F172A33]/80 mt-4"></div>
          </div>

          {/* Carte 2 */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
            <img
              src="/icon2.svg"
              alt="Dashboard Analytique"
              className="h-auto w-auto mb-2 select-none"
            />
            <h3 className="text-lg text-black font-semibold mb-2">
              Dashboard Analytique
            </h3>
            <p className="text-sm text-[#64748B] opacity-80">
              Visualisez les notes, commentaires et tendances en temps réel.
            </p>
            <div className="w-[30%] h-[2px] bg-[#0F172A33]/80 mt-4"></div>
          </div>

          {/* Bloc combiné sur 2 colonnes */}
          <div className="p-6 transition col-span-2 lg:block hidden">
            <h3 className="text-3xl lg:text-4xl text-black font-semibold mb-4">
              Des fonctionnalités claires pour écouter et agir
            </h3>
            <p className="text-md text-[#64748B]/80 opacity-80">
              Opinor simplifie la collecte et l’analyse d’avis anonymes pour que
              chaque commerce puisse améliorer son expérience client sans perdre
              de temps.
            </p>
          </div>
        </div>

        {/* Ligne 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Carte 3 */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
            <img
              src="/icon3.svg"
              alt="Alertes Instantanées"
              className="h-auto w-auto mb-2 select-none"
            />
            <h3 className="text-lg text-black font-semibold mb-2">
              Alertes Instantanées
            </h3>
            <p className="text-sm text-[#64748B] opacity-80">
              Soyez averti dès qu’un client exprime une insatisfaction.
            </p>
            <div className="w-[30%] h-[2px] bg-[#0F172A33]/80 mt-4"></div>
          </div>

          {/* Carte 4 */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
            <img
              src="/icon4.svg"
              alt="Rapports Professionnels"
              className="h-auto w-auto mb-2 select-none "
            />
            <h3 className="text-lg text-black font-semibold mb-2">
              Rapports Professionnels
            </h3>
            <p className="text-sm text-[#64748B] opacity-80">
              Téléchargez vos statistiques en PDF ou Excel.
            </p>
            <div className="w-[30%] h-[2px] bg-[#0F172A33]/80 mt-4"></div>
          </div>

          {/* Carte 5 */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
            <img
              src="/icon5.svg"
              alt="Multi-établissements"
              className="h-auto w-auto mb-2 select-none"
            />
            <h3 className="text-lg text-black font-semibold mb-2">
              Multi-établissements
            </h3>
            <p className="text-sm text-[#64748B] opacity-80">
              Gérez plusieurs points de vente dans un seul espace.
            </p>
            <div className="w-[30%] h-[2px] bg-[#0F172A33]/80 mt-4"></div>
          </div>

          {/* Carte 6 */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
            <img
              src="/icon6.svg"
              alt="Gestion des feedbacks"
              className="h-auto w-auto mb-2 select-none"
            />
            <h3 className="text-lg text-black font-semibold mb-2">
              Gestion des feedbacks
            </h3>
            <p className="text-sm text-[#64748B] opacity-80">
              Filtrez, classez et répondez facilement aux feedbacks.
            </p>
            <div className="w-[30%] h-[2px] bg-[#0F172A33]/80 mt-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
