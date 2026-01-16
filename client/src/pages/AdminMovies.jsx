import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState([]);
  const [searchingTMDB, setSearchingTMDB] = useState(false);

  useEffect(() => {
    loadMovies();
  }, [page, search]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminMovies({ page, search });
      if (response.success) {
        setMovies(response.data);
        setTotal(response.total);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTMDB = async () => {
    if (!tmdbSearchQuery.trim()) return;

    try {
      setSearchingTMDB(true);
      const response = await api.searchTMDBMovies(tmdbSearchQuery);
      if (response.success) {
        setTmdbResults(response.data);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to search TMDB');
    } finally {
      setSearchingTMDB(false);
    }
  };

  const handleAddFromTMDB = async (tmdbMovie) => {
    try {
      await api.addAdminMovie({ tmdbId: tmdbMovie.tmdbId });
      alert('Movie added successfully!');
      loadMovies();
      setShowAddForm(false);
      setTmdbSearchQuery('');
      setTmdbResults([]);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add movie');
    }
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      await api.deleteAdminMovie(movieId);
      loadMovies();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete movie');
    }
  };

  if (loading && movies.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading movies...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Manage Movies</h1>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#f8f9fa' }}>
          <h2>Add Movie from TMDB</h2>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search TMDB for movies..."
              value={tmdbSearchQuery}
              onChange={(e) => setTmdbSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchTMDB()}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
            <button
              type="button"
              onClick={handleSearchTMDB}
              disabled={searchingTMDB}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: searchingTMDB ? 'not-allowed' : 'pointer',
              }}
            >
              {searchingTMDB ? 'Searching...' : 'Search'}
            </button>
          </div>

          {tmdbResults.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              {tmdbResults.map((movie) => (
                <div
                  key={movie.tmdbId}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {movie.posterURL && (
                    <img
                      src={movie.posterURL}
                      alt={movie.title}
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{movie.title}</h3>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                      {movie.releaseYear}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddFromTMDB(movie)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Add to Database
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '0.5rem',
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee', color: '#c00', marginBottom: '1rem', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Genre</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Year</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Language</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{movie.title}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{movie.genre.join(', ')}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{movie.releaseYear}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{movie.language}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(movie._id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <span style={{ padding: '0.5rem 1rem', alignSelf: 'center' }}>
            Page
            {' '}
            {page}
            {' '}
            of
            {' '}
            {Math.ceil(total / 20)}
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / 20)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: page >= Math.ceil(total / 20) ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminMovies;

