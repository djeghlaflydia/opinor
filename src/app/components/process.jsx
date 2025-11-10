import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full lg:h-[120vh] md:h-[60vh] flex  overflow-hidden p-12">
      {/* Image de fond */}
      <img
        src="/process.png"
        alt="process"
        className="absolute inset-0 object-cover select-none p-12"
      />

      {/* Overlay léger pour la lisibilité du texte */}
      <div className="absolute inset-0"></div>

      {/* Contenu texte centré sur l’image */}
      <div className="relative z-10  max-w-3xl px-6">
        <p className="text-[#C64C3A] lg:text-md text-xs font-bold uppercase tracking-wider">
          Comment ça marche ?
        </p>
        <h1 className="lg:text-5xl text-xl font-bold leading-tight mt-2">
          Simple. Rapide. Efficace.
        </h1>
        <p className="lg:text-lg text-sm lg:mt-4 mt-2 lg:mb-6 mb-4 text-[#64607D]">
          Collectez, analysez et améliorez l’expérience client <br /> en toute
          simplicité.
        </p>
        <button className="bg-[#C64C3A] lg:text-lg text-sm cursor-pointer text-white px-4 py-2 lg:px-8 lg:py-3 rounded-full hover:bg-[#a23c2f] transition">
          Commencer
        </button>
      </div>
    </section>
  );
};

export default Hero;
