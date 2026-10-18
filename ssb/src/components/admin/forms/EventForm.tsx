import { type FC, useState } from 'react';

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
  attendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface EventFormProps {
  onSave: (event: Omit<Event, 'id'>) => void;
  editingEvent?: Event;
}

const EventForm: FC<EventFormProps> = ({ onSave, editingEvent }) => {
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: editingEvent?.title || '',
    description: editingEvent?.description || '',
    date: editingEvent?.date || '',
    time: editingEvent?.time || '',
    location: editingEvent?.location || '',
    capacity: editingEvent?.capacity || 100,
    attendees: editingEvent?.attendees || 0,
    status: editingEvent?.status || 'upcoming',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'capacity' || name === 'attendees') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">
        {editingEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">اسم الفعالية</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="اسم الفعالية"
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">الوصف</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="وصف الفعالية"
            rows={4}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">التاريخ</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">الوقت</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">المكان</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="مكان الفعالية"
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">السعة</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">عدد الحضور</label>
            <input
              type="number"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">الحالة</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            >
              <option value="upcoming">قادم</option>
              <option value="ongoing">جاري الآن</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-yellow-500 text-slate-900 font-medium rounded-lg py-2 hover:bg-yellow-600 transition"
          >
            {editingEvent ? 'تحديث' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
