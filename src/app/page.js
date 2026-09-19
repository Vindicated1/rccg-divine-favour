import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Announcements from '@/components/Announcements';
import Sermons from '@/components/Sermons';
import ManualsAndNotes from '@/components/ManualsAndNotes'; // <--- ADD THIS
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
        <ManualsAndNotes /> {/* <--- ADD THIS */}
        <Giving />
        <PrayerRequest />
      </div>
      <Footer />
    </div>
  );
}