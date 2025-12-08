import { MonitorSmartphone, Github } from 'lucide-react';

/**
 * Header component with app branding and navigation links
 */
export default function Header() {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <MonitorSmartphone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Responsive Checker
              </h1>
              <p className="text-xs text-slate-500">Preview websites on any device</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <a 
              href="https://github.com/PrimoStone/webResponsive-checker" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}