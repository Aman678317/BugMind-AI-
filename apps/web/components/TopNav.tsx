import Link from 'next/link';
import { Search, Settings, HelpCircle, Bug, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlobalSearch from './GlobalSearch';

export default function TopNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="h-16 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-6 sticky top-0 z-40">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-purple flex items-center justify-center shadow-lg shadow-accent-primary/20">
            <Bug className="text-white" size={20} />
          </div>
          <Link href="/" className="font-ui font-bold text-lg tracking-tight text-text-primary flex items-center gap-2">
            BugMind <span className="text-xs font-mono bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-full">v3</span>
          </Link>
        </div>

        {/* Middle: Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-secondary group-hover:text-accent-primary transition-colors" />
            </div>
            <div className="block w-full pl-10 pr-3 py-2 border border-border-subtle rounded-lg bg-bg-base text-text-secondary text-sm transition-all group-hover:border-accent-primary/50 group-hover:shadow-[0_0_15px_rgba(43,116,137,0.1)]">
              Search projects, files, investigations...
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-xs font-medium text-text-secondary border border-border-subtle rounded px-1.5 py-0.5 bg-bg-surface">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-lg transition-colors">
            <Sparkles size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-lg transition-colors">
            <HelpCircle size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-lg transition-colors">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-primary p-[2px] cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-bg-surface border-2 border-transparent"></div>
          </div>
        </div>

      </nav>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
