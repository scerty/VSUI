import { type FC } from 'react';

interface Partner {
  name: string;
  url: string;
  logoUrl: string;
}

const Partners: FC = () => {
  const partners: Partner[] = [
    {
      name: "University of Oslo",
      url: "https://www.uio.no/english/",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/University_of_Oslo_Logo.svg"
    },
    {
      name: "Norwegian University of Science and Technology",
      url: "https://www.ntnu.edu/",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/NTNU_logo.svg"
    },
    {
      name: "University of Bergen",
      url: "https://www.uib.no/en",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/8/89/University_of_Bergen_logo.svg"
    },
    {
      name: "UiT The Arctic University of Norway",
      url: "https://en.uit.no/",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/UiT_The_Arctic_University_of_Norway_logo.svg"
    }
  ];

  const stats = [
    { value: "15+", label: "برنامج تبادل" },
    { value: "500+", label: "طالب مستفيد" },
    { value: "25+", label: "منحة سنوية" }
  ];

  return (
    <section className="relative py-20 bg-white">






      
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">شركاؤنا في النجاح</h2>
          <p className="text-lg text-slate-600">نفخر بشراكتنا مع أفضل الجامعات النرويجية</p>
        </div>

        {/* Partners Logo Bar */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {partners.map((partner, index) => (
            <PartnerLogo key={index} {...partner} />
          ))}
        </div>

        {/* Simple Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="px-6 py-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnerLogo: FC<Partner> = ({ name, url, logoUrl }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex items-center justify-center w-40 h-40 rounded-2xl bg-slate-50 p-6 transition-all hover:shadow-lg"
  >
    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 rounded-2xl transition-colors"></div>
    <img
      src={logoUrl}
      alt={name}
      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
    />
  </a>
);

export default Partners;