import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Announcements from '@/components/Announcements';
import Sermons from '@/components/Sermons';
import Giving from '@/components/Giving';
import PrayerRequest from '@/components/PrayerRequest';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <Hero />
      <Announcements />
      <Sermons />
      <Giving />
      <PrayerRequest />
    </div>
  );
}