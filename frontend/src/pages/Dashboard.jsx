import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/enrollments/my')
      .then((r) => setItems(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  const completed = items.filter((i) => i.progress === 100).length;

  if (loading) return <div className="text-center"><div className="spinner-border" /></div>;

  return (
    <>
      <h2>Welcome back, {user.name.split(' ')[0]}</h2>
      <p className="text-muted">{items.length} enrolled · {completed} completed</p>
      {error && <div className="alert alert-danger">{error}</div>}

      {items.length === 0 ? (
        <div className="alert alert-info">
          You haven't enrolled in any course yet. <Link to="/">Browse courses</Link> to get started.
        </div>
      ) : (
        <div className="row g-3">
          {items.map((e) => (
            <div className="col-12 col-md-6 col-lg-4" key={e._id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{e.course.title}</h5>
                  <p className="small text-muted">
                    {e.completedModules.length} of {e.course.modules.length} modules done
                  </p>
                  <div className="progress mb-3" role="progressbar" aria-valuenow={e.progress} aria-valuemin="0" aria-valuemax="100">
                    <div className={`progress-bar ${e.progress === 100 ? 'bg-success' : ''}`} style={{ width: `${e.progress}%` }}>
                      {e.progress}%
                    </div>
                  </div>
                  <Link to={`/learn/${e.course._id}`} className="btn btn-sm btn-primary mt-auto">
                    {e.progress === 100 ? 'Review course' : e.progress === 0 ? 'Start' : 'Continue'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
