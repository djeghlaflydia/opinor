import React from 'react'

const Start = () => {
  return (
    <div className="bg-gradient-to-b from-[#038788] to-[#012222] flex flex-col lg:flex-row items-center justify-center lg:py-0 py-6 lg:px-[12vw] lg:gap-16">
      
      {/* Texte à gauche */}
      <div className="text-center lg:text-left md:px-[1.3vw] px-4 text-white lg:w-1/2 w-full flex flex-col justify-between h-full">
        <div>
          <h1 className="lg:text-[3vw] md:text-[4vw] text-3xl font-semibold mb-6">
            Commencez à écouter vos clients dès aujourd'hui
          </h1>
          <p className="lg:text-[1.2vw] md:text-[2vw] text-md text-[#FDFEFD] mt-6 leading-relaxed">
            Téléchargez Opinor et découvrez ce que vos clients pensent vraiment. 
            Créez votre premier QR code en quelques clics et transformez chaque avis 
            en opportunité d'amélioration.
          </p>
        </div>

        <div className="md:mt-12 mt-8">
          <p className="lg:text-[1.2vw] md:text-[1.8vw] mb-4 font-semibold">Get The App</p>
          <div className="flex md:gap-2 gap-2 justify-center lg:justify-start flex-wrap">

            {/* Google Play Button */}
            <button className="flex items-center md:gap-4 gap-2 bg-black border border-[#A6A6A6] md:rounded-xl rounded-lg md:px-6 md:py-2 px-4 py-2 text-left text-white">
              <img
                src="/GooglePlaylogo.svg"
                alt="Google Play"
                className="lg:w-[1.6vw] md:w-[2vw] w-[4vw] h-auto"
              />
              <div className="flex flex-col leading-tight lg:text-[0.8vw] md:text-[1vw] text-[1.6vw]">
                <span>Get it on</span>
                <span className="lg:text-[1.2vw] md:text-[1.4vw] text-[2.2vw] font-semibold">Google Play</span>
              </div>
            </button>

            {/* App Store Button */}
            <button className="flex items-center gap-4 bg-black border border-[#A6A6A6] rounded-lg md:rounded-xl md:px-6 md:py-2 px-4 py-2 text-left text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="md:w-[1.6vw] md:h-[2vw] w-[3vw] h-[4vw] fill-white"
              >
                <path d="M318.7 268.6c-.4-37.3 16.4-65.5 50-86.1-18.8-27.5-47.3-42.6-84.9-45.3-35.7-2.6-74.4 20.7-88.4 20.7-14.4 0-47.5-19.7-73.8-19.2C68.6 140.1 22 183 22 254.3c0 27.2 5 55.1 15 83.4 13.4 37.3 61.6 128.1 112.4 126.6 26.3-.7 45-18.7 79.3-18.7 33.8 0 51.3 18.7 79.8 18.2 51.8-.8 95.7-80.2 108.8-117.7-68.5-32.5-77.6-95-78.6-97.5zM255.6 93.8c27.3-32.4 24.8-61.8 24-72.3-24.1 1.4-52 16.2-68.4 35.6-17.5 20.7-27.7 46.2-25.6 72.1 26.2 2 47.7-11.2 70-35.4z" />
              </svg>
              <div className="flex flex-col leading-tight lg:text-[0.8vw] md:text-[1vw] text-[1.6vw]">
                <span>Download on the</span>
                <span className="lg:text-[1.2vw] md:text-[1.4vw] text-[2.2vw] font-semibold">App Store</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Image à droite */}
      <div className="w-1/2 lg:flex justify-center items-center hidden">
        <img
          src="/start.png"
          alt="phones"
          className="h-auto w-auto select-none"
        />
      </div>

      {/* Image à droite pour mobile */}
    <div className="flex w-full mt-12 justify-end lg:hidden">
      <img
        src="/Phone Mockup 1.png"
        alt="phones"
        className="h-auto w-auto select-none"
      />
    </div>
    <div className="flex w-full -mt-12 justify-start lg:hidden">
      <img
        src="/Phone Mockup 2.png"
        alt="phones"
        className="h-[320px] w-auto select-none"
      />
    </div>

    </div>
  )
}

export default Start
