import React from "react";
import { Fasthand } from "next/font/google";
import { Briefcase, Users, Target } from "lucide-react";

const fasthand = Fasthand({ subsets: ["latin"], weight: "400" });

const Advantages = () => {
  return (
    <section className="relative flex flex-col justify-start items-center h-screen overflow-hidden">
      <div className="w-[80%] relative z-10">
        <img
          src="/bg.png"
          alt="Background"
          className="absolute top-[-60px] right-0 w-[55%] h-auto select-none pointer-events-none object-contain"
        />

        <p className={`${fasthand.className} text-4xl text-center p-32`}>
          « La perception du client est votre réalité »<br />Kate Zabriskie
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 
                bg-white/30 backdrop-blur-xs rounded-2xl shadow-sx">
          {/* côté 1 */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-semibold mb-2">Parce que chaque avis compte.</h1>
            <p className="text-[#64748B] mb-6 mt-5">
              Aujourd’hui, les avis clients se perdent entre les réseaux sociaux et le bouche-à-oreille.
              Opinor centralise ces retours dans un seul espace pour vous aider à :
            </p>
            <p className="mb-6"><span className="pl-3.5 mr-3 pr-3.5 p-2 rounded-full text-white bg-[#C64C3A]">1</span>Comprendre vos clients en temps réel.</p>
            <p className="mb-6"><span className="pl-3.5 mr-3 pr-3.5 p-2 rounded-full text-white bg-[#C64C3A]">2</span>Améliorer la qualité de vos services.</p>
            <p className="mb-6"><span className="pl-3.5 mr-3 pr-3.5 p-2 rounded-full text-white bg-[#C64C3A]">3</span>Détecter les insatisfactions avant qu’elles ne deviennent publiques.</p>
            <p><span className="pl-3.5 mr-3 pr-3.5 p-2 rounded-full text-white bg-[#C64C3A]">4</span>Renforcer la fidélité et la réputation de votre marque.</p>
          </div>

          {/* côté 2 */}
          <div className="lg:w-1/2 p-6 flex flex-col items-center gap-4">
           <span className="absolute top-0 right-20 w-22 h-22 bg-[#C64C3A] rounded-full"></span>
            {/* box1 */}
            <div className="bg-[#fafafa]/80 backdrop-blur-xs shadow-xs p-4 z-10 rounded-xl flex justify-between items-center w-full max-w-sm">
            <div className="flex flex-col">
                <p className="text-sm">Outil pour centraliser la voix de vos clients</p>
                <p className="text-xl font-semibold">1 (Opinor)</p>
            </div>
            <Briefcase className="w-8 h-8 rounded-full p-1 bg-[#F9F9F9] text-[#038788]" />
            </div>

            {/* box2 */}
            <div className="bg-[#fafafa]/80 backdrop-blur-xs shadow-xs p-4 rounded-xl flex justify-between items-center w-full max-w-sm">
            <div className="flex flex-col">
                <p className="text-sm">Utilisateurs Internet en Algérie</p>
                <p className="text-xl font-semibold">26M</p>
            </div>
            <Users className="w-8 h-8 rounded-full p-1 bg-[#F9F9F9] text-[#C64C3A]" />
            </div>

            {/* box3 */}
            <div className="bg-[#fafafa]/80 backdrop-blur-xs shadow-xs p-4 rounded-xl flex justify-between items-center w-full max-w-sm z-50">
            <div className="flex flex-col">
                <p className="text-sm">Utilisateurs des réseaux sociaux</p>
                <p className="text-xl font-semibold">25M</p>
            </div>
            <Target className="w-8 h-8 rounded-full p-1 bg-[#F9F9F9] text-[#42D599]" />
            </div>
             <span className="absolute right-[440px] bottom-1.5 w-18 h-18 bg-[#038788] rounded-full"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
