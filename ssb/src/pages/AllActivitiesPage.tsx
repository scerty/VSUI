import React, { useEffect, useMemo, useState } from 'react';

type Activity = {
  id: number;
  title: string;
  category: string;
  date: string; // ISO or text
  time?: string;
  location?: string;
  description?: string;
  seats?: number;
  rsvpCount?: number;
  address?: string; // optional detailed address
};

const RSVP_STORE = 'activitiesRsvp';

const ActivitiesPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // sample data (with address field for map)
  const initialActivities: Activity[] = useMemo(
    () => [
      {
        id: 1,
        title: 'هاكاثون طلابي: تطوير حلول للقطاع الصحي',
        category: 'هاكاثون',
        date: '2025-11-20',
        time: '09:00',
        location: 'OsloMet - Building A',
        address: 'Pilestredet 46, 0167 Oslo, Norway',
        description:
          'هاكاثون مدته 48 ساعة يهدف لبناء حلول عملية بالتعاون مع مستشفيات محلية.',
        seats: 120,
        rsvpCount: 42,
      },
      {
        id: 2,
        title: 'ورشة: كتابة سيرة ذاتية قوية للمنح',
        category: 'ورشة',
        date: '2025-11-25',
        time: '17:00',
        location: 'Zoom (رابط بعد التسجيل)',
        address: 'Online',
        description: 'ورشة عملية حول كيفية كتابة سيرة ذاتية وطلب منحة مقنع.',
        seats: 200,
        rsvpCount: 88,
      },
      {
        id: 3,
        title: 'نقاش مفتوح: سوق العمل في النرويج للمهندسين',
        category: 'ندوة',
        date: '2025-12-02',
        time: '18:30',
        location: 'University Hall',
        address: 'Pilestredet 46, 0167 Oslo, Norway',
        description:
          'جلسة نقاش مع شركات تقنية لتوضيح فرص العمل ومتطلبات التوظيف.',
        seats: 150,
        rsvpCount: 63,
      },
      {
        id: 4,
        title: 'سباق خيري لمجتمع الطلاب (5 كم)',
        category: 'نشاط اجتماعي',
        date: '2025-12-15',
        time: '10:00',
        location: 'Vigeland Park',
        address: 'Frognerseteren, Oslo, Norway',
        description: 'سباق خيري لجمع التبرعات ودعم مشاريع الطلاب.',
        seats: 500,
        rsvpCount: 310,
      },
    ],
    []
  );

  // state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'الكل' | string>('الكل');
  const [sortBy, setSortBy] = useState<'upcoming' | 'popular'>('upcoming');
  const [rsvpMap, setRsvpMap] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline'); // default timeline

  // modal state: selected activity to view details
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // load RSVP from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RSVP_STORE);
      if (raw) setRsvpMap(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RSVP_STORE, JSON.stringify(rsvpMap));
  }, [rsvpMap]);

  // close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedActivity(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // categories derived
  const categories = useMemo(() => {
    const set = new Set(initialActivities.map((a) => a.category));
    return ['الكل', ...Array.from(set)];
  }, [initialActivities]);

  // filtered & sorted activities
  const displayed = useMemo(() => {
    let list = initialActivities.filter((a) => {
      const matchesCategory = activeCategory === 'الكل' ? true : a.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        (a.address && a.address.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'popular') {
      list = list.sort((x, y) => (y.rsvpCount ?? 0) - (x.rsvpCount ?? 0));
    } else {
      // upcoming: by date asc (safe parse)
      list = list.sort((x, y) => {
        const dx = new Date(x.date).getTime();
        const dy = new Date(y.date).getTime();
        return dx - dy;
      });
    }
    return list;
  }, [initialActivities, activeCategory, search, sortBy]);

  const toggleRsvp = (id: number) => {
    setRsvpMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // build map embed src from address/location text
  const buildMapSrc = (loc?: string) => {
    if (!loc) return '';
    const q = encodeURIComponent(loc);
    // Use google maps public embed with query
    return `https://www.google.com/maps?q=${q}&output=embed`;
  };

  return (
    <div className="bg-gray-50 min-h-screen text-slate-800 antialiased">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white py-12 px-4 md:px-8 lg:px-20 shadow-md">
        <div className="mx-auto max-w-6xl rounded-3xl backdrop-blur-md bg-white/6 p-6 md:p-8 ring-1 ring-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div>
              <button
                onClick={() => onBack?.()}
                className="text-white/90 hover:text-white mb-2 inline-flex items-center gap-2 text-sm"
                aria-label="العودة"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-white/90"></span>
                العودة
              </button>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm leading-tight">
                الأنشطة القادمة
              </h1>
              <p className="text-white/90 mt-1 max-w-xl">جدول الأحداث وورش العمل والفعاليات المخصصة للطلاب — منظّم، سهل، واحترافي.</p>
            </div>

            <div className="w-full md:w-[420px]">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-slate-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن نشاط..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 text-slate-900 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 h-px w-full bg-white/12 rounded-full" />

          {/* categories pills + view toggles */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = c === activeCategory;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c as any)}
                    className={
                      'px-4 py-2 rounded-full text-sm font-medium transition ' +
                      (active ? 'bg-amber-400 text-slate-900 shadow-[0_6px_20px_rgba(250,204,21,0.18)]' : 'bg-white/10 text-white border border-white/6 hover:bg-white/16')
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={'px-3 py-2 rounded-lg text-sm font-medium transition ' + (viewMode === 'list' ? 'bg-white text-slate-900 shadow' : 'bg-white/10 text-white/90')}
                aria-pressed={viewMode === 'list'}
              >
                عرض قائمة
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={'px-3 py-2 rounded-lg text-sm font-medium transition ' + (viewMode === 'timeline' ? 'bg-white text-slate-900 shadow' : 'bg-white/10 text-white/90')}
                aria-pressed={viewMode === 'timeline'}
              >
                عرض خط زمني
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="rounded-3xl bg-white shadow-sm p-5 border border-gray-100">
                <h3 className="text-slate-800 font-semibold mb-3">الفرز</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('upcoming')}
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition ' + (sortBy === 'upcoming' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-100')}
                  >
                    القريب
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition ' + (sortBy === 'popular' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-100')}
                  >
                    الأكثر شهرة
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-white shadow-sm p-5 border border-gray-100">
                <h3 className="text-slate-800 font-semibold mb-3">توصيات لك</h3>
                <ul className="space-y-3 text-sm">
                  {initialActivities.slice(0, 3).map((a) => (
                    <li key={a.id} className="flex justify-between items-start gap-3">
                      <div>
                        <div className="text-slate-800 font-medium">{a.title}</div>
                        <div className="text-xs text-slate-500">{a.location}</div>
                      </div>
                      <div className="text-xs text-slate-500">{formatDate(a.date)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white p-5 shadow-md">
                <h3 className="font-semibold mb-2">شارك فعالية</h3>
                <p className="text-white/90 text-sm mb-4">هل عندك حدث؟ أضف الفعالية لصفحة الرابطة ليشاهدها الجميع.</p>
                <button className="w-full px-4 py-2.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:shadow-md transition">أضف فعالية</button>
              </div>
            </div>
          </aside>

          {/* main content: either list or timeline */}
          <main className="lg:col-span-8">
            {viewMode === 'list' ? (
              <div className="space-y-6">
                {displayed.map((activity) => {
                  const isRsvpd = !!rsvpMap[activity.id];
                  return (
                    <article
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_-10px_rgba(2,6,23,0.12)] border border-gray-100 transition-transform hover:-translate-y-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setSelectedActivity(activity);
                      }}
                      aria-label={`عرض تفاصيل ${activity.title}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 text-xs font-semibold text-sky-700">{activity.category}</span>
                            <h2 className="text-lg font-semibold text-slate-800">{activity.title}</h2>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              <span>{formatDate(activity.date)} {activity.time ? `• ${activity.time}` : ''}</span>
                            </div>
                            {activity.location && (
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s8-4.5 8-10.5A8 8 0 004 10.5C4 16.5 12 21 12 21z"></path></svg>
                                <span>{activity.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10v6a4 4 0 008 0v-6"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v4"></path></svg>
                              <span>{activity.seats ? `${activity.seats} مقعد` : 'مقاعد مفتوحة'}</span>
                            </div>
                          </div>

                          {activity.description && <p className="text-slate-700">{activity.description}</p>}
                        </div>

                        <div className="flex flex-col items-center gap-3 shrink-0 w-full md:w-36 mt-3 md:mt-0">
                          <div className="text-center">
                            <div className="text-sm text-slate-500">التسجيل</div>
                            <div className="text-lg font-bold text-slate-800">{(activity.rsvpCount ?? 0) + (rsvpMap[activity.id] ? 1 : 0)}</div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRsvp(activity.id);
                            }}
                            className={
                              'w-full px-3 py-2 rounded-full font-semibold transition ' +
                              (isRsvpd ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/10 text-slate-900 border border-white/10 hover:bg-white/20')
                            }
                          >
                            {isRsvpd ? 'ملتحق' : 'سجّل (RSVP)'}
                          </button>

                          <a href="#" onClick={(e) => e.stopPropagation()} className="text-xs text-slate-500 underline">تفاصيل</a>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {displayed.length === 0 && (
                  <div className="bg-white rounded-3xl p-8 text-center text-slate-600 shadow-sm">لا توجد فعاليات مطابقة للمعايير.</div>
                )}
              </div>
            ) : (
              /* Timeline view - refined */
              <div className="relative">
                <div className="hidden lg:block absolute top-6 bottom-6 left-12 w-px bg-gradient-to-b from-sky-300 to-cyan-300/60" />

                <div className="space-y-10">
                  {displayed.map((activity) => {
                    const isRsvpd = !!rsvpMap[activity.id];
                    return (
                      <div key={activity.id} className="relative lg:pl-24">
                        <div className="absolute -left-2 lg:left-8 top-6 flex items-center">
                          <div className="h-5 w-5 rounded-full flex items-center justify-center ring-4 ring-white/90 shadow" style={{ background: 'linear-gradient(135deg,#06B6D4,#60A5FA)' }} />
                        </div>

                        <article
                          className="bg-white rounded-3xl p-6 shadow-[0_12px_40px_rgba(2,6,23,0.08)] border border-gray-100 transition hover:-translate-y-2 cursor-pointer"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 text-xs font-semibold text-sky-700">{activity.category}</span>
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-800">{activity.title}</h3>
                                  <div className="text-sm text-slate-500 mt-1">
                                    <span>{formatDate(activity.date)}</span>
                                    {activity.time ? <span> • {activity.time}</span> : null}
                                    {activity.location ? <span> • {activity.location}</span> : null}
                                  </div>
                                </div>
                              </div>

                              {activity.description && <p className="mt-3 text-slate-700">{activity.description}</p>}
                            </div>

                            <div className="flex flex-col items-center gap-3 shrink-0 w-full md:w-36 mt-3 md:mt-0">
                              <div className="text-center">
                                <div className="text-sm text-slate-500">التسجيل</div>
                                <div className="text-lg font-bold text-slate-800">{(activity.rsvpCount ?? 0) + (isRsvpd ? 1 : 0)}</div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRsvp(activity.id);
                                }}
                                className={'w-full px-3 py-2 rounded-full font-semibold transition ' + (isRsvpd ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/10 text-slate-900 border border-white/10 hover:bg-white/20')}
                              >
                                {isRsvpd ? 'ملتحق' : 'سجّل (RSVP)'}
                              </button>

                              <a href="#" onClick={(e) => e.stopPropagation()} className="text-xs text-slate-500 underline">تفاصيل</a>
                            </div>
                          </div>

                          <div className="mt-3 lg:hidden text-sm text-slate-500">{formatDate(activity.date)}</div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for activity details */}
      {selectedActivity && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`تفاصيل ${selectedActivity.title}`}>
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedActivity(null)} />

          <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedActivity.title}</h2>
                <div className="text-sm text-slate-500">{selectedActivity.category} • {formatDate(selectedActivity.date)} {selectedActivity.time ? `• ${selectedActivity.time}` : ''}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRsvp(selectedActivity.id);
                  }}
                  className={'px-4 py-2 rounded-full font-semibold transition ' + (rsvpMap[selectedActivity.id] ? 'bg-emerald-600 text-white shadow' : 'bg-white/10 text-slate-900 border border-white/10 hover:bg-white/20')}
                >
                  {rsvpMap[selectedActivity.id] ? 'ملتحق' : 'سجّل (RSVP)'}
                </button>

                <button onClick={() => setSelectedActivity(null)} aria-label="إغلاق" className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-50 transition">✕</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: details */}
              <div className="p-6 space-y-4">
                {selectedActivity.description && <p className="text-slate-700">{selectedActivity.description}</p>}

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
                  <div><span className="font-semibold text-slate-800">الموقع:</span> {selectedActivity.location || '-'}</div>
                  <div><span className="font-semibold text-slate-800">العنوان:</span> {selectedActivity.address || 'غير متوفر'}</div>
                  <div><span className="font-semibold text-slate-800">المقاعد:</span> {selectedActivity.seats ?? 'غير محدد'}</div>
                  <div><span className="font-semibold text-slate-800">المسجلين الآن:</span> {(selectedActivity.rsvpCount ?? 0) + (rsvpMap[selectedActivity.id] ? 1 : 0)}</div>
                </div>

                {/* action links */}
                <div className="flex gap-3 mt-2">
                  <a
                    href={selectedActivity.address && selectedActivity.address !== 'Online' ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedActivity.address)}` : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-white border border-gray-100 text-slate-700 hover:shadow transition"
                  >
                    افتح في خرائط
                  </a>

                  <a href="#" className="px-4 py-2 rounded-lg bg-amber-400 text-slate-900 font-semibold hover:shadow transition">مشاركة</a>
                </div>
              </div>

              {/* Right: map */}
              <div className="p-0 lg:p-6">
                {selectedActivity.address && selectedActivity.address !== 'Online' ? (
                  <div className="h-64 lg:h-full">
                    <iframe
                      title="map"
                      src={buildMapSrc(selectedActivity.address)}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-64 lg:h-full flex items-center justify-center bg-slate-50 text-slate-500">
                    الموقع غير متاح للعرض (عبر الإنترنت أو لم يُحدّد عنوان).
                  </div>
                )} 
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button onClick={() => setSelectedActivity(null)} className="px-4 py-2 rounded-lg bg-white border border-gray-100 hover:shadow transition">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
