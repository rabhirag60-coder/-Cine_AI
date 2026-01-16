import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // Auth
  async register(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async login(credentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  async getMe() {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  },

  // Users
  async getProfile() {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  },

  async updateProfile(data) {
    const response = await axios.put(`${API_URL}/users/profile`, data);
    return response.data;
  },

  // Movies
  async getMovies(params = {}) {
    const response = await axios.get(`${API_URL}/movies`, { params });
    return response.data;
  },

  async getMovie(id) {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  },

  async searchTMDBMovies(query, page = 1) {
    const response = await axios.get(`${API_URL}/movies/search/tmdb`, {
      params: { query, page },
    });
    return response.data;
  },

  async getPopularTMDBMovies(page = 1) {
    const response = await axios.get(`${API_URL}/movies/popular/tmdb`, {
      params: { page },
    });
    return response.data;
  },

  // Recommendations
  async getMoodOptions() {
    const response = await axios.get(`${API_URL}/recommendations/moods`);
    return response.data;
  },

  async generateRecommendations(mood) {
    const response = await axios.post(`${API_URL}/recommendations`, { mood });
    return response.data;
  },

  async getRecommendationHistory() {
    const response = await axios.get(`${API_URL}/recommendations`);
    return response.data;
  },

  async getRecommendation(id) {
    const response = await axios.get(`${API_URL}/recommendations/${id}`);
    return response.data;
  },

  // Watchlist
  async getWatchlist() {
    const response = await axios.get(`${API_URL}/watchlist`);
    return response.data;
  },

  async addToWatchlist(movieId) {
    const response = await axios.post(`${API_URL}/watchlist`, { movieId });
    return response.data;
  },

  async removeFromWatchlist(movieId) {
    const response = await axios.delete(`${API_URL}/watchlist/${movieId}`);
    return response.data;
  },

  // Ratings
  async rateMovie(movieId, rating) {
    const response = await axios.post(`${API_URL}/movies/${movieId}/rate`, { rating });
    return response.data;
  },

  async getMovieRating(movieId) {
    const response = await axios.get(`${API_URL}/movies/${movieId}/rating`);
    return response.data;
  },

  async getUserRatings() {
    const response = await axios.get(`${API_URL}/ratings`);
    return response.data;
  },
};

export default api;

