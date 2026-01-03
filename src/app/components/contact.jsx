import React from "react";
import { Phone, Mail, Instagram, User, MessageSquare } from "lucide-react";

const Contact = () => {
  const phoneNumber = "+213774338408";
  const emailAddress = "hello.opinor@workmail.com";

  return (
    <div className="bg-gradient-to-b from-white to-[#038788]/60 flex flex-col items-center justify-center px-4 md:px-12 lg:px-32 py-12 lg:py-20 gap-12">
      <div className="w-full lg:w-[90%] bg-white py-8 md:py-10 px-4 md:px-12 rounded-xl shadow-md relative">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#012222]">
          Restons en contact !
        </h1>
        <p className="text-[#012222] mt-2 text-sm md:text-base leading-relaxed">
          Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.
        </p>

        <div className="flex flex-col lg:flex-row mt-8 gap-8">
          {/* Coordonnées */}
          <div className="lg:flex flex-col hidden justify-between text-[#012222] text-sm md:text-base w-full lg:w-1/2 gap-8">
            <div className="flex flex-col gap-6 mt-4">
              {/* Numéro de téléphone cliquable */}
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-3 hover:text-[#038788] transition-colors"
              >
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#038788]" />
                <span>+213 774 338 408</span>
              </a>

              {/* Email cliquable */}
              <a 
                href={`mailto:${emailAddress}`}
                className="flex items-center gap-3 hover:text-[#038788] transition-colors"
              >
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#038788]" />
                <span>{emailAddress}</span>
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex flex-col items-center lg:items-start gap-4 mt-6 lg:mt-auto">
              <h1 className="font-semibold mb-2 text-xl md:text-2xl text-[#012222]">
                Connectez-vous avec nous
              </h1>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/opinor.app?igsh=ZTRpY244cDVrdzRu&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-[#038788] transition"
                >
                  <Instagram className="w-8 h-8 md:w-10 md:h-10 p-1.5 rounded-full bg-[#E5F4F2]" />
                </a>
                <a
                  href="https://www.linkedin.com/in/opinor-app-96b479357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center bg-[#E5F4F2] rounded-full hover:text-[#026C6C] transition"
                >
                  <p className="font-bold text-[0.8rem] md:text-xl">in</p>
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="w-full lg:w-1/2">
            <form className="flex flex-col gap-4">
              {/* Nom */}
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#038788]">
                <div className="flex items-center px-3 text-[#038788]">
                  <User className="w-5 h-5" />
                  <div className="w-[1px] h-6 bg-gray-300 mx-3"></div>
                </div>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="flex-1 px-2 py-3 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* Email */}
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#038788]">
                <div className="flex items-center px-3 text-[#038788]">
                  <Mail className="w-5 h-5" />
                  <div className="w-[1px] h-6 bg-gray-300 mx-3"></div>
                </div>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-2 py-3 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* Message */}
              <div className="flex items-start border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#038788]">
                <div className="flex items-center px-3 pt-3 text-[#038788]">
                  <MessageSquare className="w-5 h-5" />
                  <div className="w-[1px] h-6 bg-gray-300 mx-3"></div>
                </div>
                <textarea
                  placeholder="Comment puis-je t'aider ?"
                  rows="3"
                  className="flex-1 px-2 py-2 md:py-3 focus:outline-none resize-none text-sm md:text-base"
                ></textarea>
              </div>

              <div className="flex justify-center lg:justify-start mt-2">
                <button
                  type="submit"
                  className="bg-[#038788] text-white px-6 md:px-8 py-2 md:py-3 rounded-3xl hover:bg-[#026C6C] transition text-sm md:text-base"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>

          {/* Version mobile */}
          <div className="flex lg:hidden flex-col justify-between text-[#012222] text-sm md:text-base w-full lg:w-1/2 gap-8">
            <div className="flex flex-col gap-4 mt-4">
              {/* Numéro de téléphone cliquable - version mobile */}
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center text-center gap-3 hover:text-[#038788] transition-colors"
              >
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#038788]" />
                <span>+213 774 338 408</span>
              </a>

              {/* Email cliquable - version mobile */}
              <a 
                href={`mailto:${emailAddress}`}
                className="flex items-center justify-center text-center gap-3 hover:text-[#038788] transition-colors"
              >
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#038788]" />
                <span>{emailAddress}</span>
              </a>
            </div>

            {/* Réseaux sociaux - version mobile */}
            <div className="flex flex-col items-center lg:items-start gap-4 lg:mt-auto">
              <h1 className="font-semibold mb-2 text-xl md:text-2xl text-[#012222]">
                Connectez-vous avec nous
              </h1>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/opinor.app?igsh=ZTRpY244cDVrdzRu&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-[#038788] transition"
                >
                  <Instagram className="w-8 h-8 md:w-10 md:h-10 p-1.5 rounded-full bg-[#E5F4F2]" />
                </a>
                <a
                  href="https://www.linkedin.com/in/opinor-app-96b479357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center bg-[#E5F4F2] rounded-full hover:text-[#026C6C] transition"
                >
                  <p className="font-bold text-[0.8rem] md:text-xl">in</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;