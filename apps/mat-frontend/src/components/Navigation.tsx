import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="bg-primary-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            MAT - Manual Audit Tool
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/audits" className="hover:underline">Audits</Link>
            <Link to="/criteria" className="hover:underline">Criteria</Link>
            <Link to="/evidence" className="hover:underline">Evidence</Link>
            <Link to="/scoring" className="hover:underline">Scoring</Link>
            <Link to="/reports" className="hover:underline">Reports</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
