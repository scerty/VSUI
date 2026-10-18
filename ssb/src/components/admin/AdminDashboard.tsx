import { type FC, useState, createContext, useContext } from 'react';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminActivityBar from './layout/AdminActivityBar';
import AdminSecondaryPanel from './layout/AdminSecondaryPanel';
import DashboardHome from './pages/DashboardHome';
import ActivitiesManager from './pages/ActivitiesManager';
import NewsManager from './pages/NewsManager';
import EventsManager from './pages/EventsManager';
import SettingsPage from './pages/SettingsPage';

export type AdminPage = 'dashboard' | 'activities' | 'news' | 'events' | 'settings';
export type Theme = 'dark' | 'light';

// Theme Context
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface AdminDashboardProps {
  onExit: () => void;
}

const AdminDashboard: FC<AdminDashboardProps> = ({ onExit }) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(prev => {
        const nextOpen = !prev;
        if (nextOpen) {
          setSidebarCollapsed(false);
        }
        return nextOpen;
      });
      return;
    }

    setSidebarCollapsed(prev => !prev);
  };

  const handlePageChange = (page: AdminPage) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
  };

  const handleActivityPageChange = (page: AdminPage) => {
    const shouldCollapse = currentPage === page && !sidebarCollapsed;
    setCurrentPage(page);
    setMobileSidebarOpen(false);
    setSidebarCollapsed(shouldCollapse);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome onNavigate={setCurrentPage} />;
      case 'activities':
        return <ActivitiesManager />;
      case 'news':
        return <NewsManager />;
      case 'events':
        return <EventsManager />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome onNavigate={setCurrentPage} />;
    }
  };

  // Theme classes
  const themeClasses = {
    dark: {
      bg: 'bg-[#0b1220]',
      main: 'bg-[#0d1726]',
    },
    light: {
      bg: 'bg-[#eef2f7]',
      main: 'bg-[#f7f9fc]',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`admin-minimal flex min-h-screen flex-col ${themeClasses[theme].bg} transition-colors duration-300`} dir="rtl">
        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="إغلاق الخلفية"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-[#0b1220]/70 lg:hidden"
          />
        )}

        {/* Full-width navigation region */}
        <AdminHeader
          onToggleSidebar={handleSidebarToggle}
        />

        {/* Activity bar region */}
        <AdminActivityBar
          currentPage={currentPage}
          onPageChange={handleActivityPageChange}
        />

        {/* Primary sidebar region */}
        <AdminSidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onExit={onExit}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className={`flex min-h-[calc(100vh-5rem)] min-w-0 flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:pr-32' : 'lg:pr-[19rem]'}`}>
          <div className="flex min-h-[calc(100vh-5rem)] min-w-0 flex-1 flex-col lg:flex-row" dir="ltr">
            <AdminSecondaryPanel currentPage={currentPage} onPageChange={handlePageChange} />

            {/* Main display region */}
            <main data-dashboard-region="main" dir="rtl" className={`order-1 min-w-0 flex-1 overflow-auto p-4 transition-colors duration-300 sm:p-6 lg:order-2 lg:p-8 ${themeClasses[theme].main}`}>
              {renderPage()}
            </main>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default AdminDashboard;
