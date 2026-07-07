import { useEffect, useState } from 'react';
import { fetchCollection } from '../api';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadWorkouts() {
      try {
        const data = await fetchCollection('/api/workouts/');
        if (isMounted) {
          setWorkouts(data);
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

    loadWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-1">Workouts</h2>
            <p className="text-muted mb-0">Recommended training plans for members.</p>
          </div>
        </div>

        {loading && <p className="text-muted">Loading workouts…</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {workouts.length > 0 ? (
              workouts.map((workout, index) => (
                <div key={workout._id || workout.id || `${workout.name}-${index}`} className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="fw-semibold">{workout.name || workout.title || 'Workout'}</div>
                    <div className="text-muted small mt-1">{workout.description || 'Details coming soon.'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-muted">No workouts available yet.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Workouts;
