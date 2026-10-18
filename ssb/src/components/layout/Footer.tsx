import { useState, type FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="relative bg-stone-900 pt-24 pb-12 overflow-hidden text-white">
      {/* subtle background shapes */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -left-40 -top-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-sky-700/10 to-teal-400/6 blur-3xl opacity-40" />
        <div className="absolute right-[-220px] bottom-[-180px] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-700/6 to-cyan-500/6 blur-3xl opacity-30" />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Organization Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-grid place-items-center w-12 h-12 rounded-xl bg-white/6 ring-1 ring-white/10 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M12 3 7 8l5 5 5-5-5-5Zm0 8-5 5 5 5 5-5-5-5Z" />
                </svg>
              </span>
              <div>
                <div className="text-lg font-bold leading-tight">منظمة الطالب السوري</div>
                <div className="text-sm text-white/70">دعم، توجيه، وفرص للطلاب السوريين في النرويج</div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              نعمل على بناء مجتمع طلابي قوي عبر توفير معلومات، فعاليات وفرص تعليمية ومهنية للمغتربين السوريين.
            </p>

            <div className="flex items-center gap-3">
              <SocialLink href="#" ariaLabel="facebook" platform="facebook" />
              <SocialLink href="#" ariaLabel="twitter" platform="twitter" />
              <SocialLink href="#" ariaLabel="instagram" platform="instagram" />
              <SocialLink href="#" ariaLabel="linkedin" platform="linkedin" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="#" text="عن المنظمة" />
              <FooterLink href="#" text="الأخبار والمستجدات" />
              <FooterLink href="#" text="المنح الدراسية" />
              <FooterLink href="#" text="فرص التدريب" />
              <FooterLink href="#" text="بنك الأسئلة" />
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">تواصل معنا</h3>
            <ul className="space-y-4 text-sm">
              <ContactInfo icon="location" text="أوسلو، النرويج" />
              <ContactInfo icon="email" text="info@syrstudent.org" />
              <ContactInfo icon="phone" text="+47 123 45 678" />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">النشرة البريدية</h3>
            <p className="text-slate-300 mb-4 text-sm">اشترك للحصول على آخر الفعاليات، المنح، وأخبار المجتمع.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent my-8"></div>

        {/* bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">© {new Date().getFullYear()} منظمة الطالب السوري — جميع الحقوق محفوظة</div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition">الشروط</a>
            <span className="opacity-40">•</span>
            <a href="#" className="hover:text-white transition">الخصوصية</a>
            <span className="opacity-40">•</span>
            <a href="#" className="hover:text-white transition">اتصل بنا</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---------- Helpers ---------- */

const SocialLink: FC<{ href: string; platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'; ariaLabel?: string }> = ({ href, platform, ariaLabel }) => {
  const icons: Record<string, string> = {
    facebook: 'M22.675 0h-21.35C.602 0 0 .6 0 1.333v21.333C0 23.4.602 24 1.325 24H12.82v-9.294H9.692V11.08h3.128V8.414c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.097 2.797.142v3.24l-1.922.001c-1.507 0-1.8.716-1.8 1.766v2.316h3.6l-.468 3.626h-3.132V24h6.141c.723 0 1.325-.6 1.325-1.334V1.333C24 .6 23.398 0 22.675 0z',
    twitter: 'M23 4.557a9.83 9.83 0 01-2.828.775A4.932 4.932 0 0022.337 3.1c-.964.573-2.03.988-3.168 1.214a4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.67 3.15 4.822 4.822 0 003.149 9.86a4.9 4.9 0 01-2.228-.616c-.054 2.28 1.581 4.415 3.95 4.89a4.935 4.935 0 01-2.224.085c.623 1.945 2.432 3.36 4.576 3.401A9.868 9.868 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.72 13.995-14.646A9.936 9.936 0 0023 4.557z',
    instagram: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.9-3.7a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z M5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065z M6 20.452H3.555V9H6v11.452z'
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel ?? platform}
      className="w-10 h-10 rounded-xl bg-white/6 hover:bg-white/12 ring-1 ring-white/6 flex items-center justify-center transition-transform transform hover:-translate-y-1"
      target="_blank"
      rel="noreferrer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d={icons[platform]} />
      </svg>
    </a>
  );
};

const FooterLink: FC<{ href: string; text: string }> = ({ href, text }) => (
  <li>
    <a href={href} className="text-slate-300 hover:text-white transition-colors">
      {text}
    </a>
  </li>
);

const ContactInfo: FC<{ icon: 'location' | 'email' | 'phone'; text: string }> = ({ icon, text }) => {
  const paths: Record<string, string> = {
    location: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
    email: 'M2 6.5V18a2 2 0 002 2h16a2 2 0 002-2V6.5L12 12 2 6.5z M22 5H2l10 6 10-6z',
    phone: 'M2 3.5A1.5 1.5 0 013.5 2h2A1.5 1.5 0 017 3.5v2A1.5 1.5 0 015.5 7H5v2c0 5 6 11 11 11h2v-.5A1.5 1.5 0 0120.5 18h-2A1.5 1.5 0 0117 16.5v-2A1.5 1.5 0 0118.5 13h2A1.5 1.5 0 0122 14.5V16'
  };

  return (
    <li className="flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d={paths[icon]} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-slate-300 text-sm">{text}</span>
    </li>
  );
};

const NewsletterForm: FC = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setState('error');
      setTimeout(() => setState('idle'), 2400);
      return;
    }
    setState('loading');
    // simulate network
    setTimeout(() => {
      setState('success');
      setEmail('');
      setTimeout(() => setState('idle'), 2500);
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="بريدك الإلكتروني"
          className="w-full bg-white/6 text-white placeholder-slate-300 rounded-xl px-4 py-3 ring-1 ring-white/8 focus:ring-2 focus:ring-amber-300 focus:outline-none transition"
          aria-label="بريدك الإلكتروني"
        />
        {state === 'loading' && <div className="absolute right-3 top-3 animate-spin h-4 w-4 border-2 border-white/50 border-t-transparent rounded-full" />}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium rounded-xl px-4 py-2 transition-shadow shadow-sm"
        >
          {state === 'loading' ? 'جاري الاشتراك...' : 'اشتراك'}
        </button>

        <button
          type="button"
          onClick={() => { setEmail(''); setState('idle'); }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition"
        >
          مسح
        </button>
      </div>

      {state === 'success' && <div className="text-xs text-emerald-400">تم الاشتراك بنجاح — شكرًا لك!</div>}
      {state === 'error' && <div className="text-xs text-rose-400">أدخل بريدًا إلكترونيًا صالحًا.</div>}
    </form>
  );
};

export default Footer;
