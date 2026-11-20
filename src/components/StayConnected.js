'use client';

import { useState } from 'react';
import { Mail, Send, Video } from 'lucide-react';

export default function StayConnected() {
  const [email, setEmail] = useState('');
  const [emailDraftLink, setEmailDraftLink] = useState('');

  const prepareUpdateRequest = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent('Weekly parish updates');
    const body = encodeURIComponent(`Please contact me about weekly parish updates. My email address is ${email}.`);
    setEmailDraftLink(`mailto:rccgdfajibode@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <section className="bg-[#241333] px-4 py-14 text-white sm:py-16 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Stay connected during the week</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Parish news, messages, and updates.</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Request weekly email updates, or join the parish Telegram channel. Email requests are sent through your email app; an automated mailing list is not connected yet.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <form onSubmit={prepareUpdateRequest} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="updates-email" className="sr-only">Your email address</label>
            <input
              id="updates-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailDraftLink('');
              }}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-lg border border-white/25 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
            {emailDraftLink ? (
              <a href={emailDraftLink} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008f4a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00783e]">
                <Mail className="h-4 w-4" aria-hidden="true" /> Open email draft
              </a>
            ) : (
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008f4a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00783e]">
                <Mail className="h-4 w-4" aria-hidden="true" /> Request updates
              </button>
            )}
          </form>
          <a
            href="https://t.me/+YB1vNpaZ1HZmZDc0"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-emerald-200"
          >
            <Send className="h-4 w-4" aria-hidden="true" /> Join the Telegram channel
          </a>
          <a
            href="https://meet.google.com/kqs-wmyn-vpk"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-5 mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-emerald-200"
          >
            <Video className="h-4 w-4" aria-hidden="true" /> Join online prayer
          </a>
        </div>
      </div>
    </section>
  );
}
