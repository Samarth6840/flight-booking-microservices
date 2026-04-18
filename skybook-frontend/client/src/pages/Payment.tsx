import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBookingById, getPaymentByBookingId } from '@/services/api';

export default function Payment() {
  const [, setLocation] = useLocation();
  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    const id = window.location.pathname.split('/').pop();
    if (!id) return;
    getBookingById(Number(id))
      .then((data: any) => {
        if (!cancelled) setBooking(data);
      })
      .catch(console.error);
    getPaymentByBookingId(Number(id))
      .then((data: any) => {
        if (!cancelled) setPayment(data);
      })
      .catch(console.error);
    return () => { cancelled = true; };
  }, []);

  const getStatusConfig = () => {
    const status = booking?.status?.toUpperCase();
    switch (status) {
      case 'CONFIRMED':
        return {
          icon: CheckCircle,
          title: 'Booking Confirmed!',
          subtitle: 'Your flight is booked. Check your email for the e-ticket.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'PENDING':
        return {
          icon: Clock,
          title: 'Payment Processing',
          subtitle: 'Your payment is being processed. Please wait...',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      case 'FAILED':
        return {
          icon: XCircle,
          title: 'Booking Failed',
          subtitle: 'Your booking could not be completed. Please try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Booking Confirmed!',
          subtitle: 'Your flight is booked. Check your email for the e-ticket.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config?.icon || CheckCircle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white pt-20">
      <div className="container py-12">
        {/* Status Hero */}
        <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-2xl p-12 mb-12 text-center animate-fade-up`}>
          <div className="flex justify-center mb-6">
            <StatusIcon className={`w-16 h-16 ${config.color}`} />
          </div>
          <h1 className="text-4xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: 'var(--f-display)' }}>
            {config.title}
          </h1>
          <p className="text-lg text-[#64748B]">{config.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#0A1628] mb-6" style={{ fontFamily: 'var(--f-display)' }}>
                Booking Details
              </h2>

              <div className="bg-[#F1F4F8] rounded-lg p-6 mb-6 border border-[#EDE9E0]">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">
                  Booking Reference
                </p>
                <p className="text-2xl font-bold text-[#0A1628] font-mono">{booking?.id}</p>
              </div>

              {/* Flight Info */}
              <div className="mb-8 pb-8 border-b border-[#EDE9E0]">
                <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-4">
                  Flight Information
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Route</p>
                    <p className="text-lg font-bold text-[#0A1628]">
                      {booking?.from} → {booking?.to}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Airline</p>
                    <p className="text-lg font-bold text-[#0A1628]">{booking?.airline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Date</p>
                    <p className="text-lg font-bold text-[#0A1628]">{booking?.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Passengers</p>
                    <p className="text-lg font-bold text-[#0A1628]">{booking?.passengerCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Departure</p>
                    <p className="text-lg font-bold text-[#0A1628]">{booking?.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Arrival</p>
                    <p className="text-lg font-bold text-[#0A1628]">{booking?.arrivalTime}</p>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div>
                <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-4">
                  What's Next
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-sm font-bold text-[#C9A84C] flex-shrink-0">
                      1
                    </span>
                    <span className="text-sm text-[#0A1628]">
                      Check your email for the e-ticket and booking confirmation
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-sm font-bold text-[#C9A84C] flex-shrink-0">
                      2
                    </span>
                    <span className="text-sm text-[#0A1628]">
                      Arrive at the airport 2 hours before departure
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-sm font-bold text-[#C9A84C] flex-shrink-0">
                      3
                    </span>
                    <span className="text-sm text-[#0A1628]">
                      Check in and proceed to your gate
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => setLocation('/')}
                className="flex-1 bg-[#0A1628] text-white hover:shadow-lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                onClick={() => setLocation('/my-bookings')}
                className="flex-1 bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg"
              >
                View My Bookings
              </Button>
            </div>
          </div>

          {/* Sidebar: Price Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-8 sticky top-24">
              <h3 className="text-lg font-bold text-[#0A1628] mb-6" style={{ fontFamily: 'var(--f-display)' }}>
                Price Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-[#EDE9E0]">
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Price per ticket</span>
                  <span className="font-semibold text-[#0A1628]">{booking?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Number of passengers</span>
                  <span className="font-semibold text-[#0A1628]">{booking?.passengerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Taxes & fees</span>
                  <span className="font-semibold text-[#0A1628]">Included</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#64748B] uppercase tracking-widest">
                  Total Paid
                </span>
                <span className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: 'var(--f-display)' }}>
                  {booking?.totalPrice}
                </span>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">
                  Payment Status
                </p>
                <p className="text-sm font-semibold text-green-900">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
