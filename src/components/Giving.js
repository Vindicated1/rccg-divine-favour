'use client';

import { useState } from 'react';
import { Gift, Building, Copy, Check, ShieldCheck } from 'lucide-react';

export default function Giving() {
  const [copiedKey, setCopiedKey] = useState(null);

  const bankAccounts = [
    {
      id: 'main',
      label: 'Tithes & Offerings',
      bankName: 'First Bank',
      accountName: 'The Redeemed Christian Church of God Divine Favour Parish',
      accountNumber: '2026468000', // Update with main account
      accentColor: 'border-[#4c1864]/20 bg-[#4c1864]/[0.07] text-[#4c1864]',
    },
    {
      id: 'building',
      label: 'Building Fund & Projects',
      bankName: 'Wema Bank',
      accountName: 'RCCG Divine Favour Project Account',
      accountNumber: '0252022052', // Update with second account
      accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
  ];

  const handleCopyAccount = (accNumber, key) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="giving" className="border-y border-slate-200 bg-slate-50 px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4c1864]/[0.07] px-3 py-1 text-xs font-semibold text-[#4c1864]">
            <Gift className="w-4 h-4" /> Honor God with Your Substance
          </div>
          <h2 className="text-3xl font-extrabold text-[#241333]">Online giving & bank transfer details</h2>
          <p className="text-sm text-slate-600">
            "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-[#4c1864]/30 hover:shadow-md"
            >
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-2xl border ${account.accentColor}`}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4c1864]">{account.label}</span>
                    <h3 className="text-lg font-bold text-slate-900">{account.bankName}</h3>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Account Name</p>
                    <p className="text-base font-bold text-slate-900">{account.accountName}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">Account Number</p>
                    <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                      <span className="font-mono text-lg font-bold tracking-widest text-slate-900">
                        {account.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopyAccount(account.accountNumber, account.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#4c1864]/[0.08] px-3 py-1.5 text-xs font-semibold text-[#4c1864] transition hover:bg-[#4c1864]/[0.14]"
                      >
                        {copiedKey === account.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-[#008f4a]" />
                Direct parish account transfer
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}