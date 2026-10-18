import { type FC } from 'react';
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../AdminDashboard';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader: FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  const themeClasses = {
    dark: {
      header: 'bg-[#0b1220]/95 border-white/10',
      title: 'text-white',
      description: 'text-slate-400',
      search: 'bg-white/[0.05] border-white/10',
      searchText: 'text-white placeholder-slate-500',
      icon: 'text-slate-400 hover:bg-white/10 hover:text-white',
      userName: 'text-white',
      userEmail: 'text-slate-500',
      border: 'border-white/10',
    },
    light: {
      header: 'bg-white/80 border-gray-200',
      title: 'text-gray-900',
      description: 'text-gray-500',
      search: 'bg-gray-100 border-gray-200',
      searchText: 'text-gray-900 placeholder-gray-400',
      icon: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
      userName: 'text-gray-900',
      userEmail: 'text-gray-500',
      border: 'border-gray-200',
    },
  };

  const tc = themeClasses[theme];

  return (
    <header data-dashboard-region="nav" className={`sticky top-0 z-[60] flex min-h-20 w-full items-center justify-between border-b px-4 transition-colors duration-300 sm:px-6 ${tc.header}`}>
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="فتح القائمة الجانبية"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button
          type="button"
          aria-label={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          onClick={toggleTheme}
          className={`rounded-lg p-2.5 ${tc.icon} transition-all`}
          title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" strokeWidth={1.8} /> : <Moon className="h-5 w-5" strokeWidth={1.8} />}
        </button>

        {/* Search */}
        <div className={`hidden items-center gap-2 rounded-lg border px-4 py-2.5 transition-colors duration-300 md:flex ${tc.search}`}>
          <Search className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="البحث..."
            aria-label="البحث في لوحة الإدارة"
            className={`w-44 border-none bg-transparent text-sm outline-none lg:w-52 ${tc.searchText}`}
          />
          <kbd className={`hidden lg:inline-block px-2 py-0.5 text-xs ${theme === 'dark' ? 'text-slate-500 bg-slate-700/50' : 'text-gray-500 bg-gray-200'} rounded`}>⌘K</kbd>
        </div>

        {/* Notifications */}
        <button type="button" aria-label="الإشعارات" className={`relative rounded-lg p-2.5 ${tc.icon} transition-all`}>
          <Bell className="h-5 w-5" strokeWidth={1.8} />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-[#0a1929]"></span>
        </button>

        {/* User Menu */}
        <div className={`flex items-center gap-3 border-r pr-2 sm:pr-4 ${tc.border} transition-colors duration-300`}>
          <div className="hidden text-left sm:block">
            <p className={`text-sm font-bold ${tc.userName} transition-colors duration-300`}>المسؤول</p>
            <p className={`text-xs ${tc.userEmail} transition-colors duration-300`}>admin@ssb.org</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-300">
            <span className="text-sm font-extrabold text-[#071522]">م</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
