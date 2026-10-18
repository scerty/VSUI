import { type FC, useState } from 'react';

interface NewsItem {
  id?: string;
  category: string;
  date: string;
  views: string;
  title: string;
  description: string;
  image: string;
  categoryColor: string;
  authorName: string;
  authorImage: string;
}

interface NewsFormProps {
  onSave: (news: Omit<NewsItem, 'id'>) => void;
  editingNews?: NewsItem;
}

const NewsForm: FC<NewsFormProps> = ({ onSave, editingNews }) => {
  const [formData, setFormData] = useState<Omit<NewsItem, 'id'>>({
    category: editingNews?.category || 'منح دراسية',
    date: editingNews?.date || new Date().toLocaleDateString('ar-SA'),
    views: editingNews?.views || '0',
    title: editingNews?.title || '',
    description: editingNews?.description || '',
    image: editingNews?.image || '',
    categoryColor: editingNews?.categoryColor || 'yellow',
    authorName: editingNews?.authorName || 'فريق SSB',
    authorImage: editingNews?.authorImage || '',
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
        {editingNews ? 'تعديل الخبر' : 'إضافة خبر جديد'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">الفئة</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            >
              <option>منح دراسية</option>
              <option>فرص تدريب</option>
              <option>مسابقات</option>
              <option>نشاطات طلابية</option>
              <option>أخرى</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">التاريخ</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
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
            placeholder="عنوان الخبر"
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
            placeholder="وصف الخبر"
            rows={4}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">رابط الصورة</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">لون الفئة</label>
            <select
              name="categoryColor"
              value={formData.categoryColor}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            >
              <option value="yellow">أصفر</option>
              <option value="green">أخضر</option>
              <option value="blue">أزرق</option>
              <option value="purple">بنفسجي</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">اسم المؤلف</label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            placeholder="اسم المؤلف"
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-yellow-500 text-slate-900 font-medium rounded-lg py-2 hover:bg-yellow-600 transition"
          >
            {editingNews ? 'تحديث' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
