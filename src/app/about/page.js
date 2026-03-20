import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Globe, Award, Users, Heart, Shield, Star } from 'lucide-react';

export const metadata = { title: 'About Us' };

const team = [
  { name: 'Alex Rahman', role: 'Founder & CEO',       bio: '15+ years in travel industry, passionate about creating life-changing experiences.' },
  { name: 'Sarah Chen',  role: 'Head of Operations',  bio: 'Expert in logistics and ensuring every tour runs smoothly and safely.' },
  { name: 'Marco Silva', role: 'Lead Travel Guide',    bio: 'Certified guide in 20+ countries with deep cultural knowledge.' },
  { name: 'Priya Patel', role: 'Customer Experience', bio: 'Dedicated to making every traveler feel valued and cared for.' },
];

const values = [
  { icon: Heart,   title: 'Passion for Travel',    desc: 'We live and breathe travel. Every tour is crafted with genuine love for exploration.' },
  { icon: Shield,  title: 'Safety First',           desc: 'Your safety is our top priority on every adventure we organize.' },
  { icon: Globe,   title: 'Sustainable Tourism',    desc: 'We work with local communities and minimize our environmental impact.' },
  { icon: Star,    title: 'Excellence',             desc: 'We never settle for ordinary. Every detail is carefully considered.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950 pt-16">
        {/* Hero */}
        <div className="relative py-24 bg-gradient-to-br from-sky-600 to-blue-800 text-center px-4">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="relative max-w-3xl mx-auto">
            <Globe className="w-14 h-14 text-sky-300 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-white mb-5">About TourMaster</h1>
            <p className="text-xl text-sky-100 leading-relaxed">
              Founded in 2009, we've been turning travel dreams into extraordinary realities for over 15 years. From humble beginnings to serving 10,000+ travelers annually, our mission remains the same — to create unforgettable journeys.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[['50+', 'Countries'], ['10K+', 'Happy Travelers'], ['200+', 'Tour Packages'], ['15+', 'Years Experience']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-4xl font-bold text-sky-500 mb-1">{v}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                TourMaster started with a simple idea: travel should be accessible, authentic, and extraordinary. Our founder Alex Rahman, after years of traveling solo across Asia and Europe, realized that most tour companies treated travelers as numbers rather than people.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, we're proud to be one of the most trusted travel companies, partnering with local communities worldwide to offer experiences that are both meaningful and sustainable.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80" alt="Our story" className="w-full h-72 object-cover" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, bio }) => (
              <div key={name} className="card p-5 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {name[0]}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                <p className="text-sm text-sky-500 mb-2">{role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
