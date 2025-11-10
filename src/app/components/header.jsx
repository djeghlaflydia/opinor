"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full relative">
      <div className="mx-auto flex justify-between items-center md:px-16 px-8 py-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/Layer.svg" alt="Logo" className="md:h-12 h-9 w-auto select-none" />
        </div>

        {/* Menu (Desktop) */}
        <nav className="hidden cursor-pointer lg:flex items-center space-x-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-[#038788] transition text-[18px]">Fonctionnalités</a>
          <a href="#target" className="hover:text-[#038788] transition text-[18px]">À propos</a>
          <a href="#faq" className="hover:text-[#038788] transition text-[18px]">FAQ</a>
          <div className="w-[2px] h-6 bg-gray-300"></div>
          <button className="bg-[#038788] text-white cursor-pointer px-5 py-2 rounded-full text-[18px] hover:bg-[#038788]/80 transition">
            Télécharger l'appli
          </button>
        </nav>

        {/* Bouton burger (Mobile) */}
        <button 
          className="lg:hidden text-gray-700 cursor-pointer hover:text-[#038788] transition z-[100]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile - Overlay avec z-index élevé */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999]">
          {/* Overlay semi-transparent */}
          <div
            className="absolute inset-0 bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg">
            
            {/* Bouton de fermeture */}
            <div className="flex justify-end items-end p-4">
              <button
                className="text-gray-700 cursor-pointer hover:text-[#038788] transition z-[100]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Navigation avec séparateurs espacés */}
            <nav className="flex -mt-6 flex-col text-gray-700 font-medium">
              <a
                href="#features"
                className="hover:text-[#038788] py-4 px-8 text-lg border-b border-gray-200 mx-8"
                onClick={() => setIsOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                href="#about"
                className="hover:text-[#038788] py-4 px-8 text-lg border-b border-gray-200 mx-8"
                onClick={() => setIsOpen(false)}
              >
                À propos
              </a>
              <a
                href="#faq"
                className="hover:text-[#038788] py-4 px-16 text-lg "
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>

              <div className="px-12 py-4">
                <button className="bg-[#038788] text-white px-5 py-2 rounded-full hover:bg-[#038788]/80 transition">
              Télécharger l’appli
            </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;