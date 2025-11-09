import Header from './components/header';
import Hero from './components/hero';
import Features from './components/features';
import Process from './components/process';
import Problems from './components/problems';
import TargetAudience from './components/targetAudience';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features/>
      <Process/>
      <Problems/>
      <TargetAudience/>
    </div>
  );
}
