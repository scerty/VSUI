/**
 * API Service for SSB Backend
 * Handles all HTTP requests to the Django API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Type definitions
export interface Activity {
  id?: string;
  date: string;
  year: string;
  title: string;
  description: string;
  activity_type: string;
  time: string;
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id?: number;
  category?: number;
  category_name?: string;
  category_color?: string;
  author?: number;
  author_name?: string;
  author_image?: string;
  author_bio?: string;
  date: string;
  views?: number;
  title: string;
  description: string;
  content?: string;
  image: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id?: number;
  name: string;
  image?: string;
  bio?: string;
  email?: string;
  created_at?: string;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  created_at?: string;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
  attendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at?: string;
  updated_at?: string;
}

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

// =====================
// ACTIVITIES ENDPOINTS
// =====================

export const activitiesAPI = {
  // Get all activities
  getAll: (params?: { search?: string; ordering?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/activities/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiCall(endpoint);
  },

  // Get upcoming activities
  getUpcoming: () => apiCall('/activities/upcoming/'),

  // Get single activity
  getById: (id: string) => apiCall(`/activities/${id}/`),

  // Create activity
  create: (data: Omit<Activity, 'id'>) =>
    apiCall('/activities/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update activity
  update: (id: string, data: Partial<Activity>) =>
    apiCall(`/activities/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete activity
  delete: (id: string) =>
    apiCall(`/activities/${id}/`, { method: 'DELETE' }),
};

// =====================
// NEWS ENDPOINTS
// =====================

export const newsAPI = {
  // Get all news
  getAll: (params?: { search?: string; ordering?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/news/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiCall(endpoint);
  },

  // Get latest news
  getLatest: () => apiCall('/news/latest/'),

  // Get trending news
  getTrending: () => apiCall('/news/trending/'),

  // Get news by category
  getByCategory: (category: string) =>
    apiCall(`/news/by_category/?category=${encodeURIComponent(category)}`),

  // Get single news article
  getById: (id: string) => apiCall(`/news/${id}/`),

  // Create news article
  create: (data: Omit<News, 'id'>) =>
    apiCall('/news/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update news article
  update: (id: string, data: Partial<News>) =>
    apiCall(`/news/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete news article
  delete: (id: string) =>
    apiCall(`/news/${id}/`, { method: 'DELETE' }),

  // Increment views
  incrementViews: (id: string) =>
    apiCall(`/news/${id}/increment_views/`, { method: 'POST' }),
};

// =====================
// EVENTS ENDPOINTS
// =====================

export const eventsAPI = {
  // Get all events
  getAll: (params?: { search?: string; ordering?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/events/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiCall(endpoint);
  },

  // Get upcoming events
  getUpcoming: () => apiCall('/events/upcoming_events/'),

  // Get ongoing events
  getOngoing: () => apiCall('/events/ongoing_events/'),

  // Get single event
  getById: (id: string) => apiCall(`/events/${id}/`),

  // Create event
  create: (data: Omit<Event, 'id'>) =>
    apiCall('/events/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update event
  update: (id: string, data: Partial<Event>) =>
    apiCall(`/events/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete event
  delete: (id: string) =>
    apiCall(`/events/${id}/`, { method: 'DELETE' }),

  // Register attendee
  registerAttendee: (id: string) =>
    apiCall(`/events/${id}/register_attendee/`, { method: 'POST' }),
};

// =====================
// AUTHORS ENDPOINTS
// =====================

export const authorsAPI = {
  // Get all authors
  getAll: () => apiCall('/authors/'),

  // Get single author
  getById: (id: number) => apiCall(`/authors/${id}/`),

  // Create author
  create: (data: Omit<Author, 'id'>) =>
    apiCall('/authors/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update author
  update: (id: number, data: Partial<Author>) =>
    apiCall(`/authors/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete author
  delete: (id: number) =>
    apiCall(`/authors/${id}/`, { method: 'DELETE' }),
};

// =====================
// CATEGORIES ENDPOINTS
// =====================

export const categoriesAPI = {
  // Get all categories
  getAll: () => apiCall('/categories/'),

  // Get single category
  getById: (id: number) => apiCall(`/categories/${id}/`),

  // Create category
  create: (data: Omit<Category, 'id'>) =>
    apiCall('/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update category
  update: (id: number, data: Partial<Category>) =>
    apiCall(`/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete category
  delete: (id: number) =>
    apiCall(`/categories/${id}/`, { method: 'DELETE' }),
};
