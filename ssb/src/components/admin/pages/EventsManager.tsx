import { type FC, useState } from 'react';
import { useTheme } from '../AdminDashboard';

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'conference' | 'meeting' | 'deadline' | 'holiday' | 'exam';
  color: string;
  description: string;
  isAllDay: boolean;
  reminder: boolean;
}

const EventsManager: FC = () => {
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
    calendarDay: theme === 'dark' ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100',
    calendarDayOther: theme === 'dark' ? 'bg-slate-800/30 text-slate-600' : 'bg-gray-100/50 text-gray-400',
    eventItem: theme === 'dark' ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100',
  };

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'مؤتمر الطلاب السوريين السنوي',
      startDate: '2026-03-15',
      endDate: '2026-03-17',
      type: 'conference',
      color: '#facc15',
      description: 'المؤتمر السنوي لتجمع الطلاب السوريين',
      isAllDay: true,
      reminder: true,
    },
    {
      id: '2',
      title: 'موعد تقديم طلبات المنح',
      startDate: '2026-02-28',
      endDate: '2026-02-28',
      type: 'deadline',
      color: '#ef4444',
      description: 'آخر موعد لتقديم طلبات منحة DAAD',
      isAllDay: true,
      reminder: true,
    },
    {
      id: '3',
      title: 'اجتماع مجلس الإدارة',
      startDate: '2026-02-20',
      endDate: '2026-02-20',
      type: 'meeting',
      color: '#3b82f6',
      description: 'الاجتماع الشهري لمجلس الإدارة',
      isAllDay: false,
      reminder: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // February 2026
  const [formData, setFormData] = useState<{
    title: string;
    startDate: string;
    endDate: string;
    type: 'conference' | 'meeting' | 'deadline' | 'holiday' | 'exam';
    color: string;
    description: string;
    isAllDay: boolean;
    reminder: boolean;
  }>({
    title: '',
    startDate: '',
    endDate: '',
    type: 'meeting',
    color: '#facc15',
    description: '',
    isAllDay: false,
    reminder: true,
  });

  const typeLabels = {
    conference: 'مؤتمر',
    meeting: 'اجتماع',
    deadline: 'موعد نهائي',
    holiday: 'عطلة',
    exam: 'امتحان',
  };

  const typeColors = {
    conference: '#facc15',
    meeting: '#3b82f6',
    deadline: '#ef4444',
    holiday: '#22c55e',
    exam: '#a855f7',
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
  };

  const handleCreate = (date?: Date) => {
    setEditingEvent(null);
    const dateStr = date ? date.toISOString().split('T')[0] : '';
    setFormData({
      title: '',
      startDate: dateStr,
      endDate: dateStr,
      type: 'meeting',
      color: typeColors.meeting,
      description: '',
      isAllDay: false,
      reminder: true,
    });
    setShowModal(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      color: event.color,
      description: event.description,
      isAllDay: event.isAllDay,
      reminder: event.reminder,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? {
        ...e,
        ...formData,
      } : e));
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
      };
      setEvents([...events, newEvent]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">التقويم التشغيلي</span>
          <h2 className={`mt-2 text-2xl font-extrabold tracking-tight ${tc.text} sm:text-3xl`}>إدارة المواعيد</h2>
          <p className={`mt-1 ${tc.textMuted}`}>تنظيم وإدارة المواعيد والأحداث</p>
        </div>
        <button
          onClick={() => handleCreate()}
          className="flex items-center justify-center gap-2 rounded-lg border border-amber-300/70 bg-transparent px-5 py-3 font-extrabold text-amber-200 transition-all hover:bg-amber-300/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة حدث جديد
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Calendar */}
        <div className={`rounded-2xl border p-4 sm:p-6 xl:col-span-2 ${tc.card}`}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className={`p-2 rounded-lg ${tc.input} ${tc.textMuted} hover:${tc.text}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <h3 className={`text-xl font-bold ${tc.text}`}>
              {currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className={`p-2 rounded-lg ${tc.input} ${tc.textMuted} hover:${tc.text}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
              <div key={day} className={`text-center ${tc.textSubtle} text-sm py-2`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              const isToday = day.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  onClick={() => handleCreate(day.date)}
                  className={`min-h-[80px] p-2 rounded-lg cursor-pointer transition-all ${
                    day.isCurrentMonth
                      ? tc.calendarDay
                      : tc.calendarDayOther
                  } ${isToday ? 'ring-2 ring-yellow-500' : ''}`}
                >
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-yellow-400' : day.isCurrentMonth ? tc.text : tc.textSubtle
                  }`}>
                    {day.date.getDate()}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(event);
                        }}
                        className="text-xs px-1 py-0.5 rounded truncate"
                        style={{ backgroundColor: event.color + '30', color: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className={`text-xs ${tc.textSubtle}`}>+{dayEvents.length - 2} المزيد</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className={`${tc.card} rounded-2xl border p-6`}>
          <h3 className={`text-lg font-bold ${tc.text} mb-4`}>الأحداث القادمة</h3>
          <div className="space-y-3">
            {events
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl ${tc.eventItem} border-r-4 transition-all cursor-pointer group`}
                  style={{ borderColor: event.color }}
                  onClick={() => handleEdit(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`${tc.text} font-medium`}>{event.title}</h4>
                      <p className={`${tc.textSubtle} text-sm mt-1`}>{event.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className={tc.textMuted}>{event.startDate}</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: event.color + '30', color: event.color }}>
                          {typeLabels[event.type]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

            {events.length === 0 && (
              <div className="text-center py-8">
                <svg className={`w-12 h-12 mx-auto ${tc.textSubtle} mb-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className={tc.textSubtle}>لا توجد أحداث</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${tc.modal} rounded-2xl w-full max-w-lg mx-4 border shadow-2xl`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${tc.border}`}>
              <h2 className={`text-xl font-bold ${tc.text}`}>
                {editingEvent ? 'تعديل الحدث' : 'إضافة حدث جديد'}
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
            <div className="p-6 space-y-4">
              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>عنوان الحدث</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  placeholder="أدخل عنوان الحدث..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>تاريخ البداية</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  />
                </div>
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>تاريخ النهاية</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>نوع الحدث</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const type = e.target.value as keyof typeof typeColors;
                    setFormData({ ...formData, type, color: typeColors[type] });
                  }}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text}`}
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block ${tc.text} font-medium mb-2`}>الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full ${tc.bgSolid} border ${tc.borderSolid} rounded-xl px-4 py-3 ${tc.text} resize-none`}
                  rows={3}
                  placeholder="وصف الحدث..."
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAllDay}
                    onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                    className={`w-4 h-4 rounded ${tc.inputSolid} text-yellow-500`}
                  />
                  <span className={tc.text}>طوال اليوم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.reminder}
                    onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                    className={`w-4 h-4 rounded ${tc.inputSolid} text-yellow-500`}
                  />
                  <span className={tc.text}>تذكير</span>
                </label>
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
                {editingEvent ? 'حفظ التعديلات' : 'إضافة الحدث'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
