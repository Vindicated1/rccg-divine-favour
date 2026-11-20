import { Baby, Clock3, MapPin, Phone } from 'lucide-react';

const parishAddress = 'Along Laaniba Road, Onile-Aro, Ajibode, University of Ibadan, Ibadan, Oyo State, Nigeria';
const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(parishAddress)}`;

const details = [
  {
    label: 'Find us',
    value: parishAddress,
    icon: MapPin,
    href: mapUrl,
  },
  {
    label: 'Sunday services',
    value: 'Sunday School: 8:00 AM | Worship Service: 9:00 AM',
    icon: Clock3,
  },
  {
    label: 'Children’s check-in',
    value: '+234 706 663 3016',
    icon: Baby,
    href: 'tel:+2347066633016',
  },
  {
    label: 'Call the parish',
    value: '+234 806 965 9845',
    icon: Phone,
    href: 'tel:+2348069659845',
  },
];

export default function QuickInfo() {
  return (
    <section id="visit" aria-label="Plan your visit" className="relative z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-4 sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 md:divide-x md:divide-y-0 lg:px-8">
        {details.map(({ label, value, icon: Icon, href }) => {
          const content = (
            <div className="flex h-full items-start gap-3 px-4 py-5 sm:px-5">
              <span className="mt-0.5 rounded-lg bg-[#4c1864]/[0.07] p-2 text-[#4c1864]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                <span className={`mt-1 block text-sm font-medium leading-relaxed ${value.startsWith('[ADD') ? 'text-[#4c1864]' : 'text-slate-800'}`}>
                  {value}
                </span>
              </span>
            </div>
          );

          return href ? (
            <a key={label} href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined} className="rounded-sm transition hover:bg-slate-50">
              {content}
            </a>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
