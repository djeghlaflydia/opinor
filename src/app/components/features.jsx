import React from "react";

const Features = () => {
  return (
    <div
  className="relative flex flex-col items-center justify-center px-16 py-20 text-white"
  style={{
    backgroundImage: "url('/bgFeatures.png')",
    backgroundSize: "80%", // diminue la taille de l'image
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

      {/* Couche de couleur transparente pour lisibilité du texte */}
      <div className="absolute inset-0"></div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col gap-10 w-full max-w-6xl">
        {/* Ligne 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
           <img src="/icon1.svg" alt="Logo" className="h-auto w-auto mt-4 mb-4 select-none" />
            <h3 className="text-lg text-black font-semibold mb-2">QR Code Feedback</h3>
            <p className="text-sm text-[#64748B] opacity-80">Permettez à vos clients de donner leur avis en un simple scan.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-sm transition">
           <img src="/icon2.svg" alt="Logo" className="h-auto w-auto mt-4 mb-4 select-none" />
            <h3 className="text-lg text-black font-semibold mb-2">Dashboard Analytique</h3>
            <p className="text-sm text-[#64748B] opacity-80">Visualisez les notes, commentaires et tendances en temps réel.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité 3</h3>
            <p className="text-sm opacity-80">Description rapide ici.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité 4</h3>
            <p className="text-sm opacity-80">Description rapide ici.</p>
          </div>
        </div>

        {/* Ligne 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité 5</h3>
            <p className="text-sm opacity-80">Description rapide ici.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité 6</h3>
            <p className="text-sm opacity-80">Description rapide ici.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité 7</h3>
            <p className="text-sm opacity-80">Description rapide ici.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité 8</h3>
            <p className="text-sm opacity-80">Description rapide ici.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
