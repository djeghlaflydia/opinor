"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="mx-auto flex justify-between items-center px-16 py-6">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/Layer.svg" alt="Logo" className="h-12 w-auto select-none" />
        </div>

        {/* Menu (Desktop) */}
        <nav className="hidden cursor-pointer md:flex items-center space-x-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-[#038788] transition text-[18px]">Fonctionnalités</a>
          <a href="#process" className="hover:text-[#038788] transition text-[18px]">À propos</a>
          <a href="#faq" className="hover:text-[#038788] transition text-[18px]">FAQ</a>
           <div className="w-[2px] h-6 bg-gray-300"></div>
          <button className="bg-[#038788] text-white cursor-pointer px-5 py-2 rounded-full text-[18px] hover:bg-[#038788]/80 transition">
            Télécharger l’appli
          </button>
        </nav>

        {/* Bouton burger (Mobile) */}
        <button
          className="md:hidden text-gray-700 hover:text-[#038788] transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4 text-gray-700 font-medium">
            <a href="#features" className="hover:text-[#038788]" onClick={() => setIsOpen(false)}>Fonctionnalités</a>
            <a href="#about" className="hover:text-[#038788]" onClick={() => setIsOpen(false)}>À propos</a>
            <a href="#faq" className="hover:text-[#038788]" onClick={() => setIsOpen(false)}>FAQ</a>
            <button className="bg-[#038788] text-white px-5 py-2 rounded-full hover:bg-[#038788]/80 transition">
              Télécharger l’appli
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
