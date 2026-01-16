import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
  'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western',
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese',
  'Korean', 'Chinese', 'Hindi', 'Portuguese', 'Russian', 'Arabic',
];

function Profile() {
  const { user, login } = useAuth();
  const [preferredGenres, setPreferredGenres] = useState([]);
  const [preferredLanguages, setPreferredLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getProfile();
      if (response.success) {
        setPreferredGenres(response.data.preferredGenres || []);
        setPreferredLanguages(response.data.preferredLanguages || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genre) => {
    setPreferredGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleLanguageToggle = (language) => {
    setPreferredLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const response = await api.updateProfile({
        preferredGenres,
        preferredLanguages,
      });

      if (response.success) {
        // Update auth context with new user data
        login({ ...user, ...response.data });
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>User Profile</h1>
      <p>
        Welcome,
        {' '}
        <strong>{user?.name}</strong>
        !
      </p>

      {message && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: message.includes('Error') ? '#fee' : '#efe',
            border: `1px solid ${message.includes('Error') ? '#fcc' : '#cfc'}`,
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2>Preferred Genres</h2>
        <p>Select your favorite movie genres:</p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => handleGenreToggle(genre)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: preferredGenres.includes(genre) ? '#007bff' : '#fff',
                color: preferredGenres.includes(genre) ? '#fff' : '#000',
                cursor: 'pointer',
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Preferred Languages</h2>
        <p>Select your preferred movie languages:</p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => handleLanguageToggle(language)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: preferredLanguages.includes(language) ? '#28a745' : '#fff',
                color: preferredLanguages.includes(language) ? '#fff' : '#000',
                cursor: 'pointer',
              }}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}

export default Profile;

