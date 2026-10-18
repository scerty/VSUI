import { type FC, useState, useEffect } from 'react';
import { newsAPI, categoriesAPI, type News as APINews } from '../../services/api';

interface NewsItem {
  id?: number;
  category: string;
  categoryColor: string;
  date: string;
  views: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  authorName: string;
  authorImage: string;
}

interface NewsProps {
  onNewsSelect: (news: NewsItem) => void;
  onShowAllNews: () => void;
}

// Fallback data for when API is not available
const fallbackNewsItems: NewsItem[] = [
    {
      category: "أخبار تعليمية",
      date: "يناير 2025",
      views: "2.5K",
      title: "قواعد جديدة للقبول في التعليم العالي في النرويج ابتداءً من 2028",
      description: "أعلنت وزارة التعليم النرويجية عن إصلاح شامل لنظام القبول في الجامعات والمعاهد العليا، في خطوة تهدف إلى تبسيط الإجراءات وجعلها أكثر عدالة ومرونة. الإصلاح الذي سيُطبَّق على مراحل حتى العام الدراسي 2028–2029.",
      content: `أعلنت وزارة التعليم النرويجية عن إصلاح شامل لنظام القبول في الجامعات والمعاهد العليا، في خطوة تهدف إلى تبسيط الإجراءات وجعلها أكثر عدالة ومرونة. الإصلاح الذي سيُطبَّق على مراحل حتى العام الدراسي 2028–2029، جاء بعد دراسة موسّعة ومشاركة أكثر من 300 جهة معنية.

## تقليص النقاط الإضافية (tilleggspoeng)

أحد أبرز التغييرات هو تقليص عدد النقاط الإضافية التي يمكن للطلاب الحصول عليها من 14 نقطة إلى 4 فقط. النقاط المتبقية ستُمنح بشكل رئيسي لقاء مواد العلوم أو الخدمة العسكرية. الوزارة أوضحت أن النظام القديم أدى إلى تضخم غير واقعي في الحدود الدنيا للقبول، حيث وصلت بعض البرامج إلى نحو 70 نقطة، في حين أن شهادة ثانوية كاملة العلامات لا تتجاوز 60 نقطة.

## فرص ثانية وتحسين العلامات

رغم خفض النقاط الإضافية، ستظل علامات الثانوية هي المعيار الأساسي للقبول، وسيُسمح للطلاب بأخذ وقت أطول لإنهاء دراستهم أو إعادة الامتحانات لتحسين نتائجهم. الوزيرة سيغرون آسلاند شددت على أن "الجميع يستحق فرصة ثانية"، مؤكدة أن الجامعات سيكون لها مجال أوسع في تنظيم امتحانات قبول محلية لاستكشاف قدرات الطلاب بشكل أعمق، خاصة في البرامج الأكثر تنافسية.

## حصتان للقبول ورفع سن المنافسة

سيبقى نظام الحصتين قائماً: الأولى مخصصة لمن يتقدمون بشهادتهم الثانوية لأول مرة (førstegangsvitnemål)، والثانية للطلاب الذين حسّنوا درجاتهم أو يملكون نقاطاً إضافية. ابتداءً من 2028 سيرتفع سن التنافس ضمن حصة الشهادة الأولى إلى 23 عاماً بدلاً من 21، كما ستُرفع نسبة المقاعد المخصصة لها من 50% إلى 65%، مما يمنح خريجي الثانوية فرصاً أكبر للدخول مباشرة إلى التعليم العالي.

## تطبيق تدريجي للتغييرات

### ابتداءً من 2027–2028:

• إتاحة أوسع للجامعات في إجراء امتحانات قبول محلية.
• حسم التعادل بين المتقدمين عبر القرعة بدلاً من عامل السن.
• إلغاء نقاط التفضيل على أساس الجنس واستبدالها بإمكانية منح حصص خاصة لضمان التوازن.
• إلغاء شرط الخبرة العملية في قاعدة "23/5" التي تسمح للبالغين فوق 23 عاماً بدخول الجامعة بست مواد أساسية.

### ابتداءً من 2028–2029:

• زيادة حصة الشهادة الأولى إلى 65% ورفع الحد العمري إلى 23 عاماً.
• إلغاء معظم النقاط الإضافية (العمر، التعليم العالي، المدارس المهنية، اللغات الإضافية، إلخ).
• الإبقاء على نقطتين كحد أقصى لمواد العلوم، ونقطة واحدة للخدمة العسكرية أو المدنية.
• إضافة نقطة خاصة للطلاب الناطقين باللغة السامية في الثانوية.
• إلغاء نظام "الترتيب المزدوج" وتخفيف القيود الجغرافية للبرامج اللامركزية.

## وضوح واستقرار

الوزارة شددت على أن التغييرات لن تؤثر على طلبات القبول لخريف 2026، إذ لن يبدأ تطبيق الإصلاح فعلياً قبل خريف 2027، بينما تدخل معظم البنود حيّز التنفيذ في 2028–2029. وبمجرد دخول النظام الجديد حيّز التطبيق، فإنه سيُطبَّق على جميع المتقدمين، سواء كانوا من خريجي السنوات السابقة أو الجدد.

## تأثير مباشر على طلاب الثانوية

• طلاب الصف الأول (Vg1) في العام الدراسي 2025–2026 سيكونون أول دفعة تُطبّق عليها القواعد الجديدة.
• طلاب الصف الثاني (Vg2) والصف الثالث (Vg3) سيتأثرون جزئياً، حيث ستُطبق عليهم القواعد القديمة إذا تقدموا قبل 2028، والجديدة إذا تأخروا.

## إصلاح يوازن بين السرعة والفرص

الوزارة ترى أن هذا الإصلاح يمنح الشباب دافعاً للالتحاق المبكر بالتعليم العالي، ويُجنبهم إضاعة الوقت في إعادة المواد لمراكمة النقاط. في الوقت ذاته، يضمن النظام الجديد مسارات متعددة للوصول إلى الجامعات ويعزز العدالة والشفافية في التنافس.

بهذا الإصلاح، تسعى النرويج إلى بناء نظام قبول حديث يواكب احتياجات الطلاب وسوق العمل، ويعزز من فرص التعليم العالي كوسيلة أساسية للنمو الشخصي والمجتمعي.

## 📌 تأثير القرارات على الطلاب الأجانب واللاجئين

من المتوقع أن تنعكس التغييرات الجديدة بشكل مباشر أيضاً على الطلاب الأجانب واللاجئين الراغبين في متابعة تعليمهم في النرويج. فخفض عدد النقاط الإضافية قد يحد من فرص تحسين وضعهم في المنافسة على بعض التخصصات المرغوبة، خصوصاً لأولئك الذين يحتاجون إلى سنوات إضافية لتعلم اللغة أو استكمال الشروط الأكاديمية. كما أن تحديد عمر أقصى للاستفادة من شهادة الثانوية الأولى قد يضعف حظوظ بعض اللاجئين الشباب الذين تأخروا في استكمال تعليمهم بسبب ظروف الهجرة.

مع ذلك، تشير الوزارة إلى أن القواعد تتيح مسارات بديلة للقبول، بما في ذلك تحسين الدرجات، الأمر الذي قد يمنح الطلاب القادمين من خلفيات مختلفة فرصة للاندماج في النظام التعليمي على الرغم من التحديات الجديدة.`,
      image: "https://images.pexels.com/photos/159844/nature-moss-forest-natural-beauty-159844.jpeg?w=800&h=600&fit=crop",
      categoryColor: "blue",
      authorName: "Jakob-ssa",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
    },
    {
      category: "أخبار تعليمية",
      date: "27 يوليو 2025",
      views: "1.8K",
      title: "زيادة قياسية في قبول طلاب التمريض وتعليم المعلمين في النرويج",
      description: "سجّلت دراسات التمريض في النرويج أعلى مستوى قبول هذا العام، حيث حصل 9634 طالبًا على مقاعد دراسية لفصل الخريف، وهو رقم غير مسبوق. كما شهدت دراسات تعليم المعلمين ارتفاعًا ملحوظًا في أعداد المقبولين.",
      content: `سجّلت دراسات التمريض في النرويج أعلى مستوى قبول هذا العام، حيث حصل 9634 طالبًا على مقاعد دراسية لفصل الخريف، وهو رقم غير مسبوق. كما شهدت دراسات تعليم المعلمين ارتفاعًا ملحوظًا في أعداد المقبولين.

## التمريض: حلم يتحقق

بالنسبة لبنجامين كلوبن (22 عامًا) من ستافانغر، كان القبول في دراسة التمريض بجامعة أوسلو ميت تجربة مميزة. يقول: "هذا يعني لي الكثير، اتصلت بوالدتي فورًا لأخبرها بالخبر!"، مضيفًا أن الدراسة جذبت اهتمامه بعد متابعة بودكاستات لممرضين ومشاهدة مسلسل Grey's Anatomy. كما أشار إلى أن الفرص الواسعة التي يوفرها المجال كانت دافعًا رئيسيًا.

من جانبه، اختار سيمون فريتزمان لاميري (30 عامًا) التمريض كخياره الأول، موضحًا: "إنه عمل مجتمعي مهم ومثير، مع فرص وظيفية مضمونة وتنوع في التخصصات."

## تصريحات رسمية

أعربت وزيرة التعليم العالي والبحث العلمي، سيغرون أسلاند، عن سعادتها بالزيادة الكبيرة في أعداد المتقدمين للتمريض، والتي ارتفعت بنسبة 40% مقارنة بالعام الماضي. وأكدت: "هذه أخبار رائعة، فنحن بحاجة ماسة إلى الممرضين في جميع أنحاء النرويج."

كما لاحظت أن الزيادة شملت المتقدمين الأكبر سنًا لبرامج الدراسة بدوام جزئي، إلى جانب الشباب.

## ارتفاع في تعليم المعلمين

شهدت دراسات تعليم المعلمين في المدارس الابتدائية زيادة كبيرة، حيث حصل 3982 طالبًا على مقاعد دراسية، بزيادة 1630 عن العام الماضي، وهو أعلى رقم منذ 2020. وصفت وزيرة التعليم كاريه نيسا نوردتون هذا الارتفاع بـ"نقطة تحول مهمة" للمدارس النرويجية.

## تحديات أخرى

على الرغم من الزيادة في التمريض وتعليم المعلمين، شهدت بعض التخصصات انخفاضًا، مثل:

• تعليم رياض الأطفال (انخفاض بنسبة 26%)
• تكنولوجيا المعلومات والاتصالات (انخفاض بنسبة 22%)

وأكدت نوردتون أن هناك جهودًا مستمرة لتعزيز الاهتمام بهذه المجالات.

## نظام قبول أكثر عدالة

أشار سيغفه نيس روتفولد، رئيس المنظمة الطلابية النرويجية، إلى أن نظام القبول الحالي يشجع على "السباق نحو النقاط"، وطالب بتطوير نظام بديل يركز على الدافع والخبرة إلى جانب الدرجات.`,
      image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=800&h=600&fit=crop",
      categoryColor: "blue",
      authorName: "فريق SSB",
      authorImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=60&h=60&fit=crop"
    },
    {
      category: "أخبار تقنية",
      date: "27 يوليو 2025",
      views: "2.1K",
      title: "نصف الطلاب يستخدمون الذكاء الاصطناعي أسبوعيًا وفقًا لاستطلاع جديد",
      description: "أظهر استطلاع حديث أن استخدام أدوات الذكاء الاصطناعي بين الطلاب قد زاد بشكل كبير خلال السنوات الأخيرة، حيث يستخدمه 20% من الطلاب يوميًا و32% أسبوعيًا.",
      content: `أظهر استطلاع حديث أن استخدام أدوات الذكاء الاصطناعي بين الطلاب قد زاد بشكل كبير خلال السنوات الأخيرة.

## الاستطلاع وأرقامه

وفقًا للاستطلاع الذي أجرته مؤسسة "سنتيو" بالنيابة عن "خرونو" ومنظمة الطلاب النرويجية (NSO)، يستخدم 20% من الطلاب الذكاء الاصطناعي يوميًا في دراستهم، بينما يستخدمه 32% أسبوعيًا. في المقابل، أشار 11% فقط إلى أنهم لا يستخدمون الذكاء الاصطناعي أبدًا في دراستهم.

## زيادة ملحوظة منذ 2023

تُظهر هذه النتائج تباينًا واضحًا مقارنة بعام 2023، حيث:

• أفاد 6% فقط من الطلاب باستخدامهم الذكاء الاصطناعي يوميًا (مقابل 20% اليوم)
• قال 35% إنهم لا يستخدمونه أبدًا في الدراسة (مقابل 11% اليوم)

هذا يعكس ارتفاعًا كبيرًا في اعتماد الطلاب على تقنيات الذكاء الاصطناعي خلال فترة قصيرة نسبيًا.

## آراء الخبراء

يقول البروفيسور في مجال الذكاء الاصطناعي، مورتن غودوين، من جامعة أغدر:

"من حيث المبدأ، من الإيجابي أن يتعلم الطلاب استخدام تقنية من المحتمل أن يستخدموها طوال حياتهم المهنية. لكن ذلك يتطلب استخدامًا صحيحًا. إذا استخدم الطلاب الذكاء الاصطناعي دون إبلاغ أساتذتهم، أو كتبوا أطروحات الماجستير دون تفكير مستقل، فهذا أمر سلبي."

## الخلاصة

يبرز هذا الاستطلاع أهمية وضع إطار عمل واضح لاستخدام الذكاء الاصطناعي في التعليم، حيث يتعين على المؤسسات التعليمية والطلاب الاتفاق على أفضل الممارسات والمعايير الأخلاقية للاستفادة القصوى من هذه التكنولوجيا.`,
      image: "https://images.pexels.com/photos/3823517/pexels-photo-3823517.jpeg?w=800&h=600&fit=crop",
      categoryColor: "green",
      authorName: "فريق SSB",
      authorImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=60&h=60&fit=crop"
    },
    {
      category: "منح دراسية",
      date: "2 نوفمبر 2025",
      views: "1.2K",
      title: "منحة ممولة بالكامل للدراسات العليا في جامعة كامبريدج",
      description: "فرصة مميزة للطلاب السوريين للحصول على منحة دراسية كاملة تشمل الرسوم الدراسية والسكن والمعيشة",
      image: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=800&h=600&fit=crop",
      categoryColor: "yellow",
      authorName: "فريق SSB",
      authorImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=60&h=60&fit=crop"
    },
    {
      category: "فرص تدريب",
      date: "1 نوفمبر 2025",
      views: "856",
      title: "برنامج التدريب الصيفي في شركة مايكروسوفت",
      description: "فتح باب التقديم للتدريب الصيفي في مايكروسوفت لطلاب علوم الحاسوب والهندسة",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=600&fit=crop",
      categoryColor: "green",
      authorName: "فريق SSB",
      authorImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=60&h=60&fit=crop"
    },
    {
      category: "مسابقات",
      date: "31 أكتوبر 2025",
      views: "642",
      title: "مسابقة البرمجة السنوية للطلاب السوريين",
      description: "انطلاق مسابقة البرمجة السنوية بجوائز قيمة وفرص توظيف مباشرة للفائزين",
      image: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=800&h=600&fit=crop",
      categoryColor: "purple",
      authorName: "فريق SSB",
      authorImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=60&h=60&fit=crop"
    }
];

