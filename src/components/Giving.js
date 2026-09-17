'use client';

import { useState } from 'react';
import { Gift, Building, Copy, Check } from 'lucide-react';

export default function Giving() {
  const [copiedKey, setCopiedKey] = useState(null);

  const bankAccounts = [
    {
      id: 'main',
      label: 'Tithes & Offerings',
      bankName: 'First Bank',
      accountName: 'The Redeemed Christian Church of God Divine Favour Parish',
      accountNumber: '2026468000', // Update with main account
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    },
    {
      id: 'building',
      label: 'Building Fund & Projects',
      bankName: 'Wema Bank',
      accountName: 'RCCG Divine Favour Project Account',
      accountNumber: '0252022052', // Update with second account
      accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    },
  ];

  const handleCopyAccount = (accNumber, key) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="giving" className="py-16 px-4 bg-slate-900/40 border-b border-slate-800/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Gift className="w-4 h-4" /> Honor God with Your Substance
          </div>
          <h3 className="text-3xl font-extrabold text-white">Online Giving & Bank Transfer Details</h3>
          <p className="text-slate-400 text-sm">
            "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-2xl border ${account.accentColor}`}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">{account.label}</span>
                    <h4 className="font-bold text-lg text-white">{account.bankName}</h4>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Account Name</p>
                    <p className="text-base font-bold text-white">{account.accountName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-medium">Account Number</p>
                    <div className="flex items-center justify-between mt-1 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
                      <span className="text-lg font-mono font-bold tracking-widest text-white">
                        {account.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopyAccount(account.accountNumber, account.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
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

              <p className="text-[11px] text-slate-500 text-center mt-6">
                🔒 Direct Parish Account Transfer
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}