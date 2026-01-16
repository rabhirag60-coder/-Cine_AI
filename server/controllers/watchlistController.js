const User = require('../models/User');
const Movie = require('../models/Movie');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchHistory');
    
    res.json({
      success: true,
      count: user.watchHistory.length,
      data: user.watchHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist',
      error: error.message,
    });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a movie ID',
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
    
    // Check if already in watchlist
    if (user.watchHistory.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist',
      });
    }

    // Add to watchlist
    user.watchHistory.push(movieId);
    await user.save();

    await user.populate('watchHistory');

    res.json({
      success: true,
      message: 'Movie added to watchlist',
      data: user.watchHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to watchlist',
      error: error.message,
    });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    // Remove from watchlist
    user.watchHistory = user.watchHistory.filter(
      id => id.toString() !== movieId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Movie removed from watchlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from watchlist',
      error: error.message,
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};

