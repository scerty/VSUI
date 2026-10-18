import { type FC } from 'react';

interface TimelineEvent {
  date: string;
  year: string;
  title: string;
  description: string;
  type: string;
  time: string;
}

interface ActivitiesProps {
  onShowAll: () => void;
}

const Activities: FC<ActivitiesProps> = ({ onShowAll }) => {
  const events: TimelineEvent[] = [
    {
      date: "نوفمبر 15",
      year: "2025",
      title: "لقاء الطلاب المستجدين",
      description: "جلسة تعريفية للطلاب الجدد مع فرصة للتواصل وتبادل الخبرات",
      type: "عن بعد",
      time: "6:00 مساءً"
    },
    {
      date: "نوفمبر 20",
      year: "2025",
      title: "ورشة عمل: كتابة السيرة الذاتية",
      description: "تعلم أساسيات كتابة السيرة الذاتية الاحترافية مع خبراء التوظيف",
      type: "حضوري",
      time: "2:00 ظهراً"
    },
    {
      date: "نوفمبر 25",
      year: "2025",
      title: "ملتقى الخريجين السنوي",
      description: "فرصة للتواصل مع خريجين ناجحين ومشاركة قصص النجاح",
      type: "هجين",
      time: "4:00 عصراً"
    }
  ];

  return (
    <section id="activities" className="relative overflow-hidden bg-[#081d2e] py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.16),transparent_28%),linear-gradient(180deg,#0a263b_0%,#071b2b_100%)]"></div>
      
      <div className="relative mx-auto w-full max-w-[1280px] px-4 md:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-300">على الأجندة</span>
          <h2 className="mb-4 mt-3 text-3xl font-extrabold text-white md:text-4xl">
            الأنشطة القادمة
          </h2>
          <p className="text-lg text-slate-300">تابع أحدث فعالياتنا وكن جزءاً من مجتمعنا النشط</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-[50%] h-full w-px bg-gradient-to-b from-amber-300/80 via-teal-300/50 to-transparent md:right-[8.5rem]"></div>

          {/* Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <TimelineEvent key={index} {...event} />
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-12 text-center">
            <button type="button" onClick={onShowAll} className="group inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white/15">
              عرض جميع الأنشطة
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineEvent: FC<TimelineEvent> = ({ date, year, title, description, type, time }) => (
  <div className="relative group">
    <div className="flex items-center gap-8 md:gap-12">
      {/* Date - Left */}
      <div className="hidden md:block w-32 text-left">
        <span className="block text-yellow-400 text-lg font-bold">{date}</span>
        <span className="text-white/60 text-sm">{year}</span>
      </div>
      
      {/* Timeline dot */}
      <div className="absolute right-[50%] h-4 w-4 -translate-y-1/2 translate-x-[0.4rem] rounded-full bg-amber-300 ring-4 ring-[#081d2e] transition-all group-hover:ring-teal-900 md:right-[8.5rem]"></div>

      {/* Content - Right */}
      <div className="mr-8 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-slate-950/10 backdrop-blur-sm transition-all group-hover:border-amber-300/30 group-hover:bg-white/[0.09] md:mr-16">
        <div className="mb-3 text-amber-200 md:hidden">
          <span className="text-lg font-bold">{date}</span>
          <span className="text-sm text-white/60"> - {year}</span>
        </div>
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-amber-200">{title}</h3>
        <p className="mt-2 text-slate-300">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-300/10 px-3 py-1 text-sm text-amber-200">{type}</span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">{time}</span>
        </div>
      </div>
    </div>
  </div>
);

export default Activities;