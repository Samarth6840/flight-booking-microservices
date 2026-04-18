import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090';

let redirectToAuth: ((path: string) => void) | null = null;
export const setRedirectFn = (fn: (path: string) => void) => { redirectToAuth = fn; };

function getToken(): string | null {
  const matches = document.cookie.match(/app_token=([^;]+)/);
  return matches ? matches[1] : null;
}

function setToken(token: string): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `app_token=${token};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function clearToken(): void {
  document.cookie = 'app_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
}

function getUserFromToken(): { id: number; name: string; email: string; role: string } | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: parseInt(payload.sub),
      name: payload.name || '',
      email: payload.email || '',
      role: payload.role || 'USER'
    };
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
      if (redirectToAuth) redirectToAuth('/auth');
    }
    return Promise.reject(error);
  }
);

const normalizeFlight = (flight: any) => ({
  ...flight,
  from: flight.source || flight.from || '',
  to: flight.destination || flight.to || '',
  airline: flight.airlineName || flight.airline || '',
  price: flight.price || `₹${(flight.fare || 0).toLocaleString()}`,
  time: flight.time || formatDuration(flight.departureTime, flight.arrivalTime),
  departure: flight.departure || flight.departureTime?.split('T')[1]?.slice(0, 5) || '',
  arrival: flight.arrival || flight.arrivalTime?.split('T')[1]?.slice(0, 5) || '',
});

const formatDuration = (dep: string, arr: string) => {
  if (!dep || !arr) return '2h 00m';
  const d = new Date(dep);
  const a = new Date(arr);
  const diff = Math.abs(a.getTime() - d.getTime());
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
};

const normalizeBooking = async (booking: any) => {
  const flight = await api.get(`/flights/${booking.flightId}`).then(r => r.data).catch(() => ({}));
  const amount = booking.totalAmount ?? flight.fare * booking.seatCount ?? 0;
  return {
    ...booking,
    from: booking.from || flight.source,
    to: booking.to || flight.destination,
    airline: booking.airline || flight.airlineName,
    date: booking.date || booking.bookingDate?.split('T')[0],
    departure: booking.departure || flight.departureTime?.split('T')[1]?.slice(0, 5),
    arrival: booking.arrival || flight.arrivalTime?.split('T')[1]?.slice(0, 5),
    price: booking.price || `₹${(amount || 0).toLocaleString()}`,
    passengers: booking.passengers || booking.seatCount || 1,
    passengerCount: booking.passengerCount || booking.seatCount || 1,
    totalPrice: booking.totalPrice || `₹${(amount || 0).toLocaleString()}`,
    departureTime: flight.departureTime?.split('T')[1]?.slice(0, 5),
    arrivalTime: flight.arrivalTime?.split('T')[1]?.slice(0, 5),
  };
};

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/users/register', data);
  if (response.data.token) {
    setToken(response.data.token);
  }
  return response;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/users/login', data);
  if (response.data.token) {
    setToken(response.data.token);
  }
  return response;
};

export const getUserById = (id: number) => api.get(`/users/${id}`);

export const getAllFlights = () =>
  api.get('/flights').then(r => (r.data || []).map(normalizeFlight));

export const searchFlights = (source: string, destination: string, date: string) =>
  api.get('/flights/search', { params: { source, destination, date } }).then(r => (r.data || []).map(normalizeFlight));

export const getFlightById = (id: number) =>
  api.get(`/flights/${id}`).then(r => normalizeFlight(r.data));

export const createBooking = (data: { userId: number; flightId: number; seatCount: number }) =>
  api.post('/bookings', data);

export const getBookingById = (id: number) =>
  api.get(`/bookings/${id}`).then(r => normalizeBooking(r.data));

export const getUserBookings = (userId: number) =>
  api.get(`/bookings/user/${userId}`).then(async r => {
    const bookings = r.data || [];
    return Promise.all(bookings.map(normalizeBooking));
  });

export const cancelBooking = (id: number) => api.delete(`/bookings/${id}`);

export const deleteBookingPermanently = (id: number) => api.delete(`/bookings/${id}/permanent`);

export const getPaymentByBookingId = (bookingId: number) =>
  api.get(`/payments/booking/${bookingId}`);

export const getStoredUser = getUserFromToken;
export const clearStoredUser = clearToken;

export const userApi = {
  login: loginUser,
  register: registerUser,
  getById: getUserById,
};

export const flightApi = {
  getAll: () => getAllFlights(),
  search: searchFlights,
  getById: (id: number) => getFlightById(id),
  create: (data: any) => api.post('/flights', data).then(r => normalizeFlight(r.data)),
  update: (id: number, data: any) => api.put(`/flights/${id}`, data).then(r => normalizeFlight(r.data)),
  delete: (id: number) => api.delete(`/flights/${id}`),
};

export const bookingApi = {
  getAll: (userId: number) => getUserBookings(userId),
  getById: (id: number) => getBookingById(id).then(r => normalizeBooking(r.data)),
  create: createBooking,
  cancel: cancelBooking,
  deletePermanently: deleteBookingPermanently,
  adminGetAll: () => api.get('/bookings').then(async r => {
    const bookings = r.data || [];
    return Promise.all(bookings.map(normalizeBooking));
  }),
};

export default api;
