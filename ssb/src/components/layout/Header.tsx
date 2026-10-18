import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  onShowNews: () => void;
  onShowQuestionsPage: () => void;
  onShowAllActivities: () => void;
  onAdminClick?: () => void;
}

const Header = ({ onHomeClick, onShowNews, onShowQuestionsPage, onShowAllActivities, onAdminClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if user has scrolled more than 10px, false otherwise
      setIsScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled ? 'border-white/10 bg-[#071d31]/90 shadow-xl backdrop-blur-xl' : 'border-white/10 bg-slate-950/10 backdrop-blur-md'}`}
    >
      <nav className={`relative mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 transition-all duration-300 md:px-8 ${isScrolled ? 'py-3' : 'py-4'}`}>
        {/* Logo */}
        <a href="/" onClick={(event) => { event.preventDefault(); onHomeClick(); setIsMobileMenuOpen(false); }} className="group flex items-center gap-3">
          <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-amber-300 text-[#071d31] shadow-lg shadow-amber-950/20 ring-1 ring-white/30 transition-transform group-hover:-rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3 7 8l5 5 5-5-5-5Zm0 8-5 5 5 5 5-5-5-5Z" />
            </svg>
          </span>
          <span className="hidden text-base font-semibold tracking-tight sm:block md:text-lg">Syrian Student Association</span>
        </a>

        {/* Links */}
        <div className="hidden items-center gap-2 text-sm text-white/80 md:flex">
          <a href="#news" onClick={(event) => { event.preventDefault(); onShowNews(); }} className="group/link flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            أخبار الطلبة
          </a>
          <a href="#questions" onClick={(event) => { event.preventDefault(); onShowQuestionsPage(); }} className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
            بنك الأسئلة
          </a>
          <a href="#activities" onClick={(event) => { event.preventDefault(); onShowAllActivities(); }} className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h28.5" /></svg>
            الأنشطة القادمة
          </a>
          <button
            onClick={onAdminClick}
            className="mr-2 flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 font-semibold text-[#071d31] shadow-lg shadow-amber-950/15 transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            لوحة التحكم
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              المزيد
            </button>
            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  عن الرابطة
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  تواصل معنا
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20 md:hidden"
        >
          <span className="sr-only">القائمة</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="absolute inset-x-4 top-full mt-3 rounded-2xl border border-white/15 bg-[#071d31]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
            <a href="#news" onClick={(event) => { event.preventDefault(); onShowNews(); setIsMobileMenuOpen(false); }} className="flex items-center justify-between rounded-xl px-4 py-3 text-white/85 transition hover:bg-white/10 hover:text-white">
              أخبار الطلبة
              <span aria-hidden="true">←</span>
            </a>
            <a href="#questions" onClick={(event) => { event.preventDefault(); onShowQuestionsPage(); setIsMobileMenuOpen(false); }} className="flex items-center justify-between rounded-xl px-4 py-3 text-white/85 transition hover:bg-white/10 hover:text-white">
              بنك الأسئلة
              <span aria-hidden="true">←</span>
            </a>
            <a href="#activities" onClick={(event) => { event.preventDefault(); onShowAllActivities(); setIsMobileMenuOpen(false); }} className="flex items-center justify-between rounded-xl px-4 py-3 text-white/85 transition hover:bg-white/10 hover:text-white">
              الأنشطة القادمة
              <span aria-hidden="true">←</span>
            </a>
            {onAdminClick && (
              <button type="button" onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }} className="mt-2 w-full rounded-xl bg-amber-300 px-4 py-3 text-right font-semibold text-[#071d31] transition hover:bg-amber-200">
                لوحة التحكم
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;