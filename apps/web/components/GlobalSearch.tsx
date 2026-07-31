import { useState, useEffect, useRef } from 'react';
import { Search, FileCode, Bug, GitPullRequest, Folder, Loader2 } from 'lucide-react';

interface GlobalSearchResult {
  type: 'project' | 'investigation' | 'file' | 'pr';
  title: string;
  subtitle: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      // Mock API call to /api/v1/search/global
      fetch(`http://localhost:8000/api/v1/search/global?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setSelectedIndex(0);
        })
        .catch(() => {
           // Fallback to mock if API is down
           setResults([
             { type: 'investigation', title: 'Payment API fails', subtitle: 'Investigation #INV-001', url: '#' },
             { type: 'file', title: 'src/payments/service.ts', subtitle: 'Project: api-gateway', url: '#' }
           ]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        window.location.href = results[selectedIndex].url;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'project': return <Folder size={18} className="text-accent-primary" />;
      case 'investigation': return <Bug size={18} className="text-accent-danger" />;
      case 'pr': return <GitPullRequest size={18} className="text-accent-success" />;
      case 'file': return <FileCode size={18} className="text-text-secondary" />;
      default: return <Search size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-bg-base/80 backdrop-blur-sm p-4">
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-2xl bg-bg-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-border-subtle gap-3">
          <Search size={20} className="text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-lg placeholder:text-text-secondary"
            placeholder="Search projects, files, investigations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 size={18} className="animate-spin text-text-secondary" />}
          <div className="text-xs text-text-secondary bg-bg-base px-2 py-1 rounded border border-border-subtle">ESC</div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((result, idx) => (
              <a
                key={idx}
                href={result.url}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer ${
                  idx === selectedIndex ? 'bg-accent-primary/10' : 'hover:bg-bg-base'
                }`}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="w-10 h-10 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center shrink-0">
                  {getIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text-primary truncate">{result.title}</h4>
                  <p className="text-xs text-text-secondary truncate">{result.subtitle}</p>
                </div>
                {idx === selectedIndex && (
                  <div className="text-xs text-accent-primary">Enter ↵</div>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {query && !loading && results.length === 0 && (
          <div className="p-8 text-center text-text-secondary">
            No results found for "{query}"
          </div>
        )}
        
        {!query && (
           <div className="px-6 py-4 border-t border-border-subtle text-xs text-text-secondary flex gap-4">
             <span><kbd className="font-sans border border-border-subtle rounded px-1">↑</kbd> <kbd className="font-sans border border-border-subtle rounded px-1">↓</kbd> to navigate</span>
             <span><kbd className="font-sans border border-border-subtle rounded px-1">↵</kbd> to select</span>
           </div>
        )}
      </div>
    </div>
  );
}
