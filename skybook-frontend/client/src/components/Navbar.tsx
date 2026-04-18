import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Plane, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStoredUser, clearStoredUser } from '@/services/api';

/**
 * Navbar Component - Premium Navigation
 * Design: Glassmorphism effect, smooth transitions, responsive
 */

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUser(getStoredUser());
  }, [location]);

  const isHome = location === '/';

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setLocation('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Flights' },
    { href: '/my-bookings', label: 'My Bookings' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome && !isScrolled
          ? 'bg-transparent'
          : 'bg-white/80 backdrop-blur-md border-b border-[#EDE9E0]'
      }`}
    >
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A08535] flex items-center justify-center group-hover:shadow-lg transition-all">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-xl font-bold transition-colors ${
              isHome && !isScrolled ? 'text-white' : 'text-[#0A1628]'
            }`}
            style={{ fontFamily: 'var(--f-display)' }}
          >
            Sky<span className="text-[#C9A84C]">Book</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                location === link.href
                  ? isHome && !isScrolled
                    ? 'text-[#C9A84C]'
                    : 'text-[#C9A84C]'
                  : isHome && !isScrolled
                  ? 'text-white/75 hover:text-white'
                  : 'text-[#64748B] hover:text-[#0A1628]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {(user.role === 'ADMIN' || user.email === 'admin@gmail.com') && (
                <Button
                  variant="outline"
                  className={`${
                    isHome && !isScrolled
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-[#EDE9E0] text-[#0A1628]'
                  }`}
                  onClick={() => setLocation('/admin')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="outline"
                className={`${
                  isHome && !isScrolled
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-[#EDE9E0] text-[#0A1628]'
                }`}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className={`${
                  isHome && !isScrolled
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-[#EDE9E0] text-[#0A1628]'
                }`}
                onClick={() => setLocation('/auth')}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg"
                onClick={() => setLocation('/search')}
              >
                Book Now
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isHome && !isScrolled
              ? 'text-white hover:bg-white/10'
              : 'text-[#0A1628] hover:bg-[#F1F4F8]'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#EDE9E0] animate-fade-up">
          <div className="container py-4 space-y-3">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                    : 'text-[#0A1628] hover:bg-[#F1F4F8]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-[#EDE9E0]">
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Button
                      variant="outline"
                      className="w-full border-[#EDE9E0] text-[#0A1628]"
                      onClick={() => setLocation('/admin')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-[#EDE9E0] text-[#0A1628]"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-[#EDE9E0] text-[#0A1628]"
                    onClick={() => setLocation('/auth')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628]"
                    onClick={() => setLocation('/search')}
                  >
                    Book Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
