const axios = require('axios');

// TMDB API Base URL
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
// For demo purposes, using a public API key. In production, store this in .env
// You can get a free API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = process.env.TMDB_API_KEY || '1f54bd990f1cdfb230adb312546d765d'; // Public demo key

const tmdbService = {
  // Search movies by query
  async searchMovies(query, page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          page: page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('TMDB Search Error:', error.message);
      throw new Error('Failed to search movies from TMDB');
    }
  },

  // Get movie details by TMDB ID
  async getMovieDetails(tmdbId) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('TMDB Details Error:', error.message);
      throw new Error('Failed to fetch movie details from TMDB');
    }
  },

  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page: page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('TMDB Popular Error:', error.message);
      throw new Error('Failed to fetch popular movies from TMDB');
    }
  },

  // Get movies by genre
  async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreId,
          page: page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('TMDB Genre Error:', error.message);
      throw new Error('Failed to fetch movies by genre from TMDB');
    }
  },

  // Transform TMDB movie data to our Movie schema format
  transformMovieData(tmdbMovie) {
    return {
      title: tmdbMovie.title || tmdbMovie.name,
      genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids.map(id => this.getGenreName(id)) : [],
      language: tmdbMovie.original_language || 'en',
      releaseYear: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : null,
      posterURL: tmdbMovie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` 
        : null,
      description: tmdbMovie.overview || '',
      popularityScore: tmdbMovie.popularity || 0,
      tmdbId: tmdbMovie.id,
    };
  },

  // Get genre name from ID (simplified - TMDB has genre list endpoint)
  getGenreName(genreId) {
    const genres = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    };
    return genres[genreId] || 'Unknown';
  },
};

module.exports = tmdbService;

