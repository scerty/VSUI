import { type FC, useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import { useTheme } from '../AdminDashboard';
import { newsAPI, authorsAPI, categoriesAPI, type News, type Author, type Category } from '../../../services/api';

interface NewsItem extends News {
  status: 'published' | 'draft';
}

const NewsManager: FC = () => {
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
    tableHead: theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50',
    placeholder: theme === 'dark' ? 'placeholder-slate-500' : 'placeholder-gray-400',
  };

  const [news, setNews] = useState<NewsItem[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsData, authorsData, categoriesData] = await Promise.all([
          newsAPI.getAll({ all: 'true' } as any),
          authorsAPI.getAll(),
          categoriesAPI.getAll(),
        ]);
        
        // Transform API response to match component interface
        const transformedNews = (newsData.results || newsData || []).map((item: News) => ({
          ...item,
          status: item.is_published ? 'published' : 'draft',
        }));
        
        setNews(transformedNews);
        setAuthors(authorsData.results || authorsData || []);
        setCategories(categoriesData.results || categoriesData || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('فشل في تحميل البيانات. تأكد من تشغيل الخادم.');
        // Use fallback data for development
        setNews([]);
        setAuthors([{ id: 1, name: 'فريق SSB' }]);
        setCategories([
          { id: 1, name: 'أخبار تعليمية', color: 'blue' },
          { id: 2, name: 'أخبار تقنية', color: 'green' },
          { id: 3, name: 'منح دراسية', color: 'yellow' },
          { id: 4, name: 'فرص تدريب', color: 'green' },
          { id: 5, name: 'مسابقات', color: 'purple' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    content: string;
    category: number | null;
    author: number | null;
    image: string;
    status: 'published' | 'draft';
  }>({
    title: '',
    description: '',
    content: '',
    category: null,
    author: null,
    image: '',
    status: 'draft',
  });

  const statusColors = {
    published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const statusLabels = {
    published: 'منشور',
    draft: 'مسودة',
  };

  const categoryColors: Record<string, string> = {
    blue: 'bg-sky-400/10 text-sky-300',
    green: 'bg-emerald-400/10 text-emerald-300',
    yellow: 'bg-amber-400/10 text-amber-200',
    purple: 'bg-violet-400/10 text-violet-300',
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      category: categories[0]?.id || null,
      author: authors[0]?.id || null,
      image: '',
      status: 'draft',
    });
    setShowEditor(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content || '',
      category: item.category || null,
      author: item.author || null,
      image: item.image,
      status: item.status,
    });
    setShowEditor(true);
  };

  const handleSave = async (nextStatus: 'published' | 'draft' = formData.status) => {
    setIsSaving(true);
    try {
      const newsData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category ?? undefined,
        author: formData.author ?? undefined,
        image: formData.image,
        is_published: nextStatus === 'published',
        date: new Date().toISOString().split('T')[0],
      };

      if (editingItem && editingItem.id) {
        await newsAPI.update(String(editingItem.id), newsData);
      } else {
        await newsAPI.create(newsData as any);
      }
      
      // Refresh data
      const newsResponse = await newsAPI.getAll({ all: 'true' } as any);
      const transformedNews = (newsResponse.results || newsResponse || []).map((item: News) => ({
        ...item,
        status: item.is_published ? 'published' : 'draft',
      }));
      setNews(transformedNews);
      setShowEditor(false);
    } catch (err) {
      console.error('Failed to save:', err);
      alert('فشل في حفظ المقالة');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      try {
        await newsAPI.delete(String(id));
        setNews(news.filter(n => n.id !== id));
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('فشل في حذف المقالة');
      }
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await newsAPI.update(String(id), { is_published: true } as any);
      setNews(news.map(n => n.id === id ? { ...n, status: 'published' as const, is_published: true } : n));
    } catch (err) {
      console.error('Failed to publish:', err);
      alert('فشل في نشر المقالة');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${tc.card} rounded-xl p-6 border text-center`}>
        <p className="text-red-400 mb-4">{error}</p>
        <p className={tc.textMuted}>يرجى التأكد من تشغيل الخادم على المنفذ 8000</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">المحتوى التحريري</span>
          <h2 className={`mt-2 text-2xl font-extrabold tracking-tight ${tc.text} sm:text-3xl`}>الأخبار والمقالات</h2>
          <p className={`mt-1 ${tc.textMuted}`}>إدارة ونشر المقالات والأخبار</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 rounded-lg border border-amber-300/70 bg-transparent px-5 py-3 font-extrabold text-amber-200 transition-all hover:bg-amber-300/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          كتابة مقال جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <p className={`${tc.textMuted} text-sm`}>إجمالي المقالات</p>
          <p className={`text-2xl font-bold ${tc.text}`}>{news.length}</p>
        </div>
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <p className={`${tc.textMuted} text-sm`}>المنشورة</p>
          <p className="text-2xl font-bold text-emerald-400">{news.filter(n => n.status === 'published').length}</p>
        </div>
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <p className={`${tc.textMuted} text-sm`}>المسودات</p>
          <p className={`text-2xl font-bold ${tc.textMuted}`}>{news.filter(n => n.status === 'draft').length}</p>
        </div>
        <div className={`${tc.card} rounded-2xl border p-5`}>
          <p className={`${tc.textMuted} text-sm`}>إجمالي المشاهدات</p>
          <p className="text-2xl font-bold text-yellow-400">{news.reduce((acc, n) => acc + (n.views || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`flex w-full flex-wrap gap-2 rounded-2xl border p-2 sm:w-fit ${tc.bg} ${tc.border}`}>
        <button type="button" className="rounded-xl bg-amber-300 px-4 py-2 font-bold text-[#071522]">الكل</button>
        <button type="button" className={`rounded-xl px-4 py-2 ${tc.textMuted} ${tc.bgHover}`}>منشور</button>
        <button type="button" className={`rounded-xl px-4 py-2 ${tc.textMuted} ${tc.bgHover}`}>مسودة</button>
        <button type="button" className={`rounded-xl px-4 py-2 ${tc.textMuted} ${tc.bgHover}`}>مجدول</button>
      </div>

      {/* News List */}
      <div className={`${tc.card} overflow-hidden rounded-2xl border`}>
        <div className={`flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between ${tc.border}`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <svg className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 ${tc.textSubtle}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="البحث في المقالات..."
                className={`${tc.input} w-full rounded-xl border py-2 pl-4 pr-10 ${tc.text} ${tc.placeholder} sm:w-64`}
              />
            </div>
              <select aria-label="تصفية حسب الفئة" className={`${tc.input} rounded-xl border px-4 py-2 ${tc.text}`}>
              <option>جميع الفئات</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button className={`p-2 rounded-lg ${tc.input} ${tc.textMuted} hover:${tc.text}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className={`p-2 rounded-lg ${tc.input} ${tc.textMuted} hover:${tc.text}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
        <table className="w-full min-w-0 sm:min-w-[760px]">
          <thead className={tc.tableHead}>
            <tr>
              <th className={`text-right ${tc.textMuted} font-medium p-4`}>المقال</th>
              <th className={`hidden text-right ${tc.textMuted} font-medium p-4 sm:table-cell`}>الفئة</th>
              <th className={`hidden text-right ${tc.textMuted} font-medium p-4 sm:table-cell`}>الحالة</th>
              <th className={`hidden text-right ${tc.textMuted} font-medium p-4 sm:table-cell`}>التاريخ</th>
              <th className={`hidden text-right ${tc.textMuted} font-medium p-4 sm:table-cell`}>المشاهدات</th>
              <th className={`text-right ${tc.textMuted} font-medium p-4`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className={`border-t ${tc.border} ${tc.bgHover}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="hidden h-12 w-16 rounded-xl object-cover ring-1 ring-white/10 sm:block"
                    />
                    <div>
                      <p className={`${tc.text} font-medium line-clamp-1`}>{item.title}</p>
                      <p className={`${tc.textSubtle} text-sm line-clamp-1`}>{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${categoryColors[item.category_color || 'blue'] ?? categoryColors.blue}`}>
                    {item.category_name || 'غير مصنف'}
                  </span>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className={`hidden p-4 ${tc.textMuted} sm:table-cell`}>{item.date}</td>
                <td className={`hidden p-4 ${tc.textMuted} sm:table-cell`}>{(item.views || 0).toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {item.status === 'draft' && (
                      <button
                        onClick={() => item.id && handlePublish(item.id)}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        title="نشر"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      title="تعديل"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {news.length === 0 && (
          <div className="p-12 text-center">
            <svg className={`w-16 h-16 mx-auto ${tc.textSubtle} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className={tc.textSubtle}>لا توجد مقالات حالياً</p>
            <button onClick={handleCreate} className="mt-4 text-yellow-400 hover:text-yellow-300">
              أضف مقالك الأول
            </button>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-[#050b14]/90 px-2 py-2 sm:px-5 sm:py-5">
          <div className={`${tc.modal} flex h-[calc(100vh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-xl border sm:h-[calc(100vh-2.5rem)]`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between border-b px-4 py-3 sm:px-6 ${tc.border}`}>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">المحرر التحريري</p>
                <h2 className={`mt-1 truncate text-lg font-extrabold ${tc.text}`}>
                  {editingItem ? 'تعديل المقال' : 'كتابة مقال جديد'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => !isSaving && setShowEditor(false)}
                className={`rounded-lg p-2 ${tc.textMuted} ${tc.bgHover}`}
                aria-label="إغلاق المحرر"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                {/* Main Content */}
                <div className="min-w-0 space-y-5">
                  {/* Title */}
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${tc.text}`}>عنوان المقال</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="أدخل عنوان المقال..."
                      className={`w-full ${tc.bgSolid} rounded-lg border ${tc.borderSolid} px-4 py-3 text-lg ${tc.text} ${tc.placeholder} focus:border-amber-300 focus:outline-none`}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${tc.text}`}>الوصف المختصر</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="وصف مختصر يظهر في قائمة المقالات..."
                      rows={3}
                      className={`w-full ${tc.bgSolid} rounded-lg border ${tc.borderSolid} px-4 py-3 ${tc.text} ${tc.placeholder} resize-none focus:border-amber-300 focus:outline-none`}
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className={`block text-sm font-semibold ${tc.text}`}>محتوى المقال</label>
                      <span className={`text-[11px] ${tc.textSubtle}`}>احفظ المسودة باستمرار أثناء الكتابة</span>
                    </div>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="ابدأ الكتابة هنا..."
                      theme={theme}
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-3 lg:border-r lg:border-white/10 lg:pr-5">
                  {/* Publish Card */}
                  <div className={`${tc.card} rounded-lg border p-4`}>
                    <h3 className={`${tc.text} mb-3 text-sm font-bold`}>النشر</h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`mb-2 block text-xs ${tc.textMuted}`}>الحالة</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className={`w-full ${tc.inputSolid} rounded-lg border px-3 py-2 ${tc.text}`}
                        >
                          <option value="draft">مسودة</option>
                          <option value="published">منشور</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className={`${tc.card} rounded-lg border p-4`}>
                    <h3 className={`${tc.text} mb-3 text-sm font-bold`}>الفئة</h3>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          category: e.target.value ? Number(e.target.value) : null,
                        });
                      }}
                      className={`w-full ${tc.inputSolid} rounded-lg border px-3 py-2 ${tc.text}`}
                    >
                      <option value="">اختر فئة</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Image */}
                  <div className={`${tc.card} rounded-lg border p-4`}>
                    <h3 className={`${tc.text} mb-3 text-sm font-bold`}>الصورة الرئيسية</h3>
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="رابط الصورة..."
                          className={`mb-2 w-full ${tc.inputSolid} rounded-lg border px-3 py-2 text-sm ${tc.text}`}
                        />
                        <div className={`border-2 border-dashed ${tc.borderSolid} rounded-lg p-6 text-center`}>
                          <svg className={`w-8 h-8 mx-auto ${tc.textSubtle} mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className={`${tc.textSubtle} text-sm`}>أو اسحب صورة هنا</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Author */}
                  <div className={`${tc.card} rounded-lg border p-4`}>
                    <h3 className={`${tc.text} mb-3 text-sm font-bold`}>الكاتب</h3>
                    <select
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value ? Number(e.target.value) : null })}
                      className={`w-full ${tc.inputSolid} rounded-lg border px-3 py-2 ${tc.text}`}
                    >
                      <option value="">اختر كاتب</option>
                      {authors.map(auth => (
                        <option key={auth.id} value={auth.id}>{auth.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex flex-col-reverse gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${tc.border}`}>
              <button
                type="button"
                onClick={() => !isSaving && setShowEditor(false)}
                className={`rounded-lg px-4 py-2 ${tc.textMuted} ${tc.bgHover} transition-all`}
              >
                إلغاء
              </button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                  className={`rounded-lg border px-4 py-2 ${tc.inputSolid} ${tc.text} transition-all hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isSaving ? 'جارٍ الحفظ...' : 'حفظ كمسودة'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  disabled={isSaving}
                  className="rounded-lg border border-amber-300/70 bg-amber-300 px-5 py-2 font-bold text-[#071522] transition-all hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? 'جارٍ النشر...' : 'نشر المقال'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
