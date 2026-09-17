import './globals.css';
import Footer from '@/components/Footer'; // adjust path if needed

export const metadata = {
  title: 'RCCG Divine Favour Parish - Ajibode Ibadan',
  description: 'Welcome to RCCG Divine Favour Parish, Ajibode Ibadan. Join us for worship, sermons, and spiritual growth.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}