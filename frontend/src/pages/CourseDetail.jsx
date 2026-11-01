import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${id}`).then((r) => setCourse(r.data)).catch((e) => setError(errMsg(e)));
    if (user) api.get(`/enrollments/${id}`).then(() => setEnrolled(true)).catch(() => setEnrolled(false));
  }, [id, user]);

  const enroll = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/enrollments/${id}`);
      navigate(`/learn/${id}`);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (error && !course) return <div className="alert alert-danger">{error}</div>;
  if (!course) return <div className="text-center"><div className="spinner-border" /></div>;

  return (
    <div className="row">
      <div className="col-lg-8">
        <span className="badge text-bg-secondary mb-2">{course.category}</span>
        <h2>{course.title}</h2>
        <p className="text-muted">Taught by {course.instructor}</p>
        <p>{course.description}</p>
        <h5 className="mt-4">What you'll cover</h5>
        <ol className="list-group list-group-numbered">
          {course.modules.map((m) => <li className="list-group-item" key={m._id}>{m.title}</li>)}
        </ol>
      </div>
      <div className="col-lg-4 mt-4 mt-lg-0">
        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {enrolled ? (
              <Link to={`/learn/${id}`} className="btn btn-success w-100">Continue learning</Link>
            ) : (
              <button className="btn btn-primary w-100" onClick={enroll}>Enroll now</button>
            )}
            <p className="small text-muted mt-3 mb-0">{course.modules.length} modules · self-paced</p>
          </div>
        </div>
      </div>
    </div>
  );
}
