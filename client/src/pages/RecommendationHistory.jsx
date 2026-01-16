import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function RecommendationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await api.getRecommendationHistory();
      if (response.success) {
        setHistory(response.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Recommendation History</h1>
        <Link to="/mood">Get New Recommendations</Link>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No recommendation history yet</p>
          <Link to="/mood">Get Your First Recommendations</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {history.map((rec) => (
            <div
              key={rec._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, textTransform: 'capitalize' }}>
                  {rec.mood}
                  {' '}
                  Mood
                </h2>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>
                  {new Date(rec.createdAt).toLocaleDateString()}
                  {' • '}
                  {rec.recommendedMovies.length}
                  {' '}
                  movies
                </p>
              </div>

              {rec.recommendedMovies && rec.recommendedMovies.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {rec.recommendedMovies.slice(0, 6).map((movie) => (
                    <Link
                      key={movie._id}
                      to={`/movies/${movie._id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      {movie.posterURL ? (
                        <img
                          src={movie.posterURL}
                          alt={movie.title}
                          style={{
                            width: '100%',
                            height: '225px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '225px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                          }}
                        >
                          No Poster
                        </div>
                      )}
                      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                        {movie.title}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {rec.recommendedMovies.length > 6 && (
                <Link
                  to={`/recommendations/${rec._id}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    color: '#007bff',
                  }}
                >
                  View All
                  {' '}
                  {rec.recommendedMovies.length}
                  {' '}
                  Movies →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendationHistory;

