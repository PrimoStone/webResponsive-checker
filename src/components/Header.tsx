import React from 'react';
import { Layout } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-slate-800/50 border-b border-slate-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Responsive Viewer
            </h1>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}