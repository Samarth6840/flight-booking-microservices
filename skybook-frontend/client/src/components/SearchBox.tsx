import { useState } from 'react';
import { ArrowRightLeft, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBoxProps {
  onSearch: (params: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  }) => void;
  compact?: boolean;
}

const CITIES = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad'
];

export default function SearchBox({ onSearch, compact = false }: SearchBoxProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    if (from && to && date) {
      onSearch({ from, to, date, passengers });
    }
  };

  const filteredFromCities = CITIES.filter(
    city => city.toLowerCase().includes(from.toLowerCase()) && city !== to
  );

  const filteredToCities = CITIES.filter(
    city => city.toLowerCase().includes(to.toLowerCase()) && city !== from
  );

  if (compact) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-lg p-4 shadow-lg border border-[#EDE9E0]">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          {/* From */}
          <div className="relative">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setShowFromDropdown(true)}
                placeholder="Departure"
                className="w-full pl-10 pr-3 py-2 text-sm border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
              />
              {showFromDropdown && filteredFromCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EDE9E0] rounded-lg shadow-lg z-10">
                  {filteredFromCities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setFrom(city);
                        setShowFromDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#F1F4F8] transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-lg bg-[#F1F4F8] hover:bg-[#C9A84C]/10 text-[#C9A84C] transition-all"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setShowToDropdown(true)}
                placeholder="Arrival"
                className="w-full pl-10 pr-3 py-2 text-sm border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
              />
              {showToDropdown && filteredToCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EDE9E0] rounded-lg shadow-lg z-10">
                  {filteredToCities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setTo(city);
                        setShowToDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#F1F4F8] transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!from || !to || !date}
            className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-[#EDE9E0]">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        {/* From */}
        <div className="relative">
          <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3 block">
            From
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setShowFromDropdown(true)}
              placeholder="Departure city"
              className="w-full pl-12 pr-4 py-3 text-base border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
            />
            {showFromDropdown && filteredFromCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDE9E0] rounded-lg shadow-lg z-10">
                {filteredFromCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setFrom(city);
                      setShowFromDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#F1F4F8] transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-lg bg-[#F1F4F8] hover:bg-[#C9A84C]/10 text-[#C9A84C] transition-all hover:shadow-md"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>
        </div>

        {/* To */}
        <div className="relative">
          <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3 block">
            To
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setShowToDropdown(true)}
              placeholder="Arrival city"
              className="w-full pl-12 pr-4 py-3 text-base border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
            />
            {showToDropdown && filteredToCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDE9E0] rounded-lg shadow-lg z-10">
                {filteredToCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setTo(city);
                      setShowToDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#F1F4F8] transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3 block">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
            />
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!from || !to || !date}
          className="bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full h-12 font-semibold"
        >
          Search Flights
        </Button>
      </div>
    </div>
  );
}
