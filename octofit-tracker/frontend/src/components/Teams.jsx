import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        const data = await fetchCollection('/api/teams/');
        if (isMounted) {
          setTeams(data);
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

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-1">Teams</h2>
            <p className="text-muted mb-0">Active squads and their membership.</p>
          </div>
        </div>

        {loading && <p className="text-muted">Loading teams…</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <div key={team._id || team.id || `${team.name}-${index}`} className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="fw-semibold">{team.name || team.teamName || 'Unnamed team'}</div>
                    <div className="text-muted small mt-1">{team.description || 'Team details coming soon.'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-muted">No teams available yet.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Teams;
