import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function Recommendations() {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendation();
  }, [id]);

  const loadRecommendation = async () => {
    try {
      setLoading(true);
      const response = await api.getRecommendation(id);
      if (response.success) {
        setRecommendation(response.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading recommendations...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  if (!recommendation || !recommendation.recommendedMovies || recommendation.recommendedMovies.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No recommendations found</p>
        <Link to="/mood">Select a new mood</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>
          Recommendations for
          {' '}
          <span style={{ textTransform: 'capitalize' }}>{recommendation.mood}</span>
          {' '}
          mood
        </h1>
        <p>
          Found
          {' '}
          {recommendation.recommendedMovies.length}
          {' '}
          movies for you
        </p>
        <Link to="/mood" style={{ marginRight: '1rem' }}>
          Select New Mood
        </Link>
        <Link to="/recommendations/history">View History</Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {recommendation.recommendedMovies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie._id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
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
                {' • '}
                {movie.genre.join(', ')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;

