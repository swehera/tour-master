import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-7 h-7 text-sky-400" />
              <span className="text-xl font-bold text-white">TourMaster</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Your gateway to the world's most breathtaking destinations. We craft unforgettable journeys with expert guides and personalized service.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-sky-500 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/tours', 'All Tours'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-sky-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Types */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tour Types</h4>
            <ul className="space-y-2.5 text-sm">
              {['Adventure Tours', 'Cultural Tours', 'Beach & Island', 'Mountain Treks', 'City Tours', 'Wildlife Safari'].map(t => (
                <li key={t}><a href="/tours" className="text-gray-400 hover:text-sky-400 transition-colors">{t}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" /><span className="text-gray-400">123 Travel Street, Dhaka, Bangladesh</span></li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-sky-400 shrink-0" /><a href="tel:+8801700000000" className="text-gray-400 hover:text-sky-400 transition-colors">+880 17 0000 0000</a></li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-sky-400 shrink-0" /><a href="mailto:hello@tourmaster.com" className="text-gray-400 hover:text-sky-400 transition-colors">hello@tourmaster.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-5">
        <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} TourMaster. All rights reserved.</p>
      </div>
    </footer>
  );
}
