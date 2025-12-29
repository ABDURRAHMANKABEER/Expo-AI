import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.signup({ name, email, password });

      if (res?.token) {
        nav("/");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow p-8">
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create an Account ✨
        </h2>

        {/* Name */}
        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />

        {/* Email */}
        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          type="email"
        />

        {/* Password */}
        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        {/* Sign Up Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};