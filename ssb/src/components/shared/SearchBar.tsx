import { type FC, useState, useEffect } from 'react';

interface SearchSuggestion {
  id: number;
  title: string;
  category: string;
  icon: string;
}

const SearchBar: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // قائمة الاقتراحات المحددة مسبقاً
  const predefinedSuggestions: SearchSuggestion[] = [
    { id: 1, title: 'منحة جامعة أوسلو للدراسات العليا', category: 'منح دراسية', icon: '🎓' },
    { id: 2, title: 'فرصة تدريب في شركة مايكروسوفت', category: 'فرص تدريب', icon: '💼' },
    { id: 3, title: 'مسابقة البرمجة السنوية', category: 'مسابقات', icon: '🏆' },
    { id: 4, title: 'دورة اللغة النرويجية المجانية', category: 'دورات', icon: '📚' },
    { id: 5, title: 'وظائف للطلاب بدوام جزئي', category: 'وظائف', icon: '💡' },
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = predefinedSuggestions.filter(suggestion =>
        suggestion.title.includes(searchTerm) || 
        suggestion.category.includes(searchTerm)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search logic here
  };

  return (
    <div className="relative z-50 mx-auto w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <label className="sr-only" htmlFor="search">ابحث</label>
        <div className={`relative flex items-center gap-3 rounded-2xl border bg-white/95 py-2.5 pl-4 pr-3 shadow-2xl shadow-cyan-950/20 ring-1 ring-white/30 transition-all ${
          isExpanded 
            ? 'border-cyan-400 ring-cyan-200/60' 
            : 'border-white/70'
        }`}>
          <span className={`transition-colors duration-300 ${isExpanded ? 'text-cyan-600' : 'text-slate-400'}`}>
            <SearchIcon />
          </span>
          
          <input
            id="search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder="ابحث عن: منح، وظائف، جامعات…"
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none md:text-base"
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          
            <button
            type="submit"
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition-all duration-300 ${
              isExpanded
                ? 'bg-cyan-700 text-white hover:bg-cyan-800'
                : 'bg-[#071d31] text-white hover:bg-[#0d304b]'
            }`}
          >
            بحث
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {isExpanded && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            <div className="p-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => setSearchTerm(suggestion.title)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-right transition-colors"
                >
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{suggestion.title}</p>
                    <p className="text-sm text-slate-500">{suggestion.category}</p>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Recent Searches and Quick Links */}
            <div className="mt-2 border-t border-slate-100 px-3 pb-3 pt-3">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>بحث سريع</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <QuickSearchButton label="منح دراسية" icon="🎓" />
                <QuickSearchButton label="وظائف" icon="💼" />
                <QuickSearchButton label="تدريب" icon="📚" />
                <QuickSearchButton label="سكن" icon="🏠" />
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Search Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 bg-[#071d31]/35 backdrop-blur-[2px]" aria-hidden="true" />
      )}
    </div>
  );
};

const SearchIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const QuickSearchButton: FC<{ label: string; icon: string }> = ({ label, icon }) => (
  <button
    type="button"
    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-amber-100 hover:text-slate-900"
  >
    <span>{icon}</span>
    {label}
  </button>
);

export default SearchBar;