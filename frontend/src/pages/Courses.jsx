import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api.get('/courses', { params: { search, category } })
        .then((r) => setCourses(r.data))
        .catch((e) => setError(errMsg(e)))
        .finally(() => setLoading(false));
    }, 300); // debounce typing
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <>
      <h2 className="mb-3">Browse courses</h2>
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <input className="form-control" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {['Programming', 'Database', 'Web', 'General'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center"><div className="spinner-border" /></div>
      ) : courses.length === 0 ? (
        <p className="text-muted">No courses match your search.</p>
      ) : (
        <div className="row g-3">
          {courses.map((c) => (
            <div className="col-12 col-md-6 col-lg-4" key={c._id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <span className="badge text-bg-secondary align-self-start mb-2">{c.category}</span>
                  <h5 className="card-title">{c.title}</h5>
                  <p className="card-text text-muted small flex-grow-1">{c.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{c.instructor} · {c.modules.length} modules</small>
                    <Link to={`/courses/${c._id}`} className="btn btn-sm btn-primary">View course</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