const News: FC<NewsProps> = ({ onNewsSelect, onShowAllNews }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNewsItems);
  const [categories, setCategories] = useState<string[]>(["جميع الأخبار", "أخبار تعليمية", "أخبار تقنية", "منح دراسية", "فرص تدريب", "مسابقات", "نشاطات طلابية"]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [newsData, categoriesData] = await Promise.all([
          newsAPI.getLatest(),
          categoriesAPI.getAll(),
        ]);
        
        const apiNews = (newsData.results || newsData || []).map((item: APINews) => ({
          id: item.id,
          category: item.category_name || 'أخرى',
          categoryColor: item.category_color || 'blue',
          date: new Date(item.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }),
          views: item.views ? (item.views >= 1000 ? (item.views / 1000).toFixed(1) + 'K' : String(item.views)) : '0',
          title: item.title,
          description: item.description,
          content: item.content,
          image: item.image,
          authorName: item.author_name || 'فريق SSB',
          authorImage: item.author_image || 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=60&h=60&fit=crop',
        }));
        
        if (apiNews.length > 0) {
          setNewsItems(apiNews);
        }
        
        const apiCategories = (categoriesData.results || categoriesData || []).map((c: any) => c.name);
        if (apiCategories.length > 0) {
          setCategories(['جميع الأخبار', ...apiCategories]);
        }
      } catch (err) {
        console.log('Using fallback news data - API not available');
      }
    };
    
    fetchNews();
  }, []);

  return (
    <section id="news" className="relative bg-[#f7f9fc] py-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">من المجتمع</span>
          <h2 className="mb-4 mt-3 text-3xl font-extrabold tracking-tight text-[#071d31] md:text-4xl">آخر الأخبار والمستجدات</h2>
          <p className="text-lg text-slate-600">اطلع على أحدث الأخبار والفرص المتاحة للطلاب</p>
        </div>

        {/* Categories */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              type="button"
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                index === 0
                  ? 'bg-[#071d31] text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-[#0d304b]'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <div key={index} onClick={() => onNewsSelect(item)}>
              <NewsCard {...item} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-16 text-center">
          <button type="button" onClick={onShowAllNews} className="group inline-flex items-center gap-3 rounded-xl bg-[#071d31] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-1 hover:bg-[#0d304b]">
            عرض جميع الأخبار
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

const NewsCard: FC<NewsItem> = ({ category, date, views, title, description, image, categoryColor, authorName, authorImage }) => (
  <article className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/10">
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-sm font-bold ${categoryStyles[categoryColor] ?? categoryStyles.blue}`}>
        {category}
      </span>
    </div>
    <div className="p-5">
      <div className="mb-3 flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarIcon />
          {date}
        </span>
        <span className="flex items-center gap-1.5">
          <EyeIcon />
          {views} مشاهدة
        </span>
      </div>
      <h3 className="mb-2 h-14 text-lg font-bold text-[#0d304b] transition-colors group-hover:text-cyan-700">
        {title}
      </h3>
      <p className="text-slate-600 line-clamp-2 h-12">
        {description}
      </p>
      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
        <img src={authorImage} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-slate-800">{authorName}</p>
          <p className="text-sm text-slate-500">ناشر</p>
        </div>
      </div>
    </div>
  </article>
);

const categoryStyles: Record<string, string> = {
  blue: 'bg-sky-100 text-sky-800',
  green: 'bg-emerald-100 text-emerald-800',
  purple: 'bg-violet-100 text-violet-800',
  yellow: 'bg-amber-100 text-amber-900',
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

export default News;