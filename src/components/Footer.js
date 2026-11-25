import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MapPin, Phone, Mail, Send } from 'lucide-react';

const parishAddress = 'Along Laaniba Road, Onile-Aro, Ajibode, University of Ibadan, Ibadan, Oyo State, Nigeria';
const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(parishAddress)}`;

const quickLinks = [
  { label: 'About the parish', href: '#about' },
  { label: 'Latest messages', href: '#sermons' },
  { label: 'Upcoming events', href: '#announcements' },
  { label: 'Prayer request', href: '#prayer' },
  { label: 'Online giving', href: '#giving' },
  { label: 'Admin portal', href: '/admin' },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61579495722502' },
  { label: 'YouTube', href: 'https://www.youtube.com/@rccgdfajibode' },
  { label: 'Instagram', href: 'https://www.instagram.com/rccgdfajibode/' },
  { label: 'Telegram', href: 'https://t.me/+YB1vNpaZ1HZmZDc0', icon: Send },
];

export default function Footer() {
  return (
    <footer className="bg-[#241333] px-4 py-12 text-white sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
              <Image src="/logo.png" alt="RCCG logo" width={48} height={48} className="h-full w-full object-contain" />
            </span>
            <span className="font-bold leading-snug">RCCG Divine Favour Parish<br /><span className="text-sm font-medium text-white/65">Ajibode, Ibadan</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            A place of worship, prayer, service, and growth in faith.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-200">Quick links</h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/75 transition hover:text-emerald-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-200">Visit and contact</h2>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 transition hover:text-white">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
              <span>{parishAddress}</span>
            </a>
            <iframe
              title="Map showing RCCG Divine Favour Parish"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4720.160335559605!2d3.8869160371084863!3d7.4635678026540555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1039f33576f53db3%3A0x18e72b05a75501f3!2sRCCG%20Divine%20Favour%20Parish!5e0!3m2!1sen!2sng!4v1795612950319!5m2!1sen!2sng"
              className="h-48 w-full rounded-xl border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <p className="flex items-start gap-2.5">
              <span className="shrink-0 font-semibold text-white">Sunday services:</span>
              <span>Sunday School: 8:00 AM | Worship Service: 9:00 AM</span>
            </p>
            <a href="tel:+2348069659845" className="flex items-center gap-2.5 transition hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
              +234 806 965 9845
            </a>
            <a href="mailto:rccgdfajibode@gmail.com" className="flex items-center gap-2.5 transition hover:text-white">
              <Mail className="h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
              rccgdfajibode@gmail.com
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-200">Connect with us</h2>
          <ul className="mt-4 space-y-2.5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-emerald-200">
                  {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : label === 'Instagram' ? <Instagram className="h-4 w-4" aria-hidden="true" /> : null}
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} RCCG Divine Favour Parish, Ajibode. All rights reserved.</p>
        <p>Worship, pray, serve, and grow with us.</p>
      </div>
    </footer>
  );
}
