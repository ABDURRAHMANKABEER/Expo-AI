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
import Generating from './pages/Generating';
import Footer from './pages/Footer';

export default function App() {
  return (
    <>
      <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">
        {/* Sidebar */}
        <VerticalNavbar />

        {/* Main Content */}
        <main className="flex-1 p-6 transition-all duration-300 md:ml-60">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-test"
              element={
                <PrivateRoute>
                  <NewTest />
                </PrivateRoute>
              }
            />
            <Route
              path="/test/:testId"
              element={
                <PrivateRoute>
                  <TestRunner />
                </PrivateRoute>
              }
            />
            <Route
              path="/test/generate/:testId"
              element={
                <PrivateRoute>
                  <Generating />
                </PrivateRoute>
              }
            />
            <Route
              path="/result"
              element={
                <PrivateRoute>
                  <Result />
                </PrivateRoute>
              }
            />
            <Route
              path="/previous"
              element={
                <PrivateRoute>
                  <Previous />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route
              path="*"
              element={
                <div className="text-center mt-20">
                  <p className="text-red-500 text-lg">Not found — <Link className="text-blue-500 hover:underline" to="/">Go Home</Link></p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}