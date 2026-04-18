import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userApi } from '@/services/api';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [searchParams] = useLocation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = new URLSearchParams(searchParams.split('?')[1]).get('redirect') || '/';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user;
      if (mode === 'login') {
        user = await userApi.login({ email: formData.email, password: formData.password });
      } else {
        user = await userApi.register({ name: formData.name, email: formData.email, password: formData.password });
      }
      
      const userData = user?.data || user;
      localStorage.setItem('sb_user', JSON.stringify(userData));
      setLocation(redirectTo);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white pt-20">
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <div className="card-premium p-8">
            <h1 className="text-3xl font-bold text-[#0A1628] mb-2 text-center" style={{ fontFamily: 'var(--f-display)' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#64748B] text-center mb-8">
              {mode === 'login' ? 'Sign in to your account' : 'Join SkyBook today'}
            </p>

            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#64748B]">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                  }}
                  className="ml-2 text-[#C9A84C] font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}