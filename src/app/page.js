"use client";
import { useEffect } from 'react';
import Header from './components/header';
import Hero from './components/hero';
import Features from './components/features';
import Process from './components/process';
import Problems from './components/problems';
import TargetAudience from './components/targetAudience';
import Advantages from './components/advantages';
import FAQ from './components/FAQ';
import Start from './components/start';
import Contact from './components/contact';

export default function Home() {
  // Gérer le défilement vers l'ancre au chargement
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      // Attendre que le DOM soit chargé
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div>
      <Header />
      <section id="hero"><Hero /></section>
      <section id="features"><Features /></section>
      <section id="process" className="hidden md:block">
        <Process />
      </section>
      <section id="problems"><Problems /></section>
      <section id="target"><TargetAudience /></section>
      <section id="advantages"><Advantages /></section>
      <section id="faq"><FAQ /></section>
      <section id="start"><Start /></section>
      <section id="contact"><Contact /></section>
    </div>
  );
}