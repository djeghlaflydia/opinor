'use client';
import React, { useEffect, useRef } from "react";
import { Fasthand } from "next/font/google";

const fasthand = Fasthand({ subsets: ["latin"], weight: "400" });

const Problems = () => {
  const problemRefs = useRef([]);

  useEffect(() => {
    const initScrollTrigger = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      problemRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const line = ref.querySelector('.problem-line');
        const answer = ref.querySelector('.problem-answer');

        // Créer une timeline pour synchroniser les animations
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref,
            start: "top 70%",
            end: "bottom 20%",
            scrub: 1,
          }
        });

        // Animation de la ligne
        tl.to(line, {
          height: "100%",
          backgroundColor: "#166534",
          duration: 0.6
        })
        // Animation de la réponse (commence en même temps que la ligne)
        .to(answer, {
          opacity: 1,
          y: 0,
          duration: 0.4
        }, "-=0.3"); // Commence 0.3s avant la fin de l'animation de la ligne
      });
    };

    initScrollTrigger();
  }, []);

  const addToRefs = (el) => {
    if (el && !problemRefs.current.includes(el)) {
      problemRefs.current.push(el);
    }
  };

  const problems = [
    {
      question: "On ne sait pas toujours pourquoi les ventes baissent ?",
      answer: "Chaque baisse de ventes a une raison. Opinor analyse vos avis clients et vos performances pour révéler ce qui bloque et vous montrer comment agir efficacement"
    },
    {
      question: "Les avis en ligne influencent notre image, mais on ne les maîtrise pas",
      answer: "Opinor suit votre réputation en temps réel, et vous aide à garder le contrôle sur votre image : surveillez ce que vos clients disent, comprenez leurs retours et réagissez avant que les avis négatifs n'impactent votre réputation"
    },
    {
      question: "Nos clients insatisfaits ne laissent pas toujours d'avis…",
      answer: "C'est normal : certains clients restent silencieux par timidité ou gêne. Opinor leur offre un espace anonyme pour s'exprimer librement, afin que vous puissiez détecter et corriger les difficultés à temps"
    }
  ];

  return (
    <section className="p-12 px-20 relative w-full bg-white z-50">
      <h1 className="text-5xl font-semibold text-center leading-tight mb-2">
        Les vrais problèmes, les vraies réponses
      </h1>
      <p className="text-lg text-gray-700 text-center">
        Découvrez comment Opinor identifie les difficultés majeures et y répond simplement.
      </p>

      <div className="mx-auto mt-8 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full flex justify-center lg:justify-end lg:w-1/2">
          <img 
            src="/prob.png" 
            alt="Problems Illustration" 
            className="h-auto w-full select-none" 
          />
        </div>

        <div className="ml-18 w-full lg:w-1/2">
          {problems.map((problem, index) => (
            <div 
              key={index}
              ref={addToRefs}
              className="problem-item relative pl-12 py-6 border-b border-gray-50 min-h-[120px]"
            >
              <div className="problem-line absolute left-0 top-0 w-1 h-4 bg-[#038788] rounded-full"></div>
              
              <div className="problem-content">
                <p className="text-xl font-semibold text-gray-900 mb-3">
                  {problem.question}
                </p>
                {/* Réponse positionnée légèrement en bas et invisible */}
                <p className="problem-answer text-gray-700 leading-relaxed opacity-0 translate-y-4">
                  {problem.answer}
                </p>
              </div>
            </div>
          ))}

          <p className={`${fasthand.className} text-3xl text-center`}>
            « La voix du client est l'outil marketing le plus puissant que vous possédez, alors assurez-vous de l'écouter » Melinda Gates
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problems;