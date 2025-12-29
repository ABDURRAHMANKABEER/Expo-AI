import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  ClipboardListIcon,
  MenuIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  LogInIcon,
  LogOutIcon
} from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext";
import authService from "../services/authService";

export default function VerticalNavbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <>
      {/* Toggle button – now visible on ALL screens */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg
        bg-gray-200 dark:bg-slate-800
        text-gray-700 dark:text-gray-200 shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Mobile overlay (still mobile-only) */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
        bg-white dark:bg-slate-900
        border-r border-gray-200 dark:border-slate-700 shadow-lg
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        w-64 md:w-60`}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="px-6 mb-8">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              PrepMaster
            </h1>
            {isLoggedIn && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hi, {user?.name || "User"} 👋
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <HomeIcon size={20} />
              <span>Home</span>
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/new-test"
                  className="flex items-center gap-3 p-3 rounded-lg
                  text-gray-700 dark:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  <PlusCircleIcon size={20} />
                  <span>New Test</span>
                </Link>

                <Link
                  to="/previous"
                  className="flex items-center gap-3 p-3 rounded-lg
                  text-gray-700 dark:text-gray-200
                  hover:bg-gray-200 dark:hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  <ClipboardListIcon size={20} />
                  <span>My Tests</span>
                </Link>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="px-4 mt-auto flex flex-col items-start gap-3">
            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg
                bg-green-100 dark:bg-green-900
                text-green-700 dark:text-green-200 w-full"
              >
                <LogInIcon size={18} /> <span>Login</span>
              </Link>
            ) : (
              <button
                onClick={() => authService.logout()}
                className="flex items-center gap-2 p-2 rounded-lg
                bg-red-100 dark:bg-red-900
                text-red-700 dark:text-red-200 w-full"
              >
                <LogOutIcon size={18} /> <span>Logout</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 rounded-lg
              bg-gray-200 dark:bg-slate-800
              text-gray-700 dark:text-gray-200 w-full"
            >
              {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              © 2025 PrepMaster
            </div>
          </div>
        </div>
      </div>
    </>
  );
}