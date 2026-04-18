import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Plane, Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBox from '@/components/SearchBox';
import FlightCard from '@/components/FlightCard';

/**
 * Home Page - Premium Flight Booking Hero
 * Design: Elevated Luxury with Modern Minimalism
 * - Asymmetric hero with layered depth
 * - Gold accents for premium feel
 * - Generous whitespace and smooth animations
 */

const FEATURED_ROUTES = [
  {
    id: 1,
    from: 'Delhi',
    to: 'Mumbai',
    code: 'DEL → BOM',
    time: '2h 10m',
    price: '₹3,299',
    airline: 'SkyAir',
    departure: '08:00 AM',
    arrival: '10:10 AM'
  },
  {
    id: 2,
    from: 'Mumbai',
    to: 'Bangalore',
    code: 'BOM → BLR',
    time: '1h 50m',
    price: '₹2,499',
    airline: 'SkyAir',
    departure: '02:30 PM',
    arrival: '04:20 PM'
  },
  {
    id: 3,
    from: 'Delhi',
    to: 'Bangalore',
    code: 'DEL → BLR',
    time: '2h 45m',
    price: '₹4,199',
    airline: 'SkyAir',
    departure: '10:15 AM',
    arrival: '01:00 PM'
  },
];

const BENEFITS = [
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your booking data is encrypted and never shared with third parties.'
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Receive your e-ticket the moment payment clears. No waiting.'
  },
  {
    icon: Star,
    title: 'Best Price Guarantee',
    description: 'We match fares across all major carriers to ensure you always fly for less.'
  },
];

const STATS = [
  { number: '98%', label: 'On-time Arrivals' },
  { number: '200+', label: 'Daily Flights' },
  { number: '50K+', label: 'Happy Passengers' },
  { number: '4.9★', label: 'Avg Rating' },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });

  const handleSearch = (params: any) => {
    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
      date: params.date,
      passengers: params.passengers
    });
    setLocation(`/search?${query.toString()}`);
  };

  const handleRouteClick = (route: any) => {
    const today = new Date().toISOString().split('T')[0];
    const query = new URLSearchParams({
      from: route.from,
      to: route.to,
      date: today,
      passengers: '1'
    });
    setLocation(`/search?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white">
      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Hero background image */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663550260158/jmp3whkXjqyxLa4NtTubtf/hero-bg-1-VkosiDn5GyEyyEtRrpmc3X.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F0] via-transparent to-transparent" />
          {/* Decorative plane */}
          <div className="absolute right-10 top-1/3 text-9xl opacity-5 animate-float">✈</div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
                Premium Flight Booking
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-[#0A1628] mb-6 leading-tight animate-fade-up">
              The World
              <br />
              <span className="bg-gradient-to-r from-[#C9A84C] via-[#E8C96A] to-[#A08535] bg-clip-text text-transparent">
                Awaits You
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-[#64748B] mb-12 leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Discover extraordinary destinations. Book flights with confidence. Experience travel the way it should be.
            </p>

            {/* Search Box */}
            <div className="mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <SearchBox onSearch={handleSearch} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {STATS.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-3xl md:text-4xl font-bold text-[#0A1628]" style={{ fontFamily: 'var(--f-display)' }}>
                    {stat.number}
                  </p>
                  <p className="text-sm text-[#94A3B8] mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED ROUTES ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">
                Popular Routes
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628]" style={{ fontFamily: 'var(--f-display)' }}>
                Top Destinations
              </h2>
            </div>
            <Button
              variant="outline"
              className="mt-6 md:mt-0 border-[#EDE9E0] text-[#0A1628] hover:border-[#C9A84C] hover:text-[#C9A84C]"
              onClick={() => setLocation('/search')}
            >
              View All Flights <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_ROUTES.map((route, idx) => (
              <button
                key={idx}
                onClick={() => handleRouteClick(route)}
                className="card-premium p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                style={{
                  animation: `fadeUp 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                <div className="mb-4">
                  <span className="text-xs font-bold text-[#A08535] uppercase tracking-widest">
                    {route.code}
                  </span>
                </div>
                <p className="text-xl font-bold text-[#0A1628] mb-3" style={{ fontFamily: 'var(--f-display)' }}>
                  {route.from} → {route.to}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#64748B]">{route.time} · Direct</span>
                  <span className="text-lg font-bold text-[#C9A84C]" style={{ fontFamily: 'var(--f-display)' }}>
                    {route.price}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#C9A84C] text-sm font-medium group-hover:translate-x-1 transition-transform">
                  <span>View flights</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SKYBOOK ──────────────────────────────────────── */}
      <section className="py-20 bg-[#0A1628] text-white">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-3">
              Why SkyBook
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--f-display)' }}>
              Crafted for Discerning Travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-xl bg-white/5 border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300 hover:bg-white/10"
                  style={{
                    animation: `fadeUp 0.6s ease-out ${idx * 0.1}s both`
                  }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--f-display)' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-[#94A3B8] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F5F0]">
        <div className="container">
          <div className="bg-[#0A1628] rounded-2xl p-12 md:p-16 relative overflow-hidden border border-[#C9A84C]/20">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Ready to Explore?
              </h2>
              <p className="text-lg text-[#94A3B8] mb-8">
                Start your journey today. Find the perfect flight and create unforgettable memories.
              </p>
              <Button
                className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-xl hover:-translate-y-0.5 transition-all"
                onClick={() => setLocation('/search')}
              >
                Search Flights <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
