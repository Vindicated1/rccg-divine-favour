import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import QuickInfo from '@/components/QuickInfo';
import Welcome from '@/components/Welcome';
import Announcements from '@/components/Announcements';
import Sermons from '@/components/Sermons';
import NextSteps from '@/components/NextSteps';
import StayConnected from '@/components/StayConnected';
import ManualsAndNotes from '@/components/ManualsAndNotes';
import Giving from '@/components/Giving';
import PrayerRequest from '@/components/PrayerRequest';
import Testimonies from '@/components/Testimonies';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <Hero />
      <QuickInfo />
      <Welcome />
      <Sermons />
      <NextSteps />
      <Announcements />
      <Testimonies />
      <StayConnected />
      <ManualsAndNotes />
      <Giving />
      <PrayerRequest />
      <Footer />
    </div>
  );
}