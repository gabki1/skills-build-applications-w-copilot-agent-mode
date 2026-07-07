import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

function Leaderboard() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://127.0.0.1:8000/api/leaderboard/';
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      try {
        const data = await fetchCollection(apiEndpoint);
        if (isMounted) {
          setEntries(data);
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

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-1">Leaderboard</h2>
            <p className="text-muted mb-0">Current standings for the community.</p>
          </div>
        </div>

        {loading && <p className="text-muted">Loading leaderboard…</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <ol className="list-group list-group-numbered">
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <li
                  key={entry._id || entry.id || `${entry.name}-${index}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="fw-semibold">{entry.name || entry.userName || 'Anonymous'}</div>
                    <div className="text-muted small">{entry.team || entry.category || 'Leaderboard entry'}</div>
                  </div>
                  <span className="badge text-bg-success">{entry.points || entry.score || '0'}</span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No leaderboard entries yet.</li>
            )}
          </ol>
        )}
      </div>
    </section>
  );
}

export default Leaderboard;
