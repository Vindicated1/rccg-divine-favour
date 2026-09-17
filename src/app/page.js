import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Announcements from '@/components/Announcements';
import Sermons from '@/components/Sermons';
import Giving from '@/components/Giving';
import PrayerRequest from '@/components/PrayerRequest';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />
        <Announcements />
        <Sermons />
        <Giving />
        <PrayerRequest />
      </div>
      <Footer />
    </div>
  );
}