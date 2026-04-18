import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserBookings, getStoredUser } from '@/services/api';

type StatusFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';

export default function MyBookings() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    const user = getStoredUser();
    if (user?.id) {
      getUserBookings(user.id)
        .then(data => {
          if (!cancelled) setBookings(data || []);
        })
        .catch(console.error);
    }
    return () => { cancelled = true; };
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'CONFIRMED':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Confirmed' };
      case 'COMPLETED':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Completed' };
      case 'CANCELLED':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Cancelled' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: status };
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    const status = booking.status?.toUpperCase();
    if (filter === 'upcoming') return status === 'CONFIRMED';
    if (filter === 'completed') return status === 'COMPLETED';
    if (filter === 'cancelled') return status === 'CANCELLED';
    return booking.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white pt-20">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: 'var(--f-display)' }}>
            My Bookings
          </h1>
          <p className="text-lg text-[#64748B]">
            View and manage all your flight bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'all' as const, label: 'All Bookings' },
              { value: 'upcoming' as const, label: 'Upcoming' },
              { value: 'completed' as const, label: 'Completed' },
              { value: 'cancelled' as const, label: 'Cancelled' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filter === tab.value
                    ? 'bg-[#C9A84C] text-[#0A1628] shadow-md'
                    : 'bg-white border-2 border-[#EDE9E0] text-[#0A1628] hover:border-[#C9A84C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking, idx) => {
              const statusBadge = getStatusBadge(booking.status);
              return (
                <div
                  key={booking.id}
                  className="card-premium p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setLocation(`/payment/${booking.id}`)}
                  style={{
                    animation: `fadeUp 0.6s ease-out ${idx * 0.1}s both`
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Flight Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-1">
                            {booking.airline}
                          </p>
                          <p className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'var(--f-display)' }}>
                            {booking.from} → {booking.to}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-[#64748B]">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#64748B]">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.departure}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#64748B]">
                          <Users className="w-4 h-4" />
                          <span>{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-[#0A1628] font-semibold">
                          {booking.price}
                        </div>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex flex-col items-end gap-4">
                      <div className={`px-4 py-2 rounded-lg border-2 ${statusBadge.bg} ${statusBadge.border}`}>
                        <p className={`text-sm font-bold ${statusBadge.text}`}>
                          {statusBadge.label}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[#C9A84C] group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-semibold">View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-premium p-12 text-center">
            <p className="text-lg text-[#64748B] mb-6">
              No bookings found for the selected filter
            </p>
            <Button
              onClick={() => setLocation('/search')}
              className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg"
            >
              Search Flights
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
