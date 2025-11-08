import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full bg-white z-50">
      <div className="mx-auto flex flex-col lg:flex-row justify-between items-center">
        {/* Texte */}
        <div className="ml-18 w-full lg:w-1/2">
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight">
            Écoutez vos clients.<br />Faites grandir votre
          </h1>
          <img
            src="/signature.png"
            alt="Signature"
            className="h-20 w-auto mt-4 mb-4 select-none"
          />
          <p className="text-lg text-gray-700">
           Opinor est une application B2B algérienne qui aide les entreprises à collecter, analyser et gérer les avis de leurs clients simplement, rapidement et avec fiabilité.
            Fondée sur l’écoute active, la transparence, l’innovation locale et la volonté de progresser, Opinor valorise la confiance et la proximité dans chaque interaction
            </p>
          <button className="bg-[#038788] text-white cursor-pointer px-6 py-3 mt-6 rounded-3xl hover:bg-[#038788]/80 transition">
            Demander une démo
          </button>
        </div>

        {/* Image */}
        <div className="w-full flex justify-center lg:justify-end lg:w-1/2">
          <img
            src="/hero.png"
            alt="Hero"
            className="h-auto w-full select-none"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
