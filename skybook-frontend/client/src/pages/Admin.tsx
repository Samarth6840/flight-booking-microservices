import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Plus, Pencil, Trash2, Plane, AlertCircle, X, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { flightApi, bookingApi, getStoredUser } from '@/services/api';

type Tab = 'flights' | 'bookings';

interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  totalSeats: number;
}

interface FlightRequest {
  flightNumber: string;
  airlineName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  totalSeats: number;
}

interface Booking {
  id: number;
  userId: number;
  flightId: number;
  seatCount: number;
  totalAmount: number;
  status: string;
  bookingDate: string;
  bookingRef?: string;
}

interface BookingWithFlight extends Booking {
  from?: string;
  to?: string;
  airline?: string;
  flightNumber?: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>('flights');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<BookingWithFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const user = getStoredUser();

  const [formData, setFormData] = useState<FlightRequest>({
    flightNumber: '',
    airlineName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    fare: 0,
    totalSeats: 0,
  });

  useEffect(() => {
    if (!user) {
      setLocation('/auth?redirect=/admin');
      return;
    }
    if (user.role !== 'ADMIN') {
      setLocation('/');
      return;
    }
  }, [user, setLocation]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;
    if (tab === 'flights') {
      loadFlights();
    } else {
      loadBookings();
    }
  }, [tab, user]);

  const loadFlights = () => {
    flightApi.getAll()
      .then(data => setFlights(data || []))
      .catch(err => {
        console.error('Failed to load flights:', err);
        setError('Failed to load flights');
      });
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const allBookings = await bookingApi.adminGetAll();
      const bookingsWithFlights: BookingWithFlight[] = await Promise.all(
        (allBookings || []).map(async (booking: Booking) => {
          try {
            const flight = await flightApi.getById(booking.flightId);
            return {
              ...booking,
              from: flight.source,
              to: flight.destination,
              airline: flight.airlineName,
              flightNumber: flight.flightNumber,
            };
          } catch (err) {
            console.warn(`Flight lookup failed for flightId ${booking.flightId}:`, err);
            return { ...booking, flightId: booking.flightId };
          }
        })
      );
      setBookings(bookingsWithFlights);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (editingFlight) {
        await flightApi.update(editingFlight.id, formData);
        setSuccess('Flight updated successfully!');
      } else {
        await flightApi.create(formData);
        setSuccess('Flight created successfully!');
      }
      setTimeout(() => {
        setShowModal(false);
        setEditingFlight(null);
        resetForm();
        setSubmitting(false);
        loadFlights();
      }, 1500);
    } catch (err: any) {
      console.error('Flight operation failed:', err);
      setError(err?.response?.data?.message || err.message || 'Operation failed');
      setSubmitting(false);
    }
  };

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      airlineName: flight.airlineName,
      source: flight.source,
      destination: flight.destination,
      departureTime: flight.departureTime.slice(0, 16),
      arrivalTime: flight.arrivalTime.slice(0, 16),
      fare: flight.fare,
      totalSeats: flight.totalSeats,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    setLoading(true);
    try {
      await flightApi.delete(id);
      loadFlights();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setLoading(true);
    try {
      await bookingApi.cancel(id);
      loadBookings();
    } catch (err: any) {
      setError(err.message || 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this booking? This cannot be undone.')) return;
    setLoading(true);
    try {
      await bookingApi.deletePermanently(id);
      loadBookings();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      airlineName: '',
      source: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      fare: 0,
      totalSeats: 0,
    });
    setEditingFlight(null);
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-IN');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F8F5F0] to-white pt-20'>
      <div className='container py-12'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-[#0A1628]' style={{ fontFamily: 'var(--f-display)' }}>
            Admin Dashboard
          </h1>
        </div>

        {success && (
          <div className='flex items-center gap-2 p-4 mb-6 bg-green-50 border border-green-200 rounded-lg text-green-700'>
            <Check className='w-5 h-5 flex-shrink-0' />
            <p className='text-sm'>{success}</p>
            <button onClick={() => setSuccess('')} className='ml-auto'>
              <X className='w-4 h-4' />
            </button>
          </div>
        )}

        {error && (
          <div className='flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700'>
            <AlertCircle className='w-5 h-5 flex-shrink-0' />
            <p className='text-sm'>{error}</p>
            <button onClick={() => setError('')} className='ml-auto'>
              <X className='w-4 h-4' />
            </button>
          </div>
        )}

        <div className='flex gap-4 mb-8'>
          <button
            onClick={() => setTab('flights')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              tab === 'flights'
                ? 'bg-[#C9A84C] text-[#0A1628] shadow-md'
                : 'bg-white border-2 border-[#EDE9E0] text-[#0A1628] hover:border-[#C9A84C]'
            }`}
          >
            <Plane className='w-4 h-4 inline mr-2' />
            Flights
          </button>
          <button
            onClick={() => setTab('bookings')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              tab === 'bookings'
                ? 'bg-[#C9A84C] text-[#0A1628] shadow-md'
                : 'bg-white border-2 border-[#EDE9E0] text-[#0A1628] hover:border-[#C9A84C]'
            }`}
          >
            <Calendar className='w-4 h-4 inline mr-2' />
            Bookings
          </button>
        </div>

        {tab === 'flights' && (
          <div>
            <div className='flex justify-end mb-4'>
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className='bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628]'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Flight
              </Button>
            </div>

            {loading && flights.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-lg text-[#64748B]'>Loading flights...</p>
              </div>
            ) : flights.length === 0 ? (
              <div className='text-center py-12 card-premium'>
                <p className='text-lg text-[#64748B] mb-4'>No flights found</p>
                <Button
                  onClick={() => setShowModal(true)}
                  className='bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628]'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add First Flight
                </Button>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full card-premium'>
                  <thead>
                    <tr className='border-b border-[#EDE9E0]'>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Flight</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Route</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Departure</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Arrival</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Fare</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Seats</th>
                      <th className='text-right p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map(flight => (
                      <tr key={flight.id} className='border-b border-[#EDE9E0] hover:bg-[#F1F4F8]'>
                        <td className='p-4'>
                          <p className='font-bold text-[#0A1628]'>{flight.flightNumber}</p>
                          <p className='text-sm text-[#64748B]'>{flight.airlineName}</p>
                        </td>
                        <td className='p-4'>
                          <p className='font-semibold text-[#0A1628]'>{flight.source} → {flight.destination}</p>
                        </td>
                        <td className='p-4 text-sm text-[#0A1628]'>
                          {formatDateTime(flight.departureTime)}
                        </td>
                        <td className='p-4 text-sm text-[#0A1628]'>
                          {formatDateTime(flight.arrivalTime)}
                        </td>
                        <td className='p-4 font-semibold text-[#C9A84C]'>
                          ₹{Math.round(flight.fare).toLocaleString()}
                        </td>
                        <td className='p-4 text-[#0A1628]'>
                          {flight.totalSeats}
                        </td>
                        <td className='p-4 text-right'>
                          <div className='flex gap-2 justify-end'>
                            <button
                              onClick={() => handleEdit(flight)}
                              className='p-2 rounded-lg hover:bg-[#F1F4F8] text-[#64748B] hover:text-[#0A1628]'
                            >
                              <Pencil className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleDelete(flight.id)}
                              className='p-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            {loading && bookings.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-lg text-[#64748B]'>Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className='text-center py-12 card-premium'>
                <p className='text-lg text-[#64748B]'>No bookings found</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full card-premium'>
                  <thead>
                    <tr className='border-b border-[#EDE9E0]'>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Booking Ref</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>User ID</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Flight</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Route</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Seats</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Amount</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Status</th>
                      <th className='text-left p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Date</th>
                      <th className='text-right p-4 text-xs font-bold text-[#64748B] uppercase tracking-widest'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className='border-b border-[#EDE9E0] hover:bg-[#F1F4F8]'>
                        <td className='p-4'>
                          <p className='font-bold text-[#0A1628]'>{booking.bookingRef || booking.id}</p>
                        </td>
                        <td className='p-4 text-sm text-[#0A1628]'>{booking.userId}</td>
                        <td className='p-4 text-sm text-[#0A1628]'>
                          {booking.airline ? booking.airline : booking.flightId ? `Flight ID: ${booking.flightId}` : 'N/A'}
                        </td>
                        <td className='p-4'>
                          {booking.from && booking.to ? (
                            <p className='font-semibold text-[#0A1628]'>{booking.from} → {booking.to}</p>
                          ) : booking.flightId ? (
                            <p className='font-semibold text-red-500'>Missing (Flight ID: {booking.flightId})</p>
                          ) : (
                            <p className='font-semibold text-red-500'>N/A</p>
                          )}
                        </td>
                        <td className='p-4 text-[#0A1628]'>{booking.seatCount}</td>
                        <td className='p-4 font-semibold text-[#C9A84C]'>₹{Math.round(booking.totalAmount).toLocaleString()}</td>
                        <td className='p-4'>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className='p-4 text-sm text-[#0A1628]'>{formatDateTime(booking.bookingDate)}</td>
                        <td className='p-4 text-right'>
                          <div className='flex gap-2 justify-end'>
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className='p-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600'
                                title='Cancel Booking'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className='p-2 rounded-lg hover:bg-red-100 text-[#64748B] hover:text-red-700'
                              title='Delete Permanently'
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-[#0A1628]' style={{ fontFamily: 'var(--f-display)' }}>
                  {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                </h2>
                <button onClick={() => setShowModal(false)} className='p-2 hover:bg-[#F1F4F8] rounded-lg'>
                  <X className='w-5 h-5' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                    Flight Number
                  </label>
                  <input
                    type='text'
                    value={formData.flightNumber}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    placeholder='SK-101'
                    className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                    required
                  />
                </div>

                <div>
                  <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                    Airline Name
                  </label>
                  <input
                    type='text'
                    value={formData.airlineName}
                    onChange={(e) => setFormData({ ...formData, airlineName: e.target.value })}
                    placeholder='SkyAir'
                    className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                      Source
                    </label>
                    <input
                      type='text'
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      placeholder='Delhi'
                      className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                      Destination
                    </label>
                    <input
                      type='text'
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder='Mumbai'
                      className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                      Departure Time
                    </label>
                    <input
                      type='datetime-local'
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                      Arrival Time
                    </label>
                    <input
                      type='datetime-local'
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                      Fare (₹)
                    </label>
                    <input
                      type='number'
                      value={formData.fare || ''}
                      onChange={(e) => setFormData({ ...formData, fare: e.target.value ? parseFloat(e.target.value) : 0 })}
                      placeholder='3299'
                      className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block'>
                      Total Seats
                    </label>
                    <input
                      type='number'
                      value={formData.totalSeats || ''}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value ? parseInt(e.target.value) : 0 })}
                      placeholder='180'
                      className='w-full px-4 py-3 border border-[#EDE9E0] rounded-lg focus:border-[#C9A84C] focus:outline-none'
                      required
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={submitting}
                  className='w-full bg-gradient-to-r from-[#C9A84C] to-[#A08535] text-[#0A1628] hover:shadow-lg disabled:opacity-50'
                >
                  {submitting ? 'Saving...' : editingFlight ? 'Update Flight' : 'Add Flight'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}