const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => jwt.sign(
  { id, role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' },
);

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      preferredGenres = [],
      preferredLanguages = [],
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      preferredGenres,
      preferredLanguages,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredGenres: user.preferredGenres,
      preferredLanguages: user.preferredLanguages,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error registering user' });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredGenres: user.preferredGenres,
      preferredLanguages: user.preferredLanguages,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error logging in' });
  }
};

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};


