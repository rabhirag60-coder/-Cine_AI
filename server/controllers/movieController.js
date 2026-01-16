const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdbService');

// @desc    Get all movies from database
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const { search, genre, language, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre) {
      query.genre = { $in: [genre] };
    }
    if (language) {
      query.language = language;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const movies = await Movie.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ popularityScore: -1, createdAt: -1 });

    const total = await Movie.countDocuments(query);

    res.json({
      success: true,
      count: movies.length,
      total,
      page: parseInt(page),
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movies',
      error: error.message,
    });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movie',
      error: error.message,
    });
  }
};

// @desc    Search movies from TMDB and optionally save to DB
// @route   GET /api/movies/search/tmdb
// @access  Public
const searchTMDBMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }

    const tmdbResults = await tmdbService.searchMovies(query, page);
    const transformedMovies = tmdbResults.results.map(movie => 
      tmdbService.transformMovieData(movie)
    );

    res.json({
      success: true,
      count: transformedMovies.length,
      total: tmdbResults.total_results,
      page: tmdbResults.page,
      totalPages: tmdbResults.total_pages,
      data: transformedMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get popular movies from TMDB
// @route   GET /api/movies/popular/tmdb
// @access  Public
const getPopularTMDBMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const tmdbResults = await tmdbService.getPopularMovies(page);
    const transformedMovies = tmdbResults.results.map(movie => 
      tmdbService.transformMovieData(movie)
    );

    res.json({
      success: true,
      count: transformedMovies.length,
      page: tmdbResults.page,
      totalPages: tmdbResults.total_pages,
      data: transformedMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add movie to database (from TMDB or manual)
// @route   POST /api/movies
// @access  Private/Admin
const addMovie = async (req, res) => {
  try {
    const { tmdbId, ...movieData } = req.body;

    // If tmdbId provided, fetch from TMDB first
    if (tmdbId) {
      const tmdbMovie = await tmdbService.getMovieDetails(tmdbId);
      const transformedMovie = tmdbService.transformMovieData(tmdbMovie);
      
      // Check if movie already exists
      const existingMovie = await Movie.findOne({ tmdbId });
      if (existingMovie) {
        return res.status(400).json({
          success: false,
          message: 'Movie already exists in database',
          data: existingMovie,
        });
      }

      const movie = await Movie.create(transformedMovie);
      return res.status(201).json({
        success: true,
        data: movie,
      });
    }

    // Manual movie creation
    const movie = await Movie.create(movieData);
    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Movie already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating movie',
      error: error.message,
    });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating movie',
      error: error.message,
    });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting movie',
      error: error.message,
    });
  }
};

module.exports = {
  getMovies,
  getMovie,
  searchTMDBMovies,
  getPopularTMDBMovies,
  addMovie,
  updateMovie,
  deleteMovie,
};

