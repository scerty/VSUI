import { type FC, useState, useEffect } from 'react';

interface NewsDetailsProps {
  news: any;
  onBack: () => void;
}

const NewsDetails: FC<NewsDetailsProps> = ({ news, onBack }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative bg-white text-slate-900">
      {/* Header with Background Image */}
      <header className="relative h-96">
        <img src={news.image} alt={news.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <div className="w-full max-w-[1200px] px-4 md:px-8">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-all mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span>العودة إلى الأخبار</span>
            </button>
            <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight">{news.title}</h1>
            <div className="flex items-center justify-center gap-6 text-sm mt-4">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium bg-${news.categoryColor}-400 text-slate-900`}>
                {news.category}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {news.date}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon />
                {news.views} مشاهدة
              </span>
            </div>
          </div>
        </div>
        {/* Reading Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
          <div className="h-full bg-yellow-500" style={{ width: `${scrollProgress}%` }} />
        </div>
      </header>

      <div className="relative py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <img src={news.authorImage} alt={news.authorName} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-800 text-xl">{news.authorName}</p>
                  <p className="text-sm text-slate-600">ناشر</p>
                </div>
              </div>

              <div className="max-w-none text-slate-800">
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">{news.description}</p>
                {news.content ? (
                  news.content.split('\n\n').map((paragraph: string, index: number) => {
                    // Main heading (##)
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} style={{ fontSize: '1.75rem', fontWeight: 700 }} className="text-slate-900 mt-10 mb-4 border-r-4 border-yellow-500 pr-4">{paragraph.replace('## ', '')}</h2>;
                    }
                    // Sub heading (###)
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={index} style={{ fontSize: '1.35rem', fontWeight: 600 }} className="text-slate-800 mt-8 mb-3">{paragraph.replace('### ', '')}</h3>;
                    }
                    // Sub-sub heading (####)
                    if (paragraph.startsWith('#### ')) {
                      return <h4 key={index} style={{ fontSize: '1.15rem', fontWeight: 500 }} className="text-slate-700 mt-6 mb-2">{paragraph.replace('#### ', '')}</h4>;
                    }
                    // Regular paragraph
                    return <p key={index} style={{ fontSize: '1rem', fontWeight: 400 }} className="text-slate-700 leading-relaxed mb-4">{paragraph}</p>;
                  })
                ) : (
                  <>
                    <p>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.</p>
                    <p>إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.</p>
                  </>
                )}
              </div>

              {/* Share Article Section */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">مشاركة المقالة</h3>
                  <div className="flex items-center gap-2">
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <ShareIcon platform="facebook" />
                    </a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <ShareIcon platform="twitter" />
                    </a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <ShareIcon platform="linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <aside>
              <div className="sticky top-24 p-6 bg-slate-50 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">أخبار ذات صلة</h3>
                <div className="space-y-4">
                  {/* Add related news items here */}
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&auto=format&fit=crop&q=60" alt="related news" className="w-20 h-20 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold hover:text-blue-600 transition-colors">منحة جديدة في كندا</h4>
                      <p className="text-sm text-slate-600">3 نوفمبر 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=100&auto=format&fit=crop&q=60" alt="related news" className="w-20 h-20 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold hover:text-blue-600 transition-colors">تدريب صيفي في جوجل</h4>
                      <p className="text-sm text-slate-600">2 نوفمبر 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EyeIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ShareIcon: FC<{ platform: string }> = ({ platform }) => {
  const icons: { [key: string]: React.ReactNode } = {
    facebook: (
      <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.62v-7h-2.34V11h2.34V9.21c0-2.32 1.38-3.61 3.51-3.61.62 0 1.38.11 1.38.11v2.43h-1.24c-1.16 0-1.5.69-1.5 1.4v1.76h2.77l-.45 3H16v7h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2 5.89a8.34 8.34 0 0 1-2.36.65 4.17 4.17 0 0 0 1.8-2.27 8.36 8.36 0 0 1-2.6.99 4.16 4.16 0 0 0-7.08 3.8 11.8 11.8 0 0 1-8.57-4.34 4.16 4.16 0 0 0 1.28 5.55A4.13 4.13 0 0 1 1.1 9.4v.05a4.16 4.16 0 0 0 3.33 4.08 4.14 4.14 0 0 1-1.87.07 4.16 4.16 0 0 0 3.88 2.89A8.35 8.35 0 0 1 .75 18.1a11.78 11.78 0 0 0 6.38 1.87c7.66 0 11.85-6.35 11.85-11.85 0-.18 0-.36-.01-.54a8.45 8.45 0 0 0 2.08-2.16Z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1ZM8.34 18.34H5.66V9.7h2.68v8.64ZM7 8.56a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12Zm11.34 9.78h-2.67v-4.1c0-.98-.02-2.24-1.36-2.24s-1.57 1.07-1.57 2.17v4.17H9.99V9.7h2.56v1.17h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.2 1.77 3.2 4.08v4.78Z" />
      </svg>
    ),
  };

  return icons[platform] || null;
};

export default NewsDetails;
