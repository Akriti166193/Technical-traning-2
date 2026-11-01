import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const empty = { title: '', description: '', instructor: '', category: 'Programming', modulesText: '' };

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => api.get('/courses').then((r) => setCourses(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // modulesText: one module per line, "Title | content or URL"
  const parseModules = (text) =>
    text.split('\n').map((l) => l.trim()).filter(Boolean).map((line, i) => {
      const [title, ...rest] = line.split('|');
      return { title: title.trim(), content: rest.join('|').trim(), order: i + 1 };
    });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    const { modulesText, ...rest } = form;
    const body = { ...rest, modules: parseModules(modulesText) };
    try {
      if (editingId) await api.put(`/courses/${editingId}`, body);
      else await api.post('/courses', body);
      setMsg(editingId ? 'Course updated.' : 'Course created.');
      setForm(empty); setEditingId(null); load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const edit = async (id) => {
    const { data } = await api.get(`/courses/${id}`);
    setEditingId(id);
    setForm({
      title: data.title, description: data.description, instructor: data.instructor, category: data.category,
      modulesText: data.modules.map((m) => `${m.title} | ${m.content}`).join('\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course and all its enrollments?')) return;
    try { await api.delete(`/courses/${id}`); load(); } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <h4>{editingId ? 'Edit course' : 'Add a course'}</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}
        <form onSubmit={submit}>
          <input className="form-control mb-2" placeholder="Title" value={form.title} onChange={set('title')} required />
          <input className="form-control mb-2" placeholder="Instructor" value={form.instructor} onChange={set('instructor')} required />
          <select className="form-select mb-2" value={form.category} onChange={set('category')}>
            {['Programming', 'Database', 'Web', 'General'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea className="form-control mb-2" rows="3" placeholder="Description" value={form.description} onChange={set('description')} required />
          <textarea className="form-control mb-2" rows="6" placeholder={'Modules, one per line:\nModule title | lesson text or URL'} value={form.modulesText} onChange={set('modulesText')} />
          <button className="btn btn-primary me-2">{editingId ? 'Save changes' : 'Create course'}</button>
          {editingId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>}
        </form>
      </div>

      <div className="col-12 col-lg-7">
        <h4>All courses</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Title</th><th>Modules</th><th /></tr></thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{c.modules.length}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(c._id)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
