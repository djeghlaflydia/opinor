import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full bg-white z-50">
      <div className="mx-auto flex flex-col lg:flex-row justify-between items-center">
        {/* Texte */}
        <div className="lg:ml-18 lg:p-0 p-6 w-full lg:w-1/2">
          <h1 className="lg:text-[4vw] lg:text-left text-center text-[7vw] md:text-[5vw] font-semibold leading-tight">
            Écoutez vos clients.<br />Faites grandir votre
          </h1>
          <div className="flex justify-center lg:justify-start">
          <img
            src="/signature.png"
            alt="Signature"
            className="lg:h-[5.5vw] h-[10vw] md:h-[8vw] w-auto lg:mt-4 lg:mb-4 select-none"
          />
          </div>
          <p className="lg:text-[1.2vw] text-[3vw] md:text-[2vw] lg:p-0 p-4  text-gray-700">
           Opinor est une application B2B algérienne qui aide les entreprises à collecter, analyser et gérer les avis de leurs clients simplement, rapidement et avec fiabilité.
            Fondée sur l’écoute active, la transparence, l’innovation locale et la volonté de progresser, Opinor valorise la confiance et la proximité dans chaque interaction
            </p>
          <button className="bg-[#038788] lg:text-[1vw] text-[2.8vw] md:text-[1.8vw] text-white cursor-pointer md:px-6 px-3 md:py-3 py-2 lg:mt-6 rounded-3xl hover:bg-[#038788]/80 transition">
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
