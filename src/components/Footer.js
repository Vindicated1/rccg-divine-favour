import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Church Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-amber-500">RCCG Divine Favour</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ajibode, Ibadan, Oyo State, Nigeria.
          </p>
          <p className="text-xs text-slate-500">
            A parish of the Redeemed Christian Church of God.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-md font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/sermons" className="hover:text-amber-400 transition-colors">
                Sermons & Audio
              </Link>
            </li>
            <li>
              <Link href="/prayer-request" className="hover:text-amber-400 transition-colors">
                Prayer Request
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Service Times */}
        <div>
          <h4 className="text-md font-semibold text-white mb-4">Service Times</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><span className="text-amber-400 font-medium">Sunday School:</span> 8:00 AM</li>
            <li><span className="text-amber-400 font-medium">Sunday Service:</span> 9:00 AM</li>
            <li><span className="text-amber-400 font-medium">Digging Deep (Tue):</span> 5:00 PM</li>
            <li><span className="text-amber-400 font-medium">Faith Clinic (Thu):</span> 5:00 PM</li>
          </ul>
        </div>

        {/* Social Media & Connect */}
        <div>
          <h4 className="text-md font-semibold text-white mb-4">Connect With Us</h4>
          <p className="text-sm text-slate-400 mb-4">
            Follow our live streams and updates on social media:
          </p>
          
          <div className="flex flex-col space-y-3">
            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/search/top?q=RCCG%20Divine%20Favour%20Ajibode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 text-sm bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg transition-all"
            >
              <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>RCCG Divine Favour Ajibode</span>
            </a>

            {/* YouTube Link */}
            <a
              href="https://www.youtube.com/results?search_query=RCCG+Divine+Favour+Parish"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 text-sm bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg transition-all"
            >
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>RCCG Divine Favour Parish</span>
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} RCCG Divine Favour Parish, Ajibode Ibadan. All rights reserved.</p>
      </div>
    </footer>
  );
}