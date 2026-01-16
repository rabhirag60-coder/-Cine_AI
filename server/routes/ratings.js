const express = require('express');
const router = express.Router();
const {
  rateMovie,
  getUserRatings,
  getMovieRating,
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserRatings);
router.get('/:movieId', protect, getMovieRating);

module.exports = router;

