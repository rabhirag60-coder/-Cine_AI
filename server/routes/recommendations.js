const express = require('express');
const router = express.Router();
const {
  generateRecommendations,
  getRecommendationHistory,
  getRecommendation,
  getMoodOptions,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// Public route
router.get('/moods', getMoodOptions);

// Protected routes
router.post('/', protect, generateRecommendations);
router.get('/', protect, getRecommendationHistory);
router.get('/:id', protect, getRecommendation);

module.exports = router;

