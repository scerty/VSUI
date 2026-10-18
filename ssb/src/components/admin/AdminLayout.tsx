import { type FC, type ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: 'activities' | 'news' | 'events';
  onTabChange: (tab: 'activities' | 'news' | 'events') => void;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'activities', label: 'إدارة الأنشطة', icon: '📅' },
    { id: 'news', label: 'إدارة الأخبار', icon: '📰' },
    { id: 'events', label: 'إدارة الفعاليات', icon: '🎯' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">لوحة التحكم الإدارية</h1>
          <p className="text-slate-400 mt-2">إدارة المحتوى والأنشطة والأخبار</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-4 font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
