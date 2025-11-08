import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-[100vh] flex  overflow-hidden p-12">
      {/* Image de fond */}
      <img
        src="/process.png"
        alt="process"
        className="absolute inset-0 w-full h-full object-cover select-none p-12"
      />

      {/* Overlay léger pour la lisibilité du texte */}
      <div className="absolute inset-0"></div>

      {/* Contenu texte centré sur l’image */}
      <div className="relative z-10  max-w-3xl px-6">
        <p className="text-[#C64C3A] font-bold uppercase tracking-wider">
          Comment ça marche ?
        </p>
        <h1 className="text-5xl font-bold leading-tight mt-2">
          Simple. Rapide. Efficace.
        </h1>
        <p className="text-lg mt-4 mb-6 text-[#64607D]">
          Collectez, analysez et améliorez l’expérience client <br /> en toute
          simplicité.
        </p>
        <button className="bg-[#C64C3A] text-lg font-medium text-white px-8 py-3 rounded-full hover:bg-[#a23c2f] transition">
          Commencer
        </button>
      </div>
    </section>
  );
};

export default Hero;
