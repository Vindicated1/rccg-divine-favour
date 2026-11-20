import Link from 'next/link';
import { ArrowUpRight, HeartHandshake, MessagesSquare, UsersRound } from 'lucide-react';

const steps = [
  {
    title: 'Find a fellowship group',
    description: 'Ask us about parish fellowships and ways to connect during the week.',
    href: 'mailto:rccgdfajibode@gmail.com?subject=Fellowship%20group%20information',
    action: 'Ask about groups',
    icon: UsersRound,
  },
  {
    title: 'Serve with us',
    description: 'Get in touch to learn about serving opportunities and ministry teams.',
    href: 'mailto:rccgdfajibode@gmail.com?subject=Serving%20at%20Divine%20Favour%20Parish',
    action: 'Explore serving',
    icon: HeartHandshake,
  },
  {
    title: 'Need prayer?',
    description: 'Share a prayer request and our pastoral team will stand with you.',
    href: '#prayer',
    action: 'Send a prayer request',
    icon: MessagesSquare,
  },
];

export default function NextSteps() {
  return (
    <section id="next-steps" className="bg-white px-4 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#008f4a]">Take your next step</p>
          <h2 className="mt-2 text-3xl font-bold text-[#241333] sm:text-4xl">There’s a place for you here.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ title, description, href, action, icon: Icon }) => (
            <article key={title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#4c1864]/30 hover:shadow-md">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4c1864]/[0.07] text-[#4c1864]">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
              <Link href={href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#4c1864] hover:text-[#008f4a]">
                {action} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
