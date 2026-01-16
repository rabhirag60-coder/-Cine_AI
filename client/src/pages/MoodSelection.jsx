import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const moods = [
  { name: 'happy', emoji: '😊', label: 'Happy' },
  { name: 'sad', emoji: '😢', label: 'Sad' },
  { name: 'excited', emoji: '🤩', label: 'Excited' },
  { name: 'relaxed', emoji: '😌', label: 'Relaxed' },
  { name: 'romantic', emoji: '💕', label: 'Romantic' },
  { name: 'thrilled', emoji: '🎢', label: 'Thrilled' },
  { name: 'nostalgic', emoji: '📸', label: 'Nostalgic' },
  { name: 'anxious', emoji: '😰', label: 'Anxious' },
];

function MoodSelection() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setError('');
  };

  const handleGenerateRecommendations = async () => {
    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.generateRecommendations(selectedMood);
      
      if (response.success) {
        // Navigate to recommendations page with the recommendation ID
        navigate(`/recommendations/${response.data.recommendation._id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>How are you feeling today?</h1>
      <p>Select your mood to get personalized movie recommendations</p>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {moods.map((mood) => (
          <button
            key={mood.name}
            type="button"
            onClick={() => handleMoodSelect(mood.name)}
            style={{
              padding: '2rem 1rem',
              border: `2px solid ${selectedMood === mood.name ? '#007bff' : '#ddd'}`,
              borderRadius: '8px',
              backgroundColor: selectedMood === mood.name ? '#e7f3ff' : '#fff',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerateRecommendations}
        disabled={loading || !selectedMood}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          backgroundColor: selectedMood ? '#007bff' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: selectedMood && !loading ? 'pointer' : 'not-allowed',
          width: '100%',
        }}
      >
        {loading ? 'Generating Recommendations...' : 'Get Recommendations'}
      </button>
    </div>
  );
}

export default MoodSelection;

