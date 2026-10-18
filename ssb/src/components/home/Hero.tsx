import { type FC } from 'react';
import SearchBar from '../shared/SearchBar';

interface HeroProps {
  onShowQuestionsPage: () => void;
  onShowAllActivities: () => void;
}

const Hero: FC<HeroProps> = ({ onShowQuestionsPage, onShowAllActivities }) => {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-76px)] items-center overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 md:px-8">
        <div className="flex flex-col items-center gap-7 py-16 text-center text-white md:py-24">
          {/* العنوان الرئيسي */}
          <div className="max-w-5xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-sm font-medium text-amber-100 shadow-lg shadow-cyan-950/10 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_0_4px_rgba(252,211,77,0.16)]" />
              مساحة واحدة للفرص، الأسئلة، واللقاءات
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight md:text-7xl">
              <span className="mb-3 block text-3xl text-white/80 md:text-5xl">منظمة</span>
            <span className="block bg-gradient-to-l from-white via-white to-cyan-100 bg-clip-text text-transparent">
  الطالب السوري في{' '}
  <span className="relative inline-block">
    <span className="relative z-10 text-white drop-shadow-md">النرويج</span>
    <span className="absolute inset-x-0 bottom-1 z-0 h-2 -rotate-1 transform rounded bg-amber-300/90"></span>
  </span>
</span>

            </h1>

            {/* الوصف */}
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
              نربط الطلاب بالفرص التعليمية والمهنية، ونساعدهم في بناء مستقبلهم المهني في النرويج
            </p>
          </div>

       
{/* الأزرار */}
<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
  <a
    href="#questions"
    onClick={(event) => { event.preventDefault(); onShowQuestionsPage(); }}
    className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-300 px-7 py-3.5 text-base font-bold text-[#071d31] shadow-xl shadow-amber-950/20 transition-all hover:-translate-y-1 hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-200/40"
  >
    طلب مساعدة
    <ArrowIcon />
  </a>

  <a
    href="#activities"
    onClick={(event) => { event.preventDefault(); onShowAllActivities(); }}
    className="
      inline-flex items-center justify-center gap-3
      rounded-xl
      border border-white/25
      bg-white/10
      px-7 py-3.5
      text-base font-semibold text-white
      backdrop-blur-sm
      shadow-lg shadow-cyan-950/10
      transition-all
      hover:-translate-y-1 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20
    "
  >
    الأنشطة القادمة
    <ArrowIcon />
  </a>
</div>


          {/* ميزات رئيسية */}
          <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <Feature icon={<AcademicCapIcon />} title="منح دراسية" />
            <Feature icon={<BriefcaseIcon />} title="فرص وظيفية" />
            <Feature icon={<SparklesIcon />} title="تدريب عملي" />
            <Feature icon={<UserGroupIcon />} title="توجيه مهني" />
          </div>
             {/* شريط البحث */}
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>

        </div>
      </div>
    </section>
  );
};

// ميزة فردية
const Feature: FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="group flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-lg shadow-cyan-950/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/10">
    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 p-2 text-amber-200 transition-transform duration-300 group-hover:scale-110">{icon}</div>
    <span className="text-sm font-medium text-white/90">{title}</span>
  </div>
);

const ArrowIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

// Icons
const AcademicCapIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" />
  </svg>
);
const BriefcaseIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25V14.15M16.5 18.75h.008v.008h-.008v-.008zM12 18.75h.008v.008h-.008v-.008zM7.5 18.75h.008v.008h-.008v-.008zM12 12.75a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5a.75.75 0 000-1.5H3.75a.75.75 0 000 1.5z" />
  </svg>
);
const SparklesIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.188-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.188a2.25 2.25 0 001.423 1.423l1.188.398-1.188.398a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);
const UserGroupIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 01-12 0m12 0v.006M6 18.72v.006m6-10.168a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 21a9.094 9.094 0 0112 0" />
  </svg>
);

const BackgroundEffects: FC = () => (
  <div className="absolute inset-0">
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(252,211,77,0.18),transparent_28%),linear-gradient(135deg,#1557c7_0%,#0e88b0_52%,#087d78_100%)]"></div>
    
    {/* Oriental Pattern Overlay */}
    <div 
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-48 0c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23fff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
      }}
    ></div>
  </div>
);



export default Hero;