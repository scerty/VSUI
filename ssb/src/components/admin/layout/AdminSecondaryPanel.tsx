import { type FC } from 'react';
import { type AdminPage, useTheme } from '../AdminDashboard';

interface AdminSecondaryPanelProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
}

const pageContext: Record<AdminPage, { title: string; description: string }> = {
  dashboard: { title: 'مركز المنصة', description: 'ملخص سريع لحالة منظمة الطالب السوري ومحتواها.' },
  activities: { title: 'سياق الأنشطة', description: 'تابع الأنشطة القادمة وحافظ على تفاصيلها محدثة.' },
  news: { title: 'سياق المقالات', description: 'اكتب المقالات واحفظ المسودات قبل نشرها.' },
  events: { title: 'سياق الفعاليات', description: 'نظّم الفعاليات وتابع السعة والحضور.' },
  settings: { title: 'سياق الإعدادات', description: 'راجع تفضيلات المنصة وإعداداتها العامة.' },
};

const AdminSecondaryPanel: FC<AdminSecondaryPanelProps> = ({ currentPage, onPageChange }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const context = pageContext[currentPage];

  const quickLinks = [
    { label: 'كتابة مقال', page: 'news' as AdminPage },
    { label: 'إضافة نشاط', page: 'activities' as AdminPage },
    { label: 'إنشاء فعالية', page: 'events' as AdminPage },
  ];

  return (
    <aside
      data-dashboard-region="secondary"
      aria-label="منطقة العرض الثانوية"
      className={`order-2 w-full shrink-0 border-t p-5 lg:order-1 lg:w-60 lg:border-l lg:border-t-0 ${isDark ? 'border-white/10 bg-[#0b1422]' : 'border-gray-200 bg-white'}`}
    >
      <div className="lg:sticky lg:top-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-300">منطقة العرض الثانوية</p>
        <h2 className={`mt-3 text-lg font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>{context.title}</h2>
        <p className={`mt-2 text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{context.description}</p>

        <div className={`mt-6 border-y py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>حالة النظام</span>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> متصل
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>إجمالي المحتوى</span>
            <span className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>188</span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>وصول سريع</h3>
          <div className="mt-3 space-y-1">
            {quickLinks.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => onPageChange(link.page)}
                className={`flex min-h-10 w-full items-center justify-between border-b px-1 py-2 text-right text-sm transition-colors ${isDark ? 'border-white/10 text-slate-400 hover:border-amber-300/40 hover:text-amber-300' : 'border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600'}`}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">←</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSecondaryPanel;