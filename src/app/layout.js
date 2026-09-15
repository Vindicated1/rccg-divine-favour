import './globals.css';

export const metadata = {
  title: 'RCCG Divine Favour Parish',
  description: 'Official Website of RCCG Divine Favour Parish. A place of worship, praise, and transformation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}