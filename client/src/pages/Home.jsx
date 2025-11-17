import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Expo AI — Smart Exam Prep</h1>
      <p className="mb-6">AI-generated tailored quizzes for exams and certifications.</p>
      <Link to="/new-test" className="px-4 py-2 rounded bg-[var(--primary)] text-white">Start a Test</Link>
    </div>
  );
}
