import { type FC } from 'react';
import { CalendarDays, LayoutDashboard, MapPin, Newspaper, Settings, type LucideIcon } from 'lucide-react';
import { type AdminPage, useTheme } from '../AdminDashboard';

interface AdminActivityBarProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
}

const AdminActivityBar: FC<AdminActivityBarProps> = ({ currentPage, onPageChange }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const items: Array<{ id: AdminPage; label: string; icon: LucideIcon }> = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
    },
    {
      id: 'activities',
      label: 'الأنشطة',
      icon: CalendarDays,
    },
    {
      id: 'news',
      label: 'الأخبار والمقالات',
      icon: Newspaper,
    },
    {
      id: 'events',
      label: 'الفعاليات',
      icon: MapPin,
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: Settings,
    },
  ];

  return (
    <aside
      data-dashboard-region="activity-bar"
      aria-label="شريط النشاط"
      className={`fixed right-0 top-[68px] z-50 hidden h-[calc(100dvh-68px)] w-12 flex-col items-center border-l lg:flex ${isDark ? 'border-white/10 bg-[#0a111d]' : 'border-gray-200 bg-white'}`}
    >
      <div className={`grid h-12 w-full place-items-center border-b text-[9px] font-extrabold ${isDark ? 'border-white/10 text-amber-300' : 'border-gray-200 text-amber-500'}`}>
        SSB
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 py-3" aria-label="تنقل سريع">
        {items.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onPageChange(item.id)}
              className={`relative grid h-9 w-9 place-items-center rounded-md transition-colors ${
                isActive
                  ? isDark ? 'bg-white/[0.04] text-amber-300' : 'bg-gray-100 text-amber-600'
                  : isDark ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {isActive && <span className="absolute left-0 h-6 w-0.5 rounded-full bg-amber-300" />}
              <item.icon className="h-5 w-5" strokeWidth={1.7} />
            </button>
          );
        })}
      </nav>

      <div className={`border-t py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <span className="block h-2 w-2 rounded-full bg-emerald-400" title="النظام متصل" />
      </div>
    </aside>
  );
};

export default AdminActivityBar;