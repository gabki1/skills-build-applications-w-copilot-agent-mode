import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

function Users() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://127.0.0.1:8000/api/users/';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const data = await fetchCollection(apiEndpoint);
        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-1">Users</h2>
            <p className="text-muted mb-0">Members registered in Octofit Tracker.</p>
          </div>
        </div>

        {loading && <p className="text-muted">Loading users…</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <ul className="list-group list-group-flush">
            {users.length > 0 ? (
              users.map((user, index) => (
                <li
                  key={user._id || user.id || `${user.name}-${index}`}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <div className="fw-semibold">{user.name || user.username || 'Unnamed user'}</div>
                    <div className="text-muted small">{user.email || user.role || 'No extra details available'}</div>
                  </div>
                  <span className="badge text-bg-primary">{user.team || user.teamName || 'Member'}</span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No users available yet.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Users;
