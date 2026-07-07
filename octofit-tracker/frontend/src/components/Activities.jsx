import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      try {
        const data = await fetchCollection('/api/activities/');
        if (isMounted) {
          setActivities(data);
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

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-1">Activities</h2>
            <p className="text-muted mb-0">Recent activity recorded by the team.</p>
          </div>
        </div>

        {loading && <p className="text-muted">Loading activities…</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <ul className="list-group list-group-flush">
            {activities.length > 0 ? (
              activities.map((activity, index) => {
                const userName = typeof activity.userId === 'object' ? activity.userId?.name : activity.userId || 'Unknown user';

                return (
                  <li
                    key={activity._id || activity.id || `${activity.type}-${index}`}
                    className="list-group-item"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">{activity.type || 'Activity'}</div>
                        <div className="text-muted small">{userName}</div>
                      </div>
                      <span className="badge text-bg-info">{activity.duration || activity.points || 'Tracked'}</span>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="list-group-item text-muted">No activities available yet.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Activities;
