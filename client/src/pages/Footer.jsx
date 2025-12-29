import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Top */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Expo<span className="text-primary-light">AI</span>
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Smart test preparation powered by AI. Practice smarter, not harder.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-200">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/tests" className="hover:text-primary-light">
                  Tests
                </Link>
              </li>
              <li>
                <Link to="/previous" className="hover:text-primary-light">
                  Previous Attempts
                </Link>
              </li>
              <li>
                <Link to="/create-test" className="hover:text-primary-light">
                  Create Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-200">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-primary-light">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-200">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Email: support@quizai.com</li>
              <li>Built with ❤️ for learners</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {year} QuizAI. All rights reserved.
          </p>

          <p className="mt-3 sm:mt-0">
            Made by <span className="font-medium text-gray-900 dark:text-gray-200">
              Abdurrahman Kabir
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}