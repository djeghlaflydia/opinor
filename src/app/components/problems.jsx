import React from "react";
import { Fasthand } from "next/font/google";

const fasthand = Fasthand({
  subsets: ["latin"],
  weight: "400",
});

const Problems = () => {
  return (
    <section className=" p-12 px-20 relative w-full bg-white z-50">
        <h1 className="text-5xl font-semibold text-center leading-tight mb-2">
            Les vrais problèmes, les vraies réponses
          </h1>
          <p className="text-lg text-gray-700 text-center">
          Découvrez comment Opinor identifie les difficultés majeures et y répond simplement.
           </p>
      <div className="mx-auto mt-8 flex flex-col lg:flex-row justify-between items-center">

        {/* Image */}
        <div className="w-full flex justify-center lg:justify-end lg:w-1/2">
          <img
            src="/prob.png"
            alt="Problems Illustration"
            className="h-auto w-full select-none"
          />
        </div>

        {/* Texte */}
        <div className="ml-18 w-full lg:w-1/2">
            <div>
                <p>On ne sait pas toujours pourquoi les ventes baissent ?</p>
                <p>Chaque baisse de ventes a une raison. Opinor analyse vos avis clients et vos performances pour révéler ce qui bloque et vous montrer comment agir efficacement</p>
            </div>

            <div>
                <p> Les avis en ligne influencent notre image, mais on ne les maîtrise pas</p>
                <p>Opinor suit votre réputation en temps réel, et vous aide à garder le contrôle sur votre image : surveillez ce que vos clients disent, comprenez leurs retours et réagissez avant que les avis négatifs n’impactent votre réputation</p>
            </div>

            <div>
                <p> Nos clients insatisfaits ne laissent pas toujours d’avis….</p>
                <p>C’est normal : certains clients restent silencieux par timidité ou gêne. Opinor leur offre un espace anonyme pour s’exprimer librement, afin que vous puissiez détecter et corriger les difficultés à temps</p>
            </div>

             <p
              className={fasthand.className}
              style={{
                fontSize: "32px",
                textAlign: "center",
                margin: "40px 0",
              }}
            >
           « La voix du client est l’outil marketing le plus puissant que vous possédez, alors assurez-vous de l’écouter » Melinda Gates</p>
        </div>
      </div>
    </section>
  );
};

export default Problems;
