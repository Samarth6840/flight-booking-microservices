import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import SearchBox from '@/components/SearchBox';
import FlightCard from '@/components/FlightCard';
import { searchFlights, getAllFlights } from '@/services/api';


type SortOption = 'price-low' | 'price-high' | 'duration' | 'departure';

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchParams] = useLocation();
  const [flights, setFlights] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('price-low');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(searchParams.split('?')[1]);
    const from = params.get('from');
    const to = params.get('to');
    const date = params.get('date');

    setFrom(from || '');
    setTo(to || '');

    const fetchFlights = async () => {
      try {
        const data = from && to && date 
          ? await searchFlights(from, to, date)
          : await getAllFlights();
        if (!cancelled) {
          setFlights(data || []);
        }
      } catch {
        if (!cancelled) {
          setFlights([]);
        }
      }
    };

    fetchFlights();
    return () => { cancelled = true; };
  }, [searchParams]);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    let sorted = [...flights];

    switch (option) {
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = parseInt((a.price || '0').replace(/[^\d]/g, ''));
          const priceB = parseInt((b.price || '0').replace(/[^\d]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = parseInt((a.price || '0').replace(/[^\d]/g, ''));
          const priceB = parseInt((b.price || '0').replace(/[^\d]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const durationA = parseInt(a.time) || 0;
          const durationB = parseInt(b.time) || 0;
          return durationA - durationB;
        });
        break;
      case 'departure':
        sorted.sort((a, b) => (a.departure || '').localeCompare(b.departure || ''));
        break;
    }

    setFlights(sorted);
  };

  const handleSearch = (params: any) => {
    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
      date: params.date,
      passengers: params.passengers
    });
    setLocation(`/search?${query.toString()}`);
  };

  const handleBook = (flight: any) => {
    setLocation(`/booking/${flight.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white pt-20">
      {/* Search Header */}
      <section className="bg-[#0A1628] text-white py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--f-display)' }}>
            Search Flights
          </h1>
          <SearchBox onSearch={handleSearch} compact />
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container">
          {/* Sort Options */}
          <div className="mb-8">
            <p className="text-sm font-bold text-[#64748B] uppercase tracking-widest mb-4">
              Sort by
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'price-low' as const, label: 'Price: Low to High' },
                { value: 'price-high' as const, label: 'Price: High to Low' },
                { value: 'duration' as const, label: 'Shortest Duration' },
                { value: 'departure' as const, label: 'Earliest Departure' },
              ].map(option => (
                <Button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  variant={sortBy === option.value ? 'default' : 'outline'}
                  className={sortBy === option.value ? 'bg-[#C9A84C] text-[#0A1628]' : 'border-[#EDE9E0] text-[#0A1628]'}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-[#64748B] mb-6">
            Found <span className="font-bold text-[#0A1628]">{flights.length}</span> flights from{' '}
            <span className="font-bold text-[#0A1628]">{from}</span> to{' '}
            <span className="font-bold text-[#0A1628]">{to}</span>
          </p>

          {/* Flight List */}
          {flights.length > 0 ? (
            <div className="space-y-4">
              {flights.map((flight, idx) => (
                <div
                  key={flight.id}
                  style={{
                    animation: `fadeUp 0.6s ease-out ${idx * 0.1}s both`
                  }}
                >
                  <FlightCard flight={flight} onBook={handleBook} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#64748B] mb-4">No flights found</p>
              <Button
                onClick={() => setLocation('/')}
                className="bg-[#0A1628] text-white hover:shadow-lg"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
