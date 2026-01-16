const User = require('../models/User');
const Movie = require('../models/Movie');
const Recommendation = require('../models/Recommendation');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get popular genres
    const movies = await Movie.find({});
    const genreCounts = {};
    movies.forEach((movie) => {
      movie.genre.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    // Get most watched movies (by watchHistory count)
    const users = await User.find({}).populate('watchHistory');
    const movieWatchCounts = {};
    users.forEach((user) => {
      user.watchHistory.forEach((movie) => {
        const movieId = movie._id.toString();
        movieWatchCounts[movieId] = (movieWatchCounts[movieId] || 0) + 1;
      });
    });
    const topWatchedMovies = Object.entries(movieWatchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get movie details for top watched
    const topWatchedMovieIds = topWatchedMovies.map(([id]) => id);
    const topWatchedMoviesData = await Movie.find({
      _id: { $in: topWatchedMovieIds },
    }).limit(5);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          recent: recentUsers,
        },
        movies: {
          total: totalMovies,
        },
        recommendations: {
          total: totalRecommendations,
        },
        topGenres,
        topWatchedMovies: topWatchedMoviesData.map((movie, index) => ({
          movie,
          watchCount: topWatchedMovies[index][1],
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('watchHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// @desc    Update user (role, etc.)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { role, preferredGenres, preferredLanguages } = req.body;
    const updateData = {};

    if (role !== undefined) {
      updateData.role = role;
    }
    if (preferredGenres !== undefined) {
      updateData.preferredGenres = preferredGenres;
    }
    if (preferredLanguages !== undefined) {
      updateData.preferredLanguages = preferredLanguages;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// @desc    Get all movies (admin view)
// @route   GET /api/admin/movies
// @access  Private/Admin
const getAdminMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const movies = await Movie.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

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

module.exports = {
  getStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAdminMovies,
};

