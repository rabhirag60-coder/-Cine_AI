const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAdminMovies,
} = require('../controllers/adminController');
const {
  addMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Stats
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Movies
router.get('/movies', getAdminMovies);
router.post('/movies', addMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

module.exports = router;

