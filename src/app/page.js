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
  return (
    <div>
      <Header />
      <Hero />
      <Features/>
      <Process/>
      <Problems/>
      <TargetAudience/>
      <Advantages/>
      <FAQ/>
      <Start/>
      <Contact/>  
    </div>
  );
}
