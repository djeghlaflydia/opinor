import React from "react";
import { Fasthand } from "next/font/google";
import { Briefcase, Users, Target } from "lucide-react";

const fasthand = Fasthand({ subsets: ["latin"], weight: "400" });

const Advantages = () => {
  return (
    <section className="relative flex flex-col justify-start items-center overflow-hidden py-12 md:py-24">
      <div className="w-[90%] md:w-[80%] relative z-10">
        {/* Background image */}
        <img
          src="/bg.png"
          alt="Background"
          className="absolute top-[-20px] md:top-[-60px] right-0 w-[50%] md:w-[55%] h-auto select-none pointer-events-none object-contain"
        />

        {/* Quote */}
        <p className={`${fasthand.className} text-center text-2xl md:text-4xl lg:text-5xl md:p-12 py-8`}>
          « La perception du client est votre réalité »<br />Kate Zabriskie
        </p>

        {/* Flex container */}
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 md:p-0 p-6
                        bg-white/30 backdrop-blur-xs rounded-2xl">
          {/* Left side */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-2xl md:text-4xl font-semibold mb-2">Parce que chaque avis compte.</h1>
            <p className="text-[#64748B] mb-6 md:mt-5 text-sm md:text-base">
              Aujourd’hui, les avis clients se perdent entre les réseaux sociaux et le bouche-à-oreille.
              Opinor centralise ces retours dans un seul espace pour vous aider à :
            </p>
           <ul className="space-y-4 text-sm md:text-base">
  <li className="flex items-start gap-3">
    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white bg-[#C64C3A]">
      1
    </span>
    <p className="flex-1">
      Comprendre vos clients en temps réel.
    </p>
  </li>
  <li className="flex items-start gap-3">
    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white bg-[#C64C3A]">
      2
    </span>
    <p className="flex-1">
      Améliorer la qualité de vos services.
    </p>
  </li>
  <li className="flex items-start gap-3">
    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white bg-[#C64C3A]">
      3
    </span>
    <p className="flex-1">
      Détecter les insatisfactions avant qu’elles ne deviennent publiques.
    </p>
  </li>
  <li className="flex items-start gap-3">
    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white bg-[#C64C3A]">
      4
    </span>
    <p className="flex-1">
      Renforcer la fidélité et la réputation de votre marque.
    </p>
  </li>
</ul>
          </div>

          {/* Right side */}
<div className="w-full lg:w-1/2 flex flex-col items-center gap-4 relative mt-6 lg:mt-0">
  {/* Floating circles */}
<span className="absolute md:-top-8 -top-4 md:right-16 -right-4 w-18 h-18 md:w-22 md:h-22 bg-[#C64C3A] rounded-full"></span>
<span className="absolute md:left-16 -left-2 -bottom-4 w-14 h-14 md:w-18 md:h-18 bg-[#038788] rounded-full"></span> 

  {/* Boxes */}
  <div className="flex flex-col gap-4 w-full">
    <div className="bg-[#fafafa]/80 backdrop-blur-xs shadow-xs p-4 rounded-xl flex justify-between items-center w-full max-w-sm mx-auto">
      <div className="flex flex-col">
        <p className="text-sm md:text-base">Outil pour centraliser la voix de vos clients</p>
        <p className="text-xl font-semibold">1 (Opinor)</p>
      </div>
      <Briefcase className="w-8 h-8 rounded-full p-1 bg-[#F9F9F9] text-[#038788]" />
    </div>

    <div className="bg-[#fafafa]/80 backdrop-blur-xs shadow-xs p-4 rounded-xl flex justify-between items-center w-full max-w-sm mx-auto">
      <div className="flex flex-col">
        <p className="text-sm md:text-base">Utilisateurs Internet en Algérie</p>
        <p className="text-xl font-semibold">26M</p>
      </div>
      <Users className="w-8 h-8 rounded-full p-1 bg-[#F9F9F9] text-[#C64C3A]" />
    </div>

    <div className="bg-[#fafafa]/80 backdrop-blur-xs shadow-xs p-4 rounded-xl flex justify-between items-center w-full max-w-sm mx-auto">
      <div className="flex flex-col">
        <p className="text-sm md:text-base">Utilisateurs des réseaux sociaux</p>
        <p className="text-xl font-semibold">25M</p>
      </div>
      <Target className="w-8 h-8 rounded-full p-1 bg-[#F9F9F9] text-[#42D599]" />
    </div>
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default Advantages;
