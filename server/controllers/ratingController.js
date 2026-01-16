const User = require('../models/User');
const Movie = require('../models/Movie');

// @desc    Rate a movie
// @route   POST /api/movies/:movieId/rate
// @access  Private
const rateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    const user = await User.findById(req.user.id);
    
    // Update rating
    user.ratings.set(movieId, rating);
    await user.save();

    res.json({
      success: true,
      message: 'Movie rated successfully',
      data: {
        movieId,
        rating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rating movie',
      error: error.message,
    });
  }
};

// @desc    Get user's ratings
// @route   GET /api/ratings
// @access  Private
const getUserRatings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const ratings = {};
    
    // Convert Map to object
    user.ratings.forEach((rating, movieId) => {
      ratings[movieId] = rating;
    });

    // Get movie details for rated movies
    const movieIds = Object.keys(ratings);
    const movies = await Movie.find({ _id: { $in: movieIds } });
    
    const ratingsWithMovies = movies.map(movie => ({
      movie: movie,
      rating: ratings[movie._id.toString()],
    }));

    res.json({
      success: true,
      count: ratingsWithMovies.length,
      data: ratingsWithMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message,
    });
  }
};

// @desc    Get movie rating by user
// @route   GET /api/movies/:movieId/rating
// @access  Private
const getMovieRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    
    const rating = user.ratings.get(movieId);

    res.json({
      success: true,
      data: {
        movieId,
        rating: rating || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rating',
      error: error.message,
    });
  }
};

module.exports = {
  rateMovie,
  getUserRatings,
  getMovieRating,
};

