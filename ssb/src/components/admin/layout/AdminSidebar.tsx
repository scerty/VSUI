import { type FC } from 'react';
import { CalendarDays, LayoutDashboard, MapPin, Newspaper, Settings, type LucideIcon } from 'lucide-react';
import { type AdminPage, useTheme } from '../AdminDashboard';

interface AdminSidebarProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
  collapsed: boolean;
  onCollapse: () => void;
  onExit: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const AdminSidebar: FC<AdminSidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onCollapse,
  onExit,
  mobileOpen,
  onMobileClose,
}) => {
  const { theme } = useTheme();

  const themeClasses = {
    dark: {
      sidebar: 'bg-[#0d1726] border-white/10',
      title: 'text-white',
      subtitle: 'text-slate-500',
      collapseBtn: 'text-slate-400 hover:bg-white/5 hover:text-white',
    },
    light: {
      sidebar: 'bg-white border-gray-200',
      title: 'text-gray-900',
      subtitle: 'text-gray-500',
      collapseBtn: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
    },
  };

  const tc = themeClasses[theme];

  const menuItems: Array<{ id: AdminPage; label: string; icon: LucideIcon }> = [
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

  const contextTools: Record<AdminPage, Array<{ label: string; detail: string }>> = {
    dashboard: [
      { label: 'نظرة عامة', detail: 'الإحصائيات والنشاط الأخير' },
      { label: 'الوصول السريع', detail: 'إجراءات إدارة المحتوى' },
    ],
    activities: [
      { label: 'قائمة الأنشطة', detail: 'عرض الأنشطة وتحديثها' },
      { label: 'إضافة نشاط', detail: 'إنشاء نشاط جديد' },
    ],
    news: [
      { label: 'قائمة المقالات', detail: 'عرض الأخبار والمسودات' },
      { label: 'كتابة مقال', detail: 'فتح محرر المقالات' },
    ],
    events: [
      { label: 'قائمة الفعاليات', detail: 'عرض الفعاليات القادمة' },
      { label: 'إنشاء فعالية', detail: 'إضافة فعالية جديدة' },
    ],
    settings: [
      { label: 'إعدادات المنصة', detail: 'التفضيلات العامة' },
      { label: 'الحساب والصلاحيات', detail: 'إدارة الوصول' },
    ],
  };

  const activeItem = menuItems.find((item) => item.id === currentPage) ?? menuItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <aside
      data-dashboard-region="primary-sidebar"
      aria-label="منطقة التنقل الأساسية"
      className={`fixed right-0 top-[68px] z-50 flex h-[calc(100dvh-68px)] w-[min(16rem,calc(100vw-3rem))] flex-col overflow-hidden border-l transition-all duration-300 lg:right-12 lg:top-[68px] lg:h-[calc(100dvh-68px)] lg:translate-x-0 ${tc.sidebar} ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
    >
      {/* Logo */}
      <div className={`flex min-h-14 items-center justify-between border-b px-3 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className={`flex min-w-0 items-center ${collapsed && !mobileOpen ? 'w-full justify-center' : 'gap-3'}`}>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-300 text-[10px] font-extrabold text-[#071522]">
            <span>{collapsed ? 'S' : 'SSB'}</span>
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="min-w-0">
              <h1 className={`${tc.title} truncate text-xs font-extrabold`}>لوحة الإدارة</h1>
              <p className={`${tc.subtitle} mt-0.5 truncate text-[10px]`}>نظام إدارة المحتوى</p>
            </div>
          )}
        </div>
        <button type="button" aria-label="إغلاق القائمة الجانبية" onClick={onMobileClose} className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {(!collapsed || mobileOpen) && (
        <div className={`mx-3 mt-1 border-b px-2 pb-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-300">مساحة العمل</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
            <span className="text-xs text-slate-300">النظام يعمل بشكل طبيعي</span>
          </div>
        </div>
      )}

      {/* Contextual navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {collapsed && !mobileOpen ? (
          <button
            type="button"
            title={activeItem.label}
            aria-label={activeItem.label}
            onClick={() => onPageChange(activeItem.id)}
            className="group mx-auto grid h-10 w-10 place-items-center rounded-md border-r-2 border-amber-300 bg-white/[0.04] text-amber-300 transition-colors duration-200 hover:bg-white/[0.08]"
          >
            <ActiveIcon className="h-4 w-4" strokeWidth={1.8} />
          </button>
        ) : (
          <>
            <div className={`border-b px-2 pb-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <p className={`text-[9px] font-bold uppercase tracking-[0.14em] ${theme === 'dark' ? 'text-teal-300' : 'text-teal-600'}`}>التبويب النشط</p>
              <p className={`mt-1 text-sm font-bold ${tc.title}`}>{activeItem.label}</p>
            </div>
            <div className="space-y-0 pt-1">
              {contextTools[currentPage].map((tool) => (
                <div
                  key={tool.label}
                  className={`group flex min-h-9 items-start gap-2 border-b px-2 py-1.5 transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/[0.04]' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <span className={`pt-0.5 text-xs ${theme === 'dark' ? 'text-slate-600 group-hover:text-amber-300' : 'text-gray-400 group-hover:text-amber-500'}`}>›</span>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-semibold ${tc.title}`}>{tool.label}</p>
                    <p className={`mt-0.5 text-[10px] leading-3 ${tc.subtitle}`}>{tool.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Bottom actions */}
      <div className={`space-y-1.5 border-t p-3 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={onCollapse}
          className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ${tc.collapseBtn} transition-colors`}
        >
          <svg
            className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {(!collapsed || mobileOpen) && <span className="font-semibold">تصغير القائمة</span>}
        </button>
        <button
          onClick={onExit}
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-red-400/20 bg-transparent px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-400/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!collapsed || mobileOpen) && <span className="font-semibold">الخروج للموقع</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
