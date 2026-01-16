import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import MoodSelection from './pages/MoodSelection.jsx';
import Recommendations from './pages/Recommendations.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import Watchlist from './pages/Watchlist.jsx';
import RecommendationHistory from './pages/RecommendationHistory.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminMovies from './pages/AdminMovies.jsx';

function App() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #ddd',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>CineSense</h2>
        </div>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          {!isAuthenticated && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/mood">Get Recommendations</Link>
              <Link to="/watchlist">Watchlist</Link>
              <Link to="/recommendations/history">History</Link>
              <Link to="/profile">Profile</Link>
              {user?.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}
              <span>
                Logged in as
                {' '}
                {user?.name}
              </span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <h1>Welcome to CineSense</h1>
                  <p>Your smart movie recommendation platform</p>
                  <Link
                    to="/mood"
                    style={{
                      display: 'inline-block',
                      padding: '1rem 2rem',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      marginTop: '1rem',
                    }}
                  >
                    Get Recommendations
                  </Link>
                </div>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/mood"
            element={(
              <ProtectedRoute>
                <MoodSelection />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/recommendations/:id"
            element={(
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/recommendations/history"
            element={(
              <ProtectedRoute>
                <RecommendationHistory />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/movies/:id"
            element={<MovieDetail />}
          />
          <Route
            path="/watchlist"
            element={(
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/users"
            element={(
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/movies"
            element={(
              <AdminRoute>
                <AdminMovies />
              </AdminRoute>
            )}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

