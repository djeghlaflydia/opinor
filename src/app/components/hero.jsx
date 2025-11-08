import React from 'react'

const hero = () => {
  return (
    <div className="w-[100%] mx-auto flex justify-between items-center">
      <div className='w-[50%] ml-18'>
        <h1 className='text-6xl font-semibold'>Écoutez vos clients.<br/> Faites grandir votre</h1>
        <img src="/signature.png" alt="Logo" className="h-22 w-auto mt-4 mb-4 select-none" />
        <p className='text-lg'>Opinor est une application B2B algérienne qui aide les entreprises à collecter, analyser et gérer les avis de leurs clients simplement, rapidement et avec fiabilité.
Fondée sur l’écoute active, la transparence, l’innovation locale et la volonté de progresser, Opinor valorise la confiance et la proximité dans chaque interaction</p>
        <button className='bg-[#038788] text-white px-6 py-3 mt-4 rounded-3xl hover:bg-[#038788]/80 transition'>Demander une démo</button>
      </div>
      <div className="w-[50%] flex items-center">
          <img src="/hero.png" alt="Logo" className="h-auto w-auto select-none" />
        </div>
    </div>
  )
}

export default hero