import { type FC, useState } from 'react';
import { useTheme } from '../AdminDashboard';

interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'seminar' | 'trip' | 'competition' | 'lecture';
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  image: string;
}

const ActivitiesManager: FC = () => {
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
    input: theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50' : 'bg-white border-gray-300',
    inputSolid: theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300',
    card: theme === 'dark' ? 'bg-transparent border-white/10' : 'bg-white border-gray-200 shadow-sm',
    modal: theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200',
    progress: theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200',
    cardDashed: theme === 'dark' ? 'bg-white/[0.025] border-white/15' : 'bg-gray-50 border-gray-300',
  };

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'ورشة عمل: أساسيات البرمجة بلغة Python',
      date: '2026-02-15',
      time: '14:00',
      location: 'قاعة المحاضرات الرئيسية',
      type: 'workshop',
      participants: 45,
      maxParticipants: 50,
      status: 'upcoming',
      description: 'ورشة عمل تفاعلية للمبتدئين في البرمجة',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    },
    {
      id: '2',
      title: 'رحلة تعليمية إلى مكتبة الأسد الوطنية',
      date: '2026-02-20',
      time: '09:00',
      location: 'دمشق',
      type: 'trip',
      participants: 30,
      maxParticipants: 35,
      status: 'upcoming',
      description: 'رحلة تثقيفية للاطلاع على المخطوطات التاريخية',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    },
    {
      id: '3',
      title: 'مسابقة أفضل مشروع تخرج 2026',
      date: '2026-03-01',
      time: '10:00',
      location: 'مدرج الكلية',
      type: 'competition',
      participants: 25,
      maxParticipants: 100,
      status: 'upcoming',
      description: 'مسابقة سنوية لاختيار أفضل مشاريع التخرج',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    time: string;
    location: string;
    type: 'workshop' | 'seminar' | 'trip' | 'competition' | 'lecture';
    maxParticipants: number;
    description: string;
    image: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  }>({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'workshop',
    maxParticipants: 50,
    description: '',
    image: '',
    status: 'upcoming',
  });

  const typeLabels = {
    workshop: 'ورشة عمل',
    seminar: 'ندوة',
    trip: 'رحلة',
    competition: 'مسابقة',
    lecture: 'محاضرة',
  };

  const typeColors = {
    workshop: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    seminar: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    trip: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    competition: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    lecture: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const statusLabels = {
    upcoming: 'قادم',
    ongoing: 'جاري',
    completed: 'منتهي',
    cancelled: 'ملغي',
  };

  const statusColors = {
    upcoming: 'bg-blue-500/20 text-blue-400',
    ongoing: 'bg-emerald-500/20 text-emerald-400',
    completed: 'bg-slate-500/20 text-slate-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const handleCreate = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'workshop',
      maxParticipants: 50,
      description: '',
      image: '',
      status: 'upcoming',
    });
    setShowModal(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      type: activity.type,
      maxParticipants: activity.maxParticipants,
      description: activity.description,
      image: activity.image,
      status: activity.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingActivity) {
      setActivities(activities.map(a => a.id === editingActivity.id ? {
        ...a,
        ...formData,
      } : a));
    } else {
      const newActivity: Activity = {
        id: Date.now().toString(),
        ...formData,
        participants: 0,
      };
      setActivities([newActivity, ...activities]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const getProgressColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 0.9) return 'bg-red-500';
    if (ratio >= 0.7) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">المحتوى والبرامج</span>
          <h2 className={`mt-2 text-2xl font-extrabold tracking-tight ${tc.text} sm:text-3xl`}>إدارة الأنشطة</h2>
          <p className={`mt-1 ${tc.textMuted}`}>تنظيم وإدارة الفعاليات والأنشطة الطلابية</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 rounded-lg border border-amber-300/70 bg-transparent px-5 py-3 font-extrabold text-amber-200 transition-all hover:bg-amber-300/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة نشاط جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className={`${tc.textMuted} text-sm`}>إجمالي الأنشطة</p>
              <p className={`text-2xl font-bold ${tc.text}`}>{activities.length}</p>
            </div>
          </div>
        </div>
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className={`${tc.textMuted} text-sm`}>الأنشطة القادمة</p>
              <p className="text-2xl font-bold text-emerald-400">{activities.filter(a => a.status === 'upcoming').length}</p>
            </div>
          </div>
        </div>
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className={`${tc.textMuted} text-sm`}>إجمالي المشاركين</p>
              <p className="text-2xl font-bold text-purple-400">{activities.reduce((acc, a) => acc + a.participants, 0)}</p>
            </div>
          </div>
        </div>
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={`${tc.textMuted} text-sm`}>المنتهية</p>
              <p className="text-2xl font-bold text-amber-400">{activities.filter(a => a.status === 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`${tc.card} group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/25`}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071522] via-transparent to-transparent" />
              <div className="absolute left-3 top-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md ${typeColors[activity.type]}`}>
                  {typeLabels[activity.type]}
                </span>
              </div>
              <div className="absolute right-3 top-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${statusColors[activity.status]}`}>
                  {statusLabels[activity.status]}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5 p-5">
              <h3 className={`${tc.text} line-clamp-2 text-lg font-extrabold leading-7`}>{activity.title}</h3>
              
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${tc.textMuted}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{activity.date} - {activity.time}</span>
                </div>
                <div className={`flex items-center gap-2 ${tc.textMuted}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{activity.location}</span>
                </div>
              </div>

              {/* Participants Progress */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className={tc.textMuted}>المشاركون</span>
                  <span className={`${tc.text} font-bold`}>{activity.participants} / {activity.maxParticipants}</span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${tc.progress}`}>
                  <div
                    className={`h-full ${getProgressColor(activity.participants, activity.maxParticipants)} transition-all`}
                    style={{ width: `${(activity.participants / activity.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className={`flex gap-2 border-t pt-4 ${tc.border}`}>
                <button
                  onClick={() => handleEdit(activity)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400/10 px-4 py-2.5 font-semibold text-cyan-300 transition-all hover:bg-cyan-400/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-400/10 px-4 py-2.5 font-semibold text-rose-300 transition-all hover:bg-rose-400/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          onClick={handleCreate}
          className={`${tc.cardDashed} group flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all hover:border-amber-300/50 ${tc.bgHover}`}
        >
          <div className={`p-4 ${tc.input} rounded-full group-hover:bg-yellow-500/20 transition-all`}>
            <svg className={`w-8 h-8 ${tc.textSubtle} group-hover:text-yellow-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className={`${tc.textSubtle} group-hover:text-yellow-400`}>إضافة نشاط جديد</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${tc.modal} rounded-2xl w-full max-w-2xl mx-4 border shadow-2xl`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${tc.border}`}>
              <h2 className={`text-xl font-bold ${tc.text}`}>
                {editingActivity ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg ${tc.textMuted} hover:${tc.text} ${tc.bgHover}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>عنوان النشاط</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  placeholder="أدخل عنوان النشاط..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>التاريخ</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  />
                </div>
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>الوقت</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>المكان</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  placeholder="أدخل مكان النشاط..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>نوع النشاط</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  >
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>الحد الأقصى للمشاركين</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                    className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text} resize-none`}
                  rows={3}
                  placeholder="وصف مختصر للنشاط..."
                />
              </div>

              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>رابط الصورة</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  placeholder="https://..."
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-3 p-6 border-t ${tc.border}`}>
              <button
                onClick={() => setShowModal(false)}
                className={`px-6 py-2 rounded-xl ${tc.textMuted} ${tc.bgHover}`}
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl bg-gradient-to-l from-yellow-500 to-amber-500 text-slate-900 font-bold hover:from-yellow-600 hover:to-amber-600"
              >
                {editingActivity ? 'حفظ التعديلات' : 'إضافة النشاط'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesManager;
