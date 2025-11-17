import React, { useState } from 'react';
import api from '../api/apiClient';

export default function NewTest(){
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState('');
  const [organization, setOrg] = useState('');
  const [loading, setLoading] = useState(false);
  const createTest = async () => {
    try {
      setLoading(true);
      const res = await api.post('/tests', { title, examType, organization });
      // assume returns test id
      const id = res.data?.test?._id;
      alert('Test requested, id: ' + id);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create New Test</h2>
      <div className="space-y-3 max-w-md">
        <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Exam Type (e.g. JAMB)" value={examType} onChange={e=>setExamType(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Organization" value={organization} onChange={e=>setOrg(e.target.value)} />
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded" onClick={createTest} disabled={loading}>
          {loading ? 'Creating...' : 'Create Test'}
        </button>
      </div>
    </div>
  );
}
