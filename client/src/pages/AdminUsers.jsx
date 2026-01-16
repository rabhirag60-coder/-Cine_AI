import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminUsers({ page, search });
      if (response.success) {
        setUsers(response.data);
        setTotal(response.total);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateAdminUser(userId, { role: newRole });
      loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.deleteAdminUser(userId);
      loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading && users.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Manage Users</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search users..."
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
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Joined</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{user.name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{user.email}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(user._id)}
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

export default AdminUsers;

