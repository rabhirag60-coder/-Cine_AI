import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div>No stats available</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link
          to="/admin/users"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#007bff',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Manage Users
        </Link>
        <Link
          to="/admin/movies"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#28a745',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Manage Movies
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>
            {stats.users.total}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            {stats.users.admins}
            {' '}
            admins
          </p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Total Movies</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>
            {stats.movies.total}
          </p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Total Recommendations</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>
            {stats.recommendations.total}
          </p>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Recent Users (7 days)</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>
            {stats.users.recent}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
        }}
      >
        <div>
          <h2>Top Genres</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            {stats.topGenres.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.topGenres.map((item, index) => (
                  <li
                    key={item.genre}
                    style={{
                      padding: '0.75rem',
                      borderBottom: index < stats.topGenres.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{item.genre}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No genre data available</p>
            )}
          </div>
        </div>

        <div>
          <h2>Most Watched Movies</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            {stats.topWatchedMovies.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.topWatchedMovies.map((item, index) => (
                  <li
                    key={item.movie._id}
                    style={{
                      padding: '0.75rem',
                      borderBottom: index < stats.topWatchedMovies.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{item.movie.title}</span>
                    <strong>{item.watchCount}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No watch data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

