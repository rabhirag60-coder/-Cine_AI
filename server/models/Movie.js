const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a movie title'],
    trim: true,
  },
  genre: {
    type: [String],
    required: true,
    default: [],
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  posterURL: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  popularityScore: {
    type: Number,
    default: 0,
  },
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true, // Allows null values but enforces uniqueness when present
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Movie', movieSchema);

