import { type FC, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ActivitiesManager from '../components/admin/pages/ActivitiesManager';
import NewsManager from '../components/admin/pages/NewsManager';
import EventsManager from '../components/admin/pages/EventsManager';

type AdminTab = 'activities' | 'news' | 'events';

const AdminPage: FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('activities');

  return (
    <AdminLayout onTabChange={setActiveTab} activeTab={activeTab}>
      {activeTab === 'activities' && <ActivitiesManager />}
      {activeTab === 'news' && <NewsManager />}
      {activeTab === 'events' && <EventsManager />}
    </AdminLayout>
  );
};

export default AdminPage;
