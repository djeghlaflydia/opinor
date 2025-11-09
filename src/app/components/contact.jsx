import React from "react";
import { Phone, Mail, Instagram, Linkedin } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-[#FFFFFF] to-[#038788]/60 flex flex-col lg:flex-row items-center justify-center px-10 lg:px-32 py-20 gap-16">
      <div className="w-full lg:w-[80%] bg-white p-6 rounded-xl shadow-md relative">
        <h1 className="text-4xl font-semibold text-[#012222]">
          Restons en contact !
        </h1>

        <p className="text-[#012222] mt-2 leading-relaxed">
          Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.
        </p>

        <div className="flex mt-8 gap-10 relative">
          {/* Coordonnées */}
          <div className="flex flex-col justify-between text-[#012222] text-lg w-full lg:w-1/2 relative">
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-[#038788]" />
                <span>+213 774 338 408</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-[#038788]" />
                <span>hello.opinor@workmail.com</span>
              </div>
            </div>

            {/* Réseaux sociaux - tout en bas */}
            <div className="flex-col items-center gap-5 mt-10 lg:mt-auto">
              <h1 className="font-semibold mb-4 text-2xl text-[#012222]">
                connectez-vous avec nous

              </h1>
              <div className="flex gap-2">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-[#038788] transition"
                >
                  <Instagram className="w-10 h-9 p-1.5 rounded-full bg-[#E5F4F2]" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black w-10 h-9 flex justify-center items-center bg-[#E5F4F2] rounded-full  hover:text-[#026C6C] transition"
                >
                  <p className="font-bold text-2xl" >in</p>
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="w-full lg:w-1/2">
            <form className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Votre nom"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
              />
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
              />
              <textarea
                placeholder="Comment puis-je t'aider?"
                rows="3"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#038788]"
              ></textarea>

              <div className="flex justify-center lg:justify-start">
                <button
                  type="submit"
                  className="bg-[#038788] text-white px-8 py-3 rounded-3xl hover:bg-[#026C6C] transition"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
