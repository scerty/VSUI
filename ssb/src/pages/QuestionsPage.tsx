import { useEffect, useMemo, useState } from 'react';

type Answer = {
  id: number;
  author: string;
  date: string;
  text: string;
  votes: number;
};

type Question = {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  votes: number;
  answers: Answer[];
};

type VoteState = 'up' | 'down' | null;

const VOTES_STORE_KEY = 'answerVotes';
const VOTE_STATE_STORE_KEY = 'answerVoteState';

const QuestionsPage = ({ onBack }: { onBack: () => void }) => {
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

  // NEW: حالة الفلترة والفرز
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');

  const initialQuestions: Question[] = useMemo(() => [
    {
      id: 1,
      title: 'ما هي متطلبات التقديم لمنحة جامعة أوسلو؟',
      category: 'منح دراسية',
      author: 'أحمد محمود',
      date: 'منذ 2 ساعة',
      votes: 12,
      answers: [
        { id: 101, author: 'عمر',   date: 'منذ 1 ساعة',  text: 'يجب أن تكون طالبًا في جامعة معترف بها وأن يكون لديك معدل تراكمي لا يقل عن 3.5.', votes: 4 },
        { id: 102, author: 'فاطمة', date: 'منذ 30 دقيقة', text: 'تحتاج أيضًا إلى تقديم خطاب توصية من أستاذ جامعي.', votes: 2 },
        { id: 103, author: 'ليلى',  date: 'منذ 20 دقيقة', text: 'لا تنسَ خطاب الدافع (Motivation Letter) وبيان الغرض من الدراسة.', votes: 1 },
        { id: 104, author: 'سامي',  date: 'منذ 10 دقائق', text: 'بعض البرامج تطلب IELTS/TOEFL—تأكد من صفحة البرنامج.', votes: 3 },
      ],
    },
    {
      id: 2,
      title: 'كيف يمكنني الحصول على فرصة تدريب في شركة مايكروسوفت؟',
      category: 'فرص تدريب',
      author: 'سارة عبدالله',
      date: 'منذ 5 ساعة',
      votes: 8,
      answers: [
        { id: 201, author: 'خالد', date: 'منذ 3 ساعات', text: 'قدّم عبر موقع مايكروسوفت الرسمي للوظائف.', votes: 5 },
        { id: 202, author: 'نورا',  date: 'منذ ساعتين', text: 'اعرض مشاريعك على GitHub وأبرز المساهمات المفتوحة.', votes: 2 },
        { id: 203, author: 'حسن',  date: 'منذ 50 دقيقة', text: 'ابنِ شبكة على LinkedIn واطلب Referral إن أمكن.', votes: 1 },
        { id: 204, author: 'ريم',   date: 'منذ 25 دقيقة', text: 'تابع فترات التقديم الموسمية للطلاب (Summer Internships).', votes: 0 },
      ],
    },
    {
      id: 3,
      title: 'هل هناك أي مسابقات برمجة قادمة للطلاب؟',
      category: 'مسابقات',
      author: 'محمد علي',
      date: 'منذ يوم واحد',
      votes: 23,
      answers: [
        { id: 301, author: 'يوسف', date: 'منذ 20 ساعة', text: 'هاكاثون جامعي الأسبوع القادم—سجّل الآن.', votes: 3 },
        { id: 302, author: 'سلوى', date: 'منذ 18 ساعة', text: 'تابع Codeforces/LeetCode للمسابقات الدورية.', votes: 2 },
        { id: 303, author: 'طارق', date: 'منذ 12 ساعة', text: 'نادي البرمجة سيقيم مسابقة خوارزميات قريبًا.', votes: 1 },
        { id: 304, author: 'هدى',  date: 'منذ 3 ساعات',  text: 'للمهتمين بالـAI: جرّب تحديات Kaggle.', votes: 0 },
      ],
    },
  ], []);

  const [answerVotes, setAnswerVotes] = useState<Record<number, number>>({});
  const [answerVoteState, setAnswerVoteState] = useState<Record<number, VoteState>>({});

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem(VOTES_STORE_KEY) || '{}');
    const storedStates = JSON.parse(localStorage.getItem(VOTE_STATE_STORE_KEY) || '{}');

    const initial: Record<number, number> = { ...storedVotes };
    initialQuestions.forEach(q => {
      q.answers.forEach(a => {
        if (initial[a.id] === undefined) initial[a.id] = a.votes;
      });
    });

    setAnswerVotes(initial);
    setAnswerVoteState(storedStates);
  }, [initialQuestions]);

  useEffect(() => {
    localStorage.setItem(VOTES_STORE_KEY, JSON.stringify(answerVotes));
  }, [answerVotes]);

  useEffect(() => {
    localStorage.setItem(VOTE_STATE_STORE_KEY, JSON.stringify(answerVoteState));
  }, [answerVoteState]);

  const vote = (answerId: number, dir: 'up' | 'down') => {
    setAnswerVotes(prev => {
      const currentScore = prev[answerId] ?? 0;
      const currentState = answerVoteState[answerId] ?? null;

      let delta = 0;
      let nextState: VoteState = currentState;

      if (dir === 'up') {
        if (currentState === 'up') { delta = -1; nextState = null; }
        else if (currentState === 'down') { delta = +2; nextState = 'up'; }
        else { delta = +1; nextState = 'up'; }
      } else {
        if (currentState === 'down') { delta = +1; nextState = null; }
        else if (currentState === 'up') { delta = -2; nextState = 'down'; }
        else { delta = -1; nextState = 'down'; }
      }

      setAnswerVoteState(s => ({ ...s, [answerId]: nextState }));
      return { ...prev, [answerId]: currentScore + delta };
    });
  };

  const categories = ['الكل', 'منح دراسية', 'فرص تدريب', 'مسابقات', 'دورات', 'وظائف'];

  const toggleQuestion = (id: number) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  const getPreparedAnswers = (answers: Answer[]) => {
    const withScores = answers.map(a => ({
      ...a,
      votes: answerVotes[a.id] ?? a.votes,
      state: (answerVoteState[a.id] ?? null) as VoteState,
    }));
    const sorted = [...withScores].sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return a.id - b.id;
    });
    const bestId = sorted.length ? sorted[0].id : null;
    return { sorted, bestId };
  };

  // NEW: فلترة وفرز قائمة الأسئلة للعرض
  const filteredQuestions = useMemo(() => {
    let list = initialQuestions.filter(q => activeCategory === 'الكل' ? true : q.category === activeCategory);
    if (sortBy === 'top') {
      list = [...list].sort((a, b) => b.votes - a.votes);
    } else {
      // "recent" — نحافظ على ترتيب الإدخال (كمثال)
      list = [...list].sort((a, b) => a.id - b.id);
    }
    return list;
  }, [initialQuestions, activeCategory, sortBy]);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ✅ هيدر بتدرّج مع زجاج خفيف */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white py-12 px-4 md:px-8 lg:px-20 shadow-md">
        <div className="mx-auto max-w-6xl rounded-2xl backdrop-blur-md p-5 md:p-8">
          <button
            onClick={onBack}
            className="text-white/90 hover:text-white mb-4 inline-flex items-center gap-2"
            aria-label="العودة"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-white/80"></span>
            العودة
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              بنك الأسئلة واستفسارات الطلاب
            </h1>

            {/* شريط البحث */}
            <div className="relative w-full md:w-[420px]">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="ابحث عن سؤال..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white transition"
              />
            </div>
          </div>

          {/* خط فاصل */}
          <div className="mt-5 h-px w-full bg-white/20 rounded-full" />

          {/* التصنيفات (حبوب زجاجية) - تبقى كما هي في الهيدر */}
          <div className="mt-5 flex flex-wrap gap-2.5 md:gap-3">
            {categories.map((category) => {
              const isActive = category === 'الكل';
              return (
                <button
                  key={category}
                  className={
                    'px-4 py-2 rounded-full border shadow-md transition backdrop-blur-sm text-sm md:text-base ' +
                    (isActive
                      ? 'bg-yellow-500 text-black border-yellow-500 font-semibold'
                      : 'bg-white/20 hover:bg-white/10 text-white border-white/25')
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ المحتوى مع سايدبار متناسق */}
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* صندوق التصنيفات (مربوط بالفلترة) */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-800 font-semibold mb-3">التصنيفات</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const active = activeCategory === c;
                    return (
                      <button
                        key={c}
                        onClick={() => { setActiveCategory(c); setOpenQuestionId(null); }}
                        className={
                          'px-3 py-1.5 rounded-full text-sm border transition ' +
                          (active
                            ? 'bg-yellow-400 text-black border-yellow-400 font-semibold'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200')
                        }
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* صندوق الفرز */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-800 font-semibold mb-3">ترتيب العرض</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={
                      'px-3 py-2 rounded-lg text-sm border transition ' +
                      (sortBy === 'recent'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200')
                    }
                  >
                    الأحدث
                  </button>
                  <button
                    onClick={() => setSortBy('top')}
                    className={
                      'px-3 py-2 rounded-lg text-sm border transition ' +
                      (sortBy === 'top'
                        ? 'bg-teal-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200')
                    }
                  >
                    الأعلى تصويتًا
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-teal-600 text-white p-5 shadow-md">
                <h3 className="font-semibold mb-2">عندك سؤال؟</h3>
                <p className="text-white/90 text-sm mb-4">
                  اسأل المجتمع واحصل على إجابات موثوقة من الطلاب والخبراء.
                </p>
                <button className="w-full px-4 py-2.5 rounded-xl bg-yellow-400 text-slate-900 font-medium hover:-translate-y-0.5 transition">
                  أضف سؤالًا
                </button>
              </div>

              {/* الأكثر تفاعلًا */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-800 font-semibold mb-3">الأكثر تفاعلًا</h3>
                <ul className="space-y-3 text-sm">
                  {initialQuestions
                    .slice()
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, 3)
                    .map(q => (
                      <li key={q.id}>
                        <button
                          onClick={() => { setActiveCategory('الكل'); setOpenQuestionId(q.id); }}
                          className="text-gray-800 hover:text-blue-700 text-right"
                          title={q.title}
                        >
                          {q.title}
                        </button>
                        <div className="text-gray-500">{q.category} • {q.votes} تصويت</div>
                      </li>
                    ))}
                </ul>
              </div>

            </div>
          </aside>

          {/* Questions list */}
          <main className="lg:col-span-8">
            <div className="grid gap-4">
              {filteredQuestions.map((question) => {
                const isOpen = openQuestionId === question.id;
                const prepared = isOpen ? getPreparedAnswers(question.answers) : null;

                return (
                  <div key={question.id} className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
                    {/* Header */}
                    <div
                      onClick={() => toggleQuestion(question.id)}
                      className="cursor-pointer flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                            {question.category}
                          </span>
                          <div className="text-xs text-gray-500">
                            <span>طرح بواسطة </span>
                            <span className="font-semibold">{question.author}</span>
                            &nbsp;&middot;&nbsp;
                            <span>{question.date}</span>
                          </div>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{question.title}</h2>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {question.answers.length} إجابات
                      </div>
                    </div>

                    {/* Answers */}
                    {isOpen && prepared && (
                      <div className="mt-4 pt-4 border-t">
                        {prepared.sorted.map((answer) => {
                          const isBest = answer.id === prepared.bestId;
                          const isUp = answer.state === 'up';
                          const isDown = answer.state === 'down';

                          return (
                            <div
                              key={answer.id}
                              className={
                                'mb-3 p-3 rounded-lg border ' +
                                (isBest
                                  ? 'border-emerald-300 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 shadow-sm'
                                  : 'border-gray-200 bg-gray-50')
                              }
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="text-sm font-semibold text-gray-800">{answer.author}</div>
                                    <div className="text-xs text-gray-500">{answer.date}</div>
                                    {isBest && (
                                      <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200 text-emerald-700 border border-emerald-200">
                                        🥇 أفضل إجابة
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-800 leading-relaxed">{answer.text}</div>
                                </div>

                                {/* Voting controls */}
                                <div className="flex flex-col items-center w-12 shrink-0">
                                  <button
                                    aria-label="vote up"
                                    onClick={() => vote(answer.id, 'up')}
                                    className={
                                      'p-1 rounded hover:bg-emerald-100 ' +
                                      (isUp ? 'text-emerald-600' : 'text-gray-400')
                                    }
                                    title="تصويت إيجابي"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>

                                  <span className={'font-bold ' + (answer.votes >= 0 ? 'text-gray-800' : 'text-red-600')}>
                                    {answer.votes}
                                  </span>

                                  <button
                                    aria-label="vote down"
                                    onClick={() => vote(answer.id, 'down')}
                                    className={
                                      'p-1 rounded hover:bg-red-100 ' +
                                      (isDown ? 'text-red-600' : 'text-gray-400')
                                    }
                                    title="تصويت سلبي"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
