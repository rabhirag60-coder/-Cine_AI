const Movie = require('../models/Movie');
const User = require('../models/User');

// Mood to genre mapping (simplified rule-based)
const moodToGenres = {
  happy: ['Comedy', 'Family', 'Music', 'Animation'],
  sad: ['Drama', 'Romance'],
  excited: ['Action', 'Adventure', 'Thriller', 'Science Fiction'],
  relaxed: ['Drama', 'Documentary', 'Romance'],
  romantic: ['Romance', 'Drama', 'Comedy'],
  thrilled: ['Thriller', 'Horror', 'Action', 'Mystery'],
  nostalgic: ['Drama', 'History', 'Family'],
  anxious: ['Thriller', 'Horror', 'Mystery'],
};

// Recommendation engine (rule-based for demo)
const recommendationEngine = {
  // Generate recommendations based on mood and user preferences
  async generateRecommendations(userId, mood, limit = 20) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get mood-based genres
      const moodGenres = moodToGenres[mood.toLowerCase()] || ['Drama', 'Comedy'];
      
      // Combine user preferences with mood genres
      const preferredGenres = user.preferredGenres.length > 0 
        ? user.preferredGenres 
        : moodGenres;
      
      // Get watch history IDs to exclude
      const watchedMovieIds = user.watchHistory.map(id => id.toString());
      
      // Build query
      const query = {
        // Match genres (at least one genre should match)
        genre: { $in: preferredGenres },
      };
      
      // Filter by preferred languages if user has preferences
      if (user.preferredLanguages.length > 0) {
        query.language = { $in: user.preferredLanguages };
      }
      
      // Get movies matching criteria
      let movies = await Movie.find(query)
        .sort({ popularityScore: -1, releaseYear: -1 })
        .limit(limit * 2); // Get more to filter out watched ones
      
      // Filter out already watched movies
      movies = movies.filter(movie => !watchedMovieIds.includes(movie._id.toString()));
      
      // If user has ratings, prioritize movies similar to highly rated ones
      if (user.ratings && user.ratings.size > 0) {
        // Get highly rated movies (rating >= 4)
        const highlyRatedMovieIds = [];
        user.ratings.forEach((rating, movieId) => {
          if (rating >= 4) {
            highlyRatedMovieIds.push(movieId);
          }
        });
        
        if (highlyRatedMovieIds.length > 0) {
          const highlyRatedMovies = await Movie.find({
            _id: { $in: highlyRatedMovieIds },
          });
          
          // Get genres from highly rated movies
          const likedGenres = new Set();
          highlyRatedMovies.forEach(movie => {
            movie.genre.forEach(genre => likedGenres.add(genre));
          });
          
          // Boost movies with liked genres
          movies = movies.sort((a, b) => {
            const aScore = a.genre.filter(g => likedGenres.has(g)).length;
            const bScore = b.genre.filter(g => likedGenres.has(g)).length;
            return bScore - aScore;
          });
        }
      }
      
      // Limit results
      return movies.slice(0, limit);
    } catch (error) {
      console.error('Recommendation Engine Error:', error);
      throw error;
    }
  },

  // Get mood options
  getMoodOptions() {
    return Object.keys(moodToGenres);
  },
};

module.exports = recommendationEngine;

