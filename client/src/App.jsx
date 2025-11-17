import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NewTest from './pages/NewTest';
import TestRunner from './pages/TestRunner';
import Result from './pages/Result';
import Previous from './pages/Previous';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerticalNavbar from './components/VerticalNavbar';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">
      <VerticalNavbar />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-test" element={<PrivateRoute><NewTest /></PrivateRoute>} />
          <Route path="/test/:id" element={<PrivateRoute><TestRunner /></PrivateRoute>} />
          <Route path="/result/:id" element={<PrivateRoute><Result /></PrivateRoute>} />
          <Route path="/previous" element={<PrivateRoute><Previous /></PrivateRoute>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<div>Not found — <Link to="/">Home</Link></div>} />
        </Routes>
      </main>
    </div>
  );
}