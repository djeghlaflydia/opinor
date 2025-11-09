import React from 'react'

const TargetAudience = () => {
  const firstRow = [
    { 
      img: "/image1.svg", 
      text: "Restaurants & Cafés", 
      color: "from-[#86B3AD]/40 via-[#86B3AD]/40 via-0% to-white to-80%" 
    },
    { 
      img: "/image2.svg", 
      text: "salons & Spas", 
      color: "from-[#FF9D87]/40 via-[#FF9D87]/40 via-0% to-white to-80%" 
    },
    { 
      img: "/image3.svg", 
      text: "Magasins & Boutiques", 
      color: "from-[#345C5D]/30 via-[#345C5D]/30 via-0% to-white to-80%" 
    },
    { 
      img: "/image4.svg", 
      text: "Cliniques & Centres de soins", 
      color: "from-[#3CFFE8]/40 via-[#3CFFE8]/40 via-0% to-white to-80%" 
    },
  ];

  const secondRow = [
    { 
      img: "/image5.svg", 
      text: "Agences & Startups locales", 
      color: "from-[#8ACECC]/40 via-[#8ACECC]/40 via-0% to-white to-80%" 
    },
    { 
      img: "/image6.svg", 
      text: "Hôtels & Espaces d'accueil", 
      color: "from-[#FDA17E]/40 via-[#FDA17E]/40 via-0% to-white to-80%" 
    },
    { 
      img: "/image7.svg", 
      text: "Formations & Centres éducatifs", 
      color: "from-[#AACE8A]/40 via-[#AACE8A]/40 via-0% to-white to-80%" 
    },
  ];

  return (
    <div className='mb-22 px-8'>
      {/* Titre */}
      <div className='flex justify-center items-center flex-col'>
        <h1 className='text-center text-6xl max-w-6xl font-semibold p-4'>
          Pensé pour les entreprises qui veulent écouter sans filtre
        </h1>
        <h2 className='text-center text-xl max-w-4xl text-[#1C2124] p-4'>
          Opinor s'adresse à tous les commerces qui cherchent à comprendre leurs clients en toute simplicité, grâce à des retours anonymes et exploitables en temps réel.
        </h2>
      </div>

      {/* Grille des blocs */}
      <div className="mt-8 flex flex-col gap-4 items-center">
        {/* Première ligne */}
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl">
          {firstRow.map((item, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-r ${item.color} rounded-xl shadow-xs px-4 py-3 flex items-center justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg w-auto flex-shrink-0`}
            >
              <img 
                src={item.img} 
                alt={item.text} 
                className="w-10 h-10 mr-3 object-contain flex-shrink-0" 
              />
              <p className="font-semibold whitespace-nowrap text-sm md:text-base">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Deuxième ligne */}
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
          {secondRow.map((item, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-r ${item.color} rounded-xl shadow-xs px-4 py-3 flex items-center justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg w-auto flex-shrink-0`}
            >
              <img 
                src={item.img} 
                alt={item.text} 
                className="w-10 h-10 mr-3 object-contain flex-shrink-0" 
              />
              <p className="font-semibold whitespace-nowrap text-sm md:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TargetAudience