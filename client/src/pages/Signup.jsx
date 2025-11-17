import React, { useState } from 'react';
import api from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const token = res.data.token;
      if (token) localStorage.setItem('token', token);
      nav('/');
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <input className="w-full p-2 border rounded mb-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input className="w-full p-2 border rounded mb-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full p-2 border rounded mb-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <button className="px-4 py-2 bg-[var(--primary)] text-white rounded" onClick={submit}>Sign Up</button>
    </div>
  );
}
