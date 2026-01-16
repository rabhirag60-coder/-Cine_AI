const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovie,
  searchTMDBMovies,
  getPopularTMDBMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { rateMovie, getMovieRating } = require('../controllers/ratingController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getMovies);
router.get('/search/tmdb', searchTMDBMovies);
router.get('/popular/tmdb', getPopularTMDBMovies);
router.get('/:id', getMovie);

// Rating routes (protected)
router.get('/:id/rating', protect, getMovieRating);
router.post('/:id/rate', protect, rateMovie);

// Protected/Admin routes
router.post('/', protect, admin, addMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;

