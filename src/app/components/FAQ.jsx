"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Mes clients laissent déjà des avis en ligne, ça ne suffit pas ?",
    answer: "Opinor réunit tous vos avis au même endroit et les analyse pour vous aider à comprendre ce que vos clients attendent vraiment.",
  },
  {
    question: "Est-ce que c’est compliqué à utiliser ?",
    answer: "Pas du tout ! Opinor est pensé pour vous simplifier la vie, pas la compliquer! Même sans expérience technique, vous saurez l’utiliser dès le premier jour.",
  },
  {
    question: "Opinor, c’est réservé aux grandes entreprises ?",
    answer: "Non. Opinor accompagne toutes les structures, grandes ou petites. L’important, c’est d’écouter vos clients, pas votre taille.",
  },
  {
    question: "Les données, c’est bien… mais comment les rendre vraiment utiles ?",
    answer: "Opinor transforme chaque avis et chaque chiffre en actions concrètes. Vous comprenez vos clients, améliorez vos services et prenez les bonnes décisions pour faire grandir votre marque.",
  }
];

const FAQ = () => {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className='flex flex-col justify-center items-center  md:pb-28 pb-12'>
        <h1 className="lg:text-[4vw] md:text-[5vw] text-[7vw] text-gradient font-semibold">FAQ</h1>
        <h1 className="">Une question ? On vous répond tout de suite</h1>
          {/*content*/}
          <div className="lg:w-[50%] w-[80%] mx-auto md:mt-10 mt-6">
      {faqs.map((faq, index) => (
        <div key={index} className="rounded-lg mb-2 cursor-pointer shadow-sm border border-gray-200">
          <button
            className="flex justify-between items-center w-full md:p-4.5 p-3 text-left cursor-pointer "
            onClick={() => toggleFAQ(index)}
          >
            <span className="lg:text-[1.2vw] font-semibold md:text-[2vw] text-[3vw]">{faq.question}</span>
            {openIndex === index ? (
          <ChevronDown 
            className="cursor-pointer bg-[#038788] text-white rounded-full p-1 w-6 h-6 md:w-8 md:h-8" 
          />
        ) : (
          <ChevronRight 
            className="cursor-pointer bg-[#F1F2F9] text-[#6F6C8F] rounded-full p-1 w-6 h-6 md:w-8 md:h-8" 
          />
        )}
        </button>
          {openIndex === index && (
            <div className="p-4 text-gray-500 rounded-b-lg lg:text-[1vw] md:text-[2vw] text-[2.8vw]">
              {faq.answer.split("\n").map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    </section>
  )
}

export default FAQ