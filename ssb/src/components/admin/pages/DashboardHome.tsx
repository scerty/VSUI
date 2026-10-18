import { type FC } from 'react';
import { type AdminPage, useTheme } from '../AdminDashboard';

interface DashboardHomeProps {
  onNavigate: (page: AdminPage) => void;
}

const DashboardHome: FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  
  // Theme classes
  const tc = {
    bg: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    bgSolid: theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50',
    bgHover: theme === 'dark' ? 'hover:bg-slate-700/20' : 'hover:bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-gray-600',
    textSubtle: theme === 'dark' ? 'text-slate-500' : 'text-gray-500',
    border: theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200',
    borderSolid: theme === 'dark' ? 'border-slate-600' : 'border-gray-300',
    card: theme === 'dark' ? 'bg-transparent border-white/10' : 'bg-white border-gray-200 shadow-sm',
    cardHover: theme === 'dark' ? 'hover:border-amber-200/25 hover:bg-white/[0.06]' : 'hover:border-gray-300',
    activityItem: theme === 'dark' ? 'bg-white/[0.035] hover:bg-white/[0.07]' : 'bg-gray-50 hover:bg-gray-100',
    quickAction: theme === 'dark' ? 'bg-white/[0.035] border-white/10 hover:bg-white/[0.07] hover:border-amber-200/20' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300',
    chartPlaceholder: theme === 'dark' ? 'text-slate-600' : 'text-gray-400',
  };

  const stats = [
    {
      title: 'إجمالي الأنشطة',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-sky-400/10 text-sky-300',
    },
    {
      title: 'الأخبار المنشورة',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-emerald-400/10 text-emerald-300',
    },
    {
      title: 'الفعاليات القادمة',
      value: '8',
      change: '+3',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-violet-400/10 text-violet-300',
    },
    {
      title: 'إجمالي المشاهدات',
      value: '12.5K',
      change: '+24%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-amber-400/10 text-amber-300',
    },
  ];

  const quickActions = [
    { label: 'إضافة نشاط جديد', page: 'activities' as AdminPage, color: 'bg-blue-500' },
    { label: 'كتابة مقال جديد', page: 'news' as AdminPage, color: 'bg-emerald-500' },
    { label: 'إنشاء فعالية', page: 'events' as AdminPage, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { type: 'news', title: 'تم نشر خبر جديد: منحة دراسية في كامبريدج', time: 'منذ 5 دقائق', icon: '📰' },
    { type: 'activity', title: 'تم تعديل نشاط: لقاء الطلاب المستجدين', time: 'منذ ساعة', icon: '📅' },
    { type: 'event', title: 'تم إنشاء فعالية جديدة: ملتقى الخريجين', time: 'منذ 3 ساعات', icon: '🎯' },
    { type: 'news', title: 'تم حذف خبر قديم', time: 'منذ يوم', icon: '🗑️' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-transparent p-6 sm:p-8">
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> النظام متصل
            </span>
            <h2 className={`mb-2 mt-4 text-2xl font-extrabold tracking-tight ${tc.text} sm:text-3xl`}>مرحباً بك في لوحة الإدارة</h2>
            <p className={tc.textMuted}>إدارة محتوى منصة الرابطة السورية للطلاب بسهولة</p>
          </div>
          <div className="flex items-center justify-between gap-6 lg:block lg:text-left">
            <div className="text-left">
              <p className={`${tc.textSubtle} text-sm`}>تاريخ اليوم</p>
              <p className={`${tc.text} font-bold`}>{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="hidden h-14 w-14 place-items-center rounded-xl border border-amber-300/30 text-2xl text-amber-300 sm:grid">✦</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${tc.card} group rounded-2xl border p-5 transition-colors duration-300 ${tc.cardHover}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`${tc.textMuted} text-sm mb-1`}>{stat.title}</p>
                <p className={`mt-1 text-3xl font-extrabold tracking-tight ${tc.text}`}>{stat.value}</p>
                <span className={`mt-2 block text-xs font-semibold ${stat.changeType === 'positive' ? 'text-emerald-400' : tc.textMuted}`}>
                  {stat.change} من الشهر الماضي
                </span>
              </div>
              <div className={`rounded-lg p-3.5 transition-colors ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Quick Actions */}
        <div className={`${tc.card} rounded-2xl border p-6`}>
          <h3 className={`mb-5 flex items-center gap-2 text-lg font-bold ${tc.text}`}>
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            إجراءات سريعة
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onNavigate(action.page)}
                className={`group flex min-h-16 w-full items-center gap-3 rounded-xl border p-3.5 text-right transition-all ${tc.quickAction}`}
              >
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${action.color} text-white shadow-lg`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className={`${tc.text} font-medium`}>{action.label}</span>
                <svg className={`w-5 h-5 ${tc.textSubtle} mr-auto group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-2xl border p-6 xl:col-span-2 ${tc.card}`}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className={`flex items-center gap-2 text-lg font-bold ${tc.text}`}>
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            النشاط الأخير
            </h3>
            <span className={`text-xs ${tc.textSubtle}`}>آخر 24 ساعة</span>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 rounded-xl p-3.5 ${tc.activityItem} transition-all`}
              >
                <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-slate-600/50' : 'bg-gray-200'} flex items-center justify-center text-xl`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className={`${tc.text} font-medium`}>{activity.title}</p>
                  <p className={`${tc.textSubtle} text-sm`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual summaries */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={`${tc.card} rounded-2xl border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-bold ${tc.text}`}>إحصائيات المشاهدات</h3>
              <p className={`mt-1 text-sm ${tc.textSubtle}`}>الأداء خلال آخر 7 أيام</p>
            </div>
            <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300">+24%</span>
          </div>
          <div className="mt-8 flex h-48 items-end gap-3 border-b border-white/10 px-2">
            {[38, 58, 46, 72, 64, 88, 78].map((height, index) => (
              <div key={index} className="group flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-cyan-300/70 opacity-80 transition-colors group-hover:bg-amber-300" style={{ height: `${height}%` }} />
                <span className={`text-[10px] ${tc.textSubtle}`}>{['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'][index]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${tc.card} rounded-2xl border p-6`}>
          <div>
            <h3 className={`text-lg font-bold ${tc.text}`}>توزيع المحتوى</h3>
            <p className={`mt-1 text-sm ${tc.textSubtle}`}>نظرة سريعة على مكتبة المنصة</p>
          </div>
          <div className="mt-7 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <div className="grid h-40 w-40 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#22d3ee 0 42%, #fbbf24 42% 74%, #a78bfa 74% 100%)' }}>
              <div className={`grid h-24 w-24 place-items-center rounded-full ${theme === 'dark' ? 'bg-[#122438]' : 'bg-white'}`}>
                <span className={`text-2xl font-extrabold ${tc.text}`}>188</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['الأخبار', '42%', 'bg-cyan-300'],
                ['الأنشطة', '32%', 'bg-amber-300'],
                ['الفعاليات', '26%', 'bg-violet-300'],
              ].map(([label, value, color]) => (
                <div key={label} className="flex min-w-40 items-center justify-between gap-5">
                  <span className={`flex items-center gap-2 ${tc.textMuted}`}><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>
                  <span className={`font-bold ${tc.text}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
