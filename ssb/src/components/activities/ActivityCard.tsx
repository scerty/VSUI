import { type FC } from 'react';

interface ActivityCardProps {
  date: string;
  year: string;
  title: string;
  description: string;
  type: string;
  time: string;
}

const ActivityCard: FC<ActivityCardProps> = ({ date, year, title, description, type, time }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-yellow-500">
    <div className="p-5">
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
        <span className="flex items-center gap-1.5">
          <CalendarIcon />
          {date} {year}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon />
          {time}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 h-14 group-hover:text-yellow-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 line-clamp-2 h-12">
        {description}
      </p>
      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
        <span className={`px-3 py-1 rounded-full text-sm bg-yellow-400/10 text-yellow-400`}>
          {type}
        </span>
      </div>
    </div>
  </div>
);

const CalendarIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default ActivityCard;
