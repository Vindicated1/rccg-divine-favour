import './globals.css';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'RCCG Divine Favour Parish - Ajibode Ibadan',
  description: 'Welcome to RCCG Divine Favour Parish, Ajibode Ibadan. Join us for worship, sermons, and spiritual growth.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} min-h-screen bg-slate-50 font-sans text-slate-900`}>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}