import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Welcome() {
  return (
    <section id="about" className="bg-slate-50 px-4 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-video w-full min-w-0 overflow-hidden rounded-3xl bg-[#241333] sm:min-h-[320px]">
          <iframe
            src="https://www.youtube-nocookie.com/embed/eHGcuOhA_Ms"
            title="Welcome to RCCG Divine Favour Parish"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#008f4a]">New here? We’d love to meet you.</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#241333] sm:text-4xl">
            Find a place to belong and grow in faith.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Join us for worship, prayer, and Bible teaching. Whether you are exploring faith or looking for a church family, you are welcome at RCCG Divine Favour Parish.
          </p>
          <div id="what-to-expect" className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-[#241333]">What to expect</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Our gatherings include worship, prayer, and Bible teaching. You are welcome to join us as you are.
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Children’s ministry details: <a href="tel:+2347066633016" className="text-[#008f4a] hover:underline">+234 706 663 3016</a>
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#visit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#008f4a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00783e]"
            >
              Plan your visit <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#what-to-expect"
              className="inline-flex items-center gap-2 rounded-lg border border-[#4c1864]/20 px-5 py-3 text-sm font-semibold text-[#4c1864] transition hover:bg-[#4c1864]/[0.05]"
            >
              What to expect
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
