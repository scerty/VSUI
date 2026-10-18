import { type FC, useState } from 'react';
import Header from './components/layout/Header';
import Hero from './components/home/Hero';
import Activities from './components/home/Activities';
import News from './components/home/News';
import Partners from './components/home/Partners';
import Footer from './components/layout/Footer';
import NewsDetailsPage from './pages/NewsDetailsPage';
import AllActivitiesPage from './pages/AllActivitiesPage';
import QuestionsPage from './pages/QuestionsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css'

const App: FC = () => {
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showQuestionsPage, setShowQuestionsPage] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleNewsSelect = (news: any) => {
    setSelectedNews(news);
  };

  const handleBack = () => {
    setSelectedNews(null);
    setShowAllActivities(false);
    setShowQuestionsPage(false);
  };

  const handleShowAllActivities = () => {
    setSelectedNews(null);
    setShowQuestionsPage(false);
    setShowAllActivities(true);
  };

  const handleShowQuestionsPage = () => {
    setShowQuestionsPage(true);
  };

  const handleShowHome = (section?: 'news' | 'activities') => {
    setSelectedNews(null);
    setShowAllActivities(false);
    setShowQuestionsPage(false);
    if (section) {
      window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    }
  };

  return (
    <div dir="rtl" lang="ar" className="layout-container">
      {showAdminPanel ? (
        <AdminDashboard onExit={() => setShowAdminPanel(false)} />
      ) : (
        <div className="flex-1 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white">
          <Header
            onHomeClick={() => handleShowHome()}
            onShowNews={() => handleShowHome('news')}
            onShowQuestionsPage={handleShowQuestionsPage}
            onShowAllActivities={handleShowAllActivities}
            onAdminClick={() => setShowAdminPanel(true)}
          />
          <main className="min-h-screen">
            {selectedNews ? (
              <NewsDetailsPage news={selectedNews} onBack={handleBack} />
            ) : showAllActivities ? (
              <AllActivitiesPage onBack={handleBack} />
            ) : showQuestionsPage ? (
              <QuestionsPage onBack={handleBack} />
            ) : (
              <>
                <Hero onShowQuestionsPage={handleShowQuestionsPage} onShowAllActivities={handleShowAllActivities} />
                <News onNewsSelect={handleNewsSelect} onShowAllNews={() => handleShowHome('news')} />
                <Activities onShowAll={handleShowAllActivities} />
                <Partners />
              </>
            )}
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
