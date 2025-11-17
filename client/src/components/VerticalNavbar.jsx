import React from 'react';
import { NavLink } from 'react-router-dom';

export default function VerticalNavbar(){
    return (
        <nav className="w-56 bg-[var(--surface)] p-4 min-h-screen">
            <div className="mb-6 font-bold text-lg">Expo AI</div>
            <ul className="space-y-2">
                <li><NavLink to="/" className={({isActive})=> isActive ? 'font-semibold' : ''}>Home</NavLink></li>
                <li><NavLink to="/new-test">New Test</NavLink></li>
                <li><NavLink to="/previous">Previous</NavLink></li>
                <li><NavLink to="/pricing">Pricing</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
            </ul>
            <footer className="mt-10 text-xs">© Expo AI</footer>
        </nav>
    );
}
