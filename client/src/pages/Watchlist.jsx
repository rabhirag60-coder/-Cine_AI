import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const response = await api.getWatchlist();
      if (response.success) {
        setWatchlist(response.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await api.removeFromWatchlist(movieId);
      setWatchlist(watchlist.filter((m) => m._id !== movieId));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove from watchlist');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading watchlist...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Your watchlist is empty</p>
          <Link to="/mood">Get Recommendations</Link>
        </div>
      ) : (
        <>
          <p>
            {watchlist.length}
            {' '}
            {watchlist.length === 1 ? 'movie' : 'movies'}
            {' '}
            in your watchlist
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {watchlist.map((movie) => (
              <div
                key={movie._id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Link
                  to={`/movies/${movie._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {movie.posterURL ? (
                    <img
                      src={movie.posterURL}
                      alt={movie.title}
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '300px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      No Poster
                    </div>
                  )}
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                      {movie.title}
                    </h3>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                      {movie.releaseYear}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(movie._id)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Watchlist;

