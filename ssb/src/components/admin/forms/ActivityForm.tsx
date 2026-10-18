import { type FC, useState } from 'react';

interface Activity {
  id?: string;
  date: string;
  year: string;
  title: string;
  description: string;
  type: string;
  time: string;
}

interface ActivityFormProps {
  onSave: (activity: Omit<Activity, 'id'>) => void;
  editingActivity?: Activity;
}

const ActivityForm: FC<ActivityFormProps> = ({ onSave, editingActivity }) => {
  const [formData, setFormData] = useState<Omit<Activity, 'id'>>({
    date: editingActivity?.date || '',
    year: editingActivity?.year || new Date().getFullYear().toString(),
    title: editingActivity?.title || '',
    description: editingActivity?.description || '',
    type: editingActivity?.type || 'حضوري',
    time: editingActivity?.time || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">
        {editingActivity ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">التاريخ</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="مثال: نوفمبر 15"
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">السنة</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2025"
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">العنوان</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان النشاط"
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
            placeholder="وصف النشاط"
            rows={4}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">نوع النشاط</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            >
              <option>حضوري</option>
              <option>عن بعد</option>
              <option>هجين</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">الوقت</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="مثال: 6:00 مساءً"
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-yellow-500 text-slate-900 font-medium rounded-lg py-2 hover:bg-yellow-600 transition"
          >
            {editingActivity ? 'تحديث' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
