import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovie();
    if (isAuthenticated) {
      loadUserData();
    }
  }, [id, isAuthenticated]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const response = await api.getMovie(id);
      if (response.success) {
        setMovie(response.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load movie');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      // Load user rating
      const ratingResponse = await api.getMovieRating(id);
      if (ratingResponse.success && ratingResponse.data.rating) {
        setUserRating(ratingResponse.data.rating);
      }

      // Check if in watchlist
      const watchlistResponse = await api.getWatchlist();
      if (watchlistResponse.success) {
        const inWatchlist = watchlistResponse.data.some(
          (m) => m._id === id
        );
        setIsInWatchlist(inWatchlist);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setRatingLoading(true);
      const response = await api.rateMovie(id, rating);
      if (response.success) {
        setUserRating(rating);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to rate movie');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setWatchlistLoading(true);
      if (isInWatchlist) {
        await api.removeFromWatchlist(id);
        setIsInWatchlist(false);
      } else {
        await api.addToWatchlist(id);
        setIsInWatchlist(true);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading movie...</div>;
  }

  if (error || !movie) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        {error || 'Movie not found'}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        {movie.posterURL ? (
          <img
            src={movie.posterURL}
            alt={movie.title}
            style={{
              width: '300px',
              height: '450px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        ) : (
          <div
            style={{
              width: '300px',
              height: '450px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            No Poster
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h1 style={{ marginTop: 0 }}>{movie.title}</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {movie.releaseYear}
            {' • '}
            {movie.genre.join(', ')}
            {' • '}
            {movie.language}
          </p>

          {movie.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Description</h3>
              <p>{movie.description}</p>
            </div>
          )}

          {isAuthenticated && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h3>Rate this movie</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRate(rating)}
                      disabled={ratingLoading}
                      style={{
                        padding: '0.5rem 1rem',
                        border: `2px solid ${userRating === rating ? '#007bff' : '#ddd'}`,
                        borderRadius: '4px',
                        backgroundColor: userRating === rating ? '#007bff' : '#fff',
                        color: userRating === rating ? '#fff' : '#000',
                        cursor: ratingLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {rating}
                      {' '}
                      ⭐
                    </button>
                  ))}
                </div>
                {userRating && (
                  <p style={{ marginTop: '0.5rem' }}>
                    You rated this
                    {' '}
                    {userRating}
                    /5
                  </p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isInWatchlist ? '#28a745' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: watchlistLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {watchlistLoading
                    ? 'Updating...'
                    : isInWatchlist
                      ? '✓ In Watchlist'
                      : '+ Add to Watchlist'}
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <p>
              <a href="/login">Login</a>
              {' '}
              to rate and add to watchlist
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;

