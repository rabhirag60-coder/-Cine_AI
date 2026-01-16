const Recommendation = require('../models/Recommendation');
const recommendationEngine = require('../services/recommendationEngine');

// @desc    Generate recommendations based on mood
// @route   POST /api/recommendations
// @access  Private
const generateRecommendations = async (req, res) => {
  try {
    const { mood } = req.body;
    const userId = req.user.id;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a mood',
      });
    }

    // Generate recommendations
    const recommendedMovies = await recommendationEngine.generateRecommendations(
      userId,
      mood,
      20
    );

    // Save recommendation to history
    const recommendation = await Recommendation.create({
      userId,
      mood,
      recommendedMovies: recommendedMovies.map(m => m._id),
    });

    // Populate movie details
    await recommendation.populate('recommendedMovies');

    res.json({
      success: true,
      data: {
        recommendation: recommendation,
        movies: recommendedMovies,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message,
    });
  }
};

// @desc    Get user's recommendation history
// @route   GET /api/recommendations
// @access  Private
const getRecommendationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await Recommendation.find({ userId })
      .populate('recommendedMovies')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendation history',
      error: error.message,
    });
  }
};

// @desc    Get single recommendation by ID
// @route   GET /api/recommendations/:id
// @access  Private
const getRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
      .populate('recommendedMovies');

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found',
      });
    }

    // Check if user owns this recommendation
    if (recommendation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this recommendation',
      });
    }

    res.json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendation',
      error: error.message,
    });
  }
};

// @desc    Get available mood options
// @route   GET /api/recommendations/moods
// @access  Public
const getMoodOptions = async (req, res) => {
  try {
    const moods = recommendationEngine.getMoodOptions();
    res.json({
      success: true,
      data: moods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood options',
      error: error.message,
    });
  }
};

module.exports = {
  generateRecommendations,
  getRecommendationHistory,
  getRecommendation,
  getMoodOptions,
};

