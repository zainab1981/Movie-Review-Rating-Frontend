// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// API endpoints
export const ENDPOINTS = {
  auth: {
    login: "/users/auth",
    register: "/users/",
  },
  movies: {
    list: "/movies",
    details: (id) => `/movies/${id}`,
    create: "/movies",
    update: (id) => `/movies/${id}`,
    delete: (id) => `/movies/${id}`,
  },
  reviews: {
    list: (movieId) => `/movies/${movieId}/reviews`,
    create: (movieId) => `/movies/${movieId}/reviews`,
    delete: (movieId) => `/movies/${movieId}/reviews`,
  },
  profile: {
    get: "/users/profile",
    update: "/users/profile",
  },
};

// API client with authentication
export const apiClient = {
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  },

  // Auth methods
  async login(credentials) {
    const response = await this.request(ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("token", response.token);
    localStorage.setItem("isLoggedIn", "true");
    return response;
  },

  async register(userData) {
    const response = await this.request(ENDPOINTS.auth.register, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    localStorage.setItem("token", response.token);
    localStorage.setItem("isLoggedIn", "true");
    return response;
  },

  // Movie methods
  getMovies() {
    return this.request(ENDPOINTS.movies.list);
  },

  getMovie(id) {
    return this.request(ENDPOINTS.movies.details(id));
  },

  createMovie(movieData) {
    return this.request(ENDPOINTS.movies.create, {
      method: "POST",
      body: JSON.stringify(movieData),
    });
  },

  updateMovie(id, movieData) {
    return this.request(ENDPOINTS.movies.update(id), {
      method: "PUT",
      body: JSON.stringify(movieData),
    });
  },

  deleteMovie(id) {
    return this.request(ENDPOINTS.movies.delete(id), {
      method: "DELETE",
    });
  },

  // Review methods
  getReviews(movieId) {
    return this.request(ENDPOINTS.reviews.list(movieId));
  },

  createReview(movieId, reviewData) {
    return this.request(ENDPOINTS.reviews.create(movieId), {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  // Profile methods
  getProfile() {
    return this.request(ENDPOINTS.profile.get);
  },

  async updateProfile(profileData) {
    try {
      const response = await this.request(ENDPOINTS.profile.update, {
        method: "PUT",
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          ...(profileData.currentPassword && {
            currentPassword: profileData.currentPassword,
            newPassword: profileData.newPassword,
          }),
        }),
      });

      // If the response includes a new token, update it
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      return response.user || response;
    } catch (error) {
      // Enhance error handling
      const message = error.message || "Failed to update profile";
      throw new Error(message);
    }
  },
};
