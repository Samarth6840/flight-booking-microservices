import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFlightById, createBooking, getStoredUser } from '@/services/api';

export default function Booking() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [flight, setFlight] = useState<any>(null);
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const id = window.location.pathname.split('/').pop();
    if (id) {
      getFlightById(Number(id))
        .then(data => {
          if (!cancelled) setFlight(data);
        })
        .catch(console.error);
    }
    return () => { cancelled = true; };
  }, []);

  const totalPrice = flight ? parseInt((flight.price || '0').replace(/[^\d]/g, '')) * passengers : 0;

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && passengerInfo.name && passengerInfo.email && passengerInfo.phone) {
      setStep(3);
    }
  };

  const handleConfirmBooking = async () => {
    if (!agreed || !flight) return;
    try {
      const user = getStoredUser();
      if (!user?.id) {
        setError('Please login first');
        setLocation('/auth?redirect=/booking/' + flight.id);
        return;
      }
      const { data } = await createBooking({
        userId: user.id,
        flightId: flight.id,
        seatCount: passengers,
      });
      if (data?.status === 'FAILED' || data?.status === 'FAILED') {
        setError('Payment failed. Please try again.');
        return;
      }
      setLocation(`/payment/${data.id}`);
    } catch (err: any) {
      console.error('Booking failed', err);
      setError(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white pt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        s <= step
                          ? 'bg-[#C9A84C] text-[#0A1628]'
                          : 'bg-[#EDE9E0] text-[#94A3B8]'
                      }`}
                    >
                      {s < step ? <Check className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-12 h-1 ${
                          s < step ? 'bg-[#C9A84C]' : 'bg-[#EDE9E0]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
                    Step 1
                  </p>
                  <p className="text-sm text-[#0A1628] font-semibold">Select Passengers</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[step >= 2 ? '#C9A84C' : '#94A3B8'] uppercase tracking-widest">
                    Step 2
                  </p>
                  <p className={`text-sm font-semibold ${step >= 2 ? 'text-[#0A1628]' : 'text-[#94A3B8]'}`}>
                    Passenger Details
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[step >= 3 ? '#C9A84C' : '#94A3B8'] uppercase tracking-widest">
                    Step 3
                  </p>
                  <p className={`text-sm font-semibold ${step >= 3 ? 'text-[#0A1628]' : 'text-[#94A3B8]'}`}>
                    Confirm & Pay
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Select Passengers */}
            {step === 1 && (
              <div className="card-premium p-8 mb-8 animate-fade-up">
                <h2 className="text-2xl font-bold text-[#0A1628] mb-6" style={{ fontFamily: 'var(--f-display)' }}>
                  Select Number of Passengers
                </h2>
                <div className="mb-8">
                  <p className="text-sm text-[#64748B] mb-4">How many passengers?</p>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-12 h-12 rounded-lg border-2 border-[#EDE9E0] flex items-center justify-center hover:border-[#C9A84C] transition-all"
                    >
                      −
                    </button>
                    <span className="text-4xl font-bold text-[#0A1628] w-16 text-center">
                      {passengers}
                    </span>
                    <button
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="w-12 h-12 rounded-lg border-2 border-[#EDE9E0] flex items-center justify-center hover:border-[#C9A84C] transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg w-full"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Passenger Details */}
            {step === 2 && (
              <div className="card-premium p-8 mb-8 animate-fade-up">
                <h2 className="text-2xl font-bold text-[#0A1628] mb-6" style={{ fontFamily: 'var(--f-display)' }}>
                  Passenger Information
                </h2>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={passengerInfo.name}
                      onChange={(e) => setPassengerInfo({ ...passengerInfo, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={passengerInfo.email}
                      onChange={(e) => setPassengerInfo({ ...passengerInfo, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={passengerInfo.phone}
                      onChange={(e) => setPassengerInfo({ ...passengerInfo, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleContinue}
                  disabled={!passengerInfo.name || !passengerInfo.email || !passengerInfo.phone}
                  className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg w-full disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3: Confirm & Pay */}
            {step === 3 && (
              <div className="card-premium p-8 mb-8 animate-fade-up">
                <h2 className="text-2xl font-bold text-[#0A1628] mb-6" style={{ fontFamily: 'var(--f-display)' }}>
                  Confirm & Pay
                </h2>

                {/* Flight Summary */}
                <div className="bg-[#F1F4F8] rounded-lg p-6 mb-8 border border-[#EDE9E0]">
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-4">
                    Flight Summary
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Route</p>
                      <p className="font-bold text-[#0A1628]">
                        {flight?.from} → {flight?.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Date</p>
                      <p className="font-bold text-[#0A1628]">{flight?.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Departure</p>
                      <p className="font-bold text-[#0A1628]">{flight?.departure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Passengers</p>
                      <p className="font-bold text-[#0A1628]">{passengers}</p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Terms */}
                <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    By confirming this booking, you agree to our terms and conditions. A confirmation email will be sent to your registered email address.
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-[#EDE9E0] cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-sm text-[#0A1628] cursor-pointer">
                    I agree to the terms and conditions
                  </label>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={!agreed}
                  className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg w-full disabled:opacity-50"
                >
                  Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-8 sticky top-24">
              <h3 className="text-lg font-bold text-[#0A1628] mb-6" style={{ fontFamily: 'var(--f-display)' }}>
                Booking Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-[#EDE9E0]">
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Flight</span>
                  <span className="font-semibold text-[#0A1628]">
                    {flight?.from} → {flight?.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Date</span>
                  <span className="font-semibold text-[#0A1628]">{flight?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Passengers</span>
                  <span className="font-semibold text-[#0A1628]">{passengers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Price per ticket</span>
                  <span className="font-semibold text-[#0A1628]">{flight?.price}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#64748B] uppercase tracking-widest">
                  Total
                </span>
                <span className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: 'var(--f-display)' }}>
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
