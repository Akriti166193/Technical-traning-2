import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const [enr, setEnr] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/enrollments/${courseId}`)
      .then((r) => {
        setEnr(r.data);
        // resume at first incomplete module
        const mods = r.data.course.modules;
        const next = mods.find((m) => !r.data.completedModules.includes(m._id)) || mods[0];
        setActiveId(next?._id);
      })
      .catch((e) => setError(errMsg(e)));
  }, [courseId]);

  const toggle = async (moduleId) => {
    try {
      const { data } = await api.patch(`/enrollments/${courseId}/modules/${moduleId}/toggle`);
      setEnr(data);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (error && !enr)
    return <div className="alert alert-warning">{error} <Link to={`/courses/${courseId}`}>Go to course page</Link></div>;
  if (!enr) return <div className="text-center"><div className="spinner-border" /></div>;

  const { course, completedModules, progress } = enr;
  const active = course.modules.find((m) => m._id === activeId);
  const isDone = (id) => completedModules.includes(id);

  return (
    <>
      <h3>{course.title}</h3>
      <div className="progress mb-3" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className={`progress-bar ${progress === 100 ? 'bg-success' : ''}`} style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {progress === 100 && <div className="alert alert-success">You've completed this course. Well done!</div>}

      <div className="row g-3">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="list-group">
            {course.modules.map((m, i) => (
              <button
                key={m._id}
                className={`list-group-item list-group-item-action d-flex justify-content-between ${m._id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(m._id)}
              >
                <span>{i + 1}. {m.title}</span>
                {isDone(m._id) && <span aria-label="completed">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="col-12 col-md-8 col-lg-9">
          {active && (
            <div className="card">
              <div className="card-body">
                <h4>{active.title}</h4>
                <p className="my-4" style={{ whiteSpace: 'pre-wrap' }}>
                  {/^https?:\/\//.test(active.content)
                    ? <a href={active.content} target="_blank" rel="noreferrer">Open lesson material</a>
                    : active.content}
                </p>
                <button
                  className={`btn ${isDone(active._id) ? 'btn-outline-secondary' : 'btn-success'}`}
                  onClick={() => toggle(active._id)}
                >
                  {isDone(active._id) ? 'Mark as not complete' : 'Mark as complete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
