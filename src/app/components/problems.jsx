import React from "react";

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
            <p>Les avis sont éparpillés sur plusieurs plateformes, difficiles à suivre.</p>
            <p>Opinor centralise tous les retours sur une seule interface claire, que vous soyez gérant d’un café, d’un salon ou d’un magasin.</p>
            </div>

            <div>
                <p>Difficile de savoir si la satisfaction client évolue vraiment.</p>
                <p>Difficile de savoir si la satisfaction client évolue vraiment.</p>
            </div>

            <div>
                <p>Les clients mécontents ne partagent pas toujours leur avis… jusqu’à ce qu’il soit trop tard.</p>
                <p>Les clients mécontents ne partagent pas toujours leur avis… jusqu’à ce qu’il soit trop tard.</p>
            </div>

            <p>« La voix du client est l’outil marketing le plus puissant que vous possédez, alors assurez-vous de l’écouter » Melinda Gates</p>
        </div>
      </div>
    </section>
  );
};

export default Problems;
