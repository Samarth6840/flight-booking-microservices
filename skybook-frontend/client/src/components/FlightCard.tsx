import { Clock, MapPin, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStoredUser } from '@/services/api';

interface FlightCardProps {
  flight: {
    id: number;
    from: string;
    to: string;
    time: string;
    price: string;
    airline: string;
    departure: string;
    arrival: string;
  };
  onBook?: (flight: any) => void;
}

export default function FlightCard({ flight, onBook }: FlightCardProps) {
  const user = getStoredUser();
  
  const handleBook = () => {
    if (!user) return;
    onBook?.(flight);
  };
  
  return (
    <div className="card-premium p-6 hover:shadow-lg transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* Airline & Route */}
        <div>
          <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">
            {flight.airline}
          </p>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#64748B]" />
            <p className="text-lg font-bold text-[#0A1628]">
              {flight.from} → {flight.to}
            </p>
          </div>
        </div>

        {/* Departure */}
        <div>
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">
            Departure
          </p>
          <p className="text-lg font-bold text-[#0A1628]">{flight.departure}</p>
        </div>

        {/* Duration */}
        <div>
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">
            Duration
          </p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C9A84C]" />
            <p className="text-lg font-bold text-[#0A1628]">{flight.time}</p>
          </div>
        </div>

        {/* Arrival */}
        <div>
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">
            Arrival
          </p>
          <p className="text-lg font-bold text-[#0A1628]">{flight.arrival}</p>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end gap-3">
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">
              Price
            </p>
            <p className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: 'var(--f-display)' }}>
              {flight.price}
            </p>
          </div>
          {onBook && user && (
            <Button
              onClick={handleBook}
              className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg"
            >
              Book Now
            </Button>
          )}
          {onBook && !user && (
            <Button
              disabled
              className="bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Login to Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
