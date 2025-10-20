import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// If no API URL is provided, we provide a frontend-only mock implementation
const useMock = !API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Types used by the mock implementations */
type Route = {
  id: string;
  busNumber: string;
  operator: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  fare: number;
  stops: string[];
  frequency: string;
  rating: number;
};

type Bus = { id: string; number: string; location: { lat: number; lng: number }; routeId: string };

type Ticket = { id: string } & Record<string, unknown>;

type ApiResponse<T> = Promise<{ data: T }>;

/* Mock helpers - synchronous stubs that mimic axios response shape */
const mockResponse = <T,>(data: T): ApiResponse<T> => Promise.resolve({ data });

// Example mock datasets (small, deterministic)
const MOCK_ROUTES: Route[] = [
  {
    id: '1',
    busNumber: '81',
    operator: 'West Bengal Transport',
    from: 'Barasat',
    to: 'Barrackpore',
    departure: '08:00 AM',
    arrival: '09:30 AM',
    duration: '1h 30m',
    fare: 25,
    stops: ['Barasat', 'Madhyamgram', 'Sodepur', 'Barrackpore'],
    frequency: 'Every 15 mins',
    rating: 4.5,
  },
  {
    id: '2',
    busNumber: '42E',
    operator: 'Kolkata Transit',
    from: 'Howrah',
    to: 'Salt Lake',
    departure: '09:15 AM',
    arrival: '10:45 AM',
    duration: '1h 30m',
    fare: 30,
    stops: ['Howrah', 'Maidan', 'Park Street', 'Salt Lake'],
    frequency: 'Every 20 mins',
    rating: 4.7,
  },
];

const MOCK_BUSES: Bus[] = [
  { id: '1', number: '81', location: { lat: 22.6447, lng: 88.4342 }, routeId: '1' },
  { id: '2', number: '42E', location: { lat: 22.5698, lng: 88.3631 }, routeId: '2' },
];

const MOCK_TICKETS: Ticket[] = [];

export const routesApi = useMock
  ? {
    getAll: () => mockResponse(MOCK_ROUTES),
    getById: (id: string) => mockResponse(MOCK_ROUTES.find((r) => r.id === id)),
    search: (from: string, to: string) =>
      mockResponse(
        MOCK_ROUTES.filter((r) => {
          const f = from ? from.toLowerCase() : '';
          const t = to ? to.toLowerCase() : '';
          if (!f && !t) return true;
          return (
            (f && r.from.toLowerCase().includes(f)) ||
            (t && r.to.toLowerCase().includes(t)) ||
            `${r.from} ${r.to}`.toLowerCase().includes(`${f} ${t}`.trim())
          );
        })
      ),
  }
  : {
    getAll: () => api.get('/routes'),
    getById: (id: string) => api.get(`/routes/${id}`),
    search: (from: string, to: string) => api.get(`/routes/search?from=${from}&to=${to}`),
  };

export const busApi = useMock
  ? {
    getLocation: (busId: string) => mockResponse(MOCK_BUSES.find((b) => b.id === busId)?.location),
    getAll: () => mockResponse(MOCK_BUSES),
  }
  : {
    getLocation: (busId: string) => api.get(`/buses/${busId}/location`),
    getAll: () => api.get('/buses'),
  };

export const ticketsApi = useMock
  ? {
    book: (data: Record<string, unknown>) => {
      const id = 'BBS' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const ticket: Ticket = { id, ...data } as Ticket;
      MOCK_TICKETS.push(ticket);
      return mockResponse(ticket);
    },
    getMyTickets: () => mockResponse(MOCK_TICKETS),
    getById: (id: string) => mockResponse(MOCK_TICKETS.find((t) => t.id === id)),
  }
  : {
    book: (data: Record<string, unknown>) => api.post('/tickets', data),
    getMyTickets: () => api.get('/tickets/me'),
    getById: (id: string) => api.get(`/tickets/${id}`),
  };

export const authApi = useMock
  ? {
    // accept password param to match real API signature; password is ignored by mock
    login: (email: string, password?: string) => {
      void password;
      // Return no user for mock login
      return mockResponse({ user: null, token: null });
    },
    signup: (name: string, email: string, password?: string) => {
      void password;
      // Return no user for mock signup
      return mockResponse({ user: null, token: null });
    },
    logout: () => mockResponse({ ok: true }),
  }
  : {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    signup: (name: string, email: string, password: string) =>
      api.post('/auth/signup', { name, email, password }),
    logout: () => api.post('/auth/logout'),
  };

export default api;
