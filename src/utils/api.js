const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('traveai_token');

// Generic fetch wrapper with auth
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Auth API
export const authAPI = {
    register: (userData) => fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    login: (credentials) => fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    getProfile: () => fetchWithAuth('/auth/me'),

    updateProfile: (updates) => fetchWithAuth('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
    }),
};

// Trips API
export const tripsAPI = {
    generate: (tripData) => fetchWithAuth('/trips/generate', {
        method: 'POST',
        body: JSON.stringify(tripData),
    }),

    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchWithAuth(`/trips${query ? `?${query}` : ''}`);
    },

    getById: (id) => fetchWithAuth(`/trips/${id}`),

    update: (id, updates) => fetchWithAuth(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    }),

    delete: (id) => fetchWithAuth(`/trips/${id}`, {
        method: 'DELETE',
    }),
};

// Destinations API
export const destinationsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchWithAuth(`/destinations${query ? `?${query}` : ''}`);
    },

    getById: (id) => fetchWithAuth(`/destinations/${id}`),
};

// Bookings API
export const bookingsAPI = {
    searchHotels: (searchData) => fetchWithAuth('/bookings/hotels', {
        method: 'POST',
        body: JSON.stringify(searchData),
    }),

    searchFlights: (searchData) => fetchWithAuth('/bookings/flights', {
        method: 'POST',
        body: JSON.stringify(searchData),
    }),

    getHistory: (type) => fetchWithAuth(`/bookings/history${type ? `?type=${type}` : ''}`),

    clearHistory: () => fetchWithAuth('/bookings/history', {
        method: 'DELETE',
    }),
};

// Health check
export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};

export default {
    auth: authAPI,
    trips: tripsAPI,
    destinations: destinationsAPI,
    bookings: bookingsAPI,
    checkHealth,
};
