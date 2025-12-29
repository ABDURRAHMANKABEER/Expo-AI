import React from "react";
import VerticalNavbar from "../components/VerticalNavbar";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar (overlay) */}
      <VerticalNavbar />

      {/* Main Content – FULL PAGE */}
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl w-full text-center">

          {/* HERO */}
          <div className="mb-16 space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold
              bg-gradient-to-r from-primary-light to-accent
              bg-clip-text text-transparent animate-gradient-x">
              Welcome to ExpoAI
            </h1>

            <p className="text-gray-700 dark:text-gray-300
              text-lg md:text-xl max-w-3xl mx-auto">
              Prepare for exams, scholarships, job aptitude tests, and university exams — tailored to YOU by AI.
            </p>
          </div>

          {/* CTA CARD */}
          <div className="relative p-10 rounded-3xl
            bg-gradient-to-br from-blue-500 to-indigo-600
            dark:from-slate-700 dark:to-slate-900
            text-white shadow-2xl overflow-hidden">

            {/* Floating shapes */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10 animate-ping-slow" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 animate-ping-slower" />

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Generate Your AI-Powered Test Now!
            </h2>

            <p className="text-lg mb-8">
              Describe the exam, subject, or organization, and our AI will craft a tailored set of questions in seconds.
            </p>

            <Button
              variant="primary"
              size="lg"
              className="transform hover:scale-105 hover:shadow-xl transition-transform duration-500"
              onClick={() => navigate("/new-test")}
            >
              Generate New Test
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}