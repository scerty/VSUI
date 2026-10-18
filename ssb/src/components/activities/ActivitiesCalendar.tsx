import { type FC } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import './ActivitiesCalendar.css';

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface ActivitiesCalendarProps {
  events: Event[];
}

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>
        <span className="font-bold">{date.format('MMMM')}</span>
        <span> {date.format('YYYY')}</span>
      </span>
    );
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToBack}>السابق</button>
        <button type="button" onClick={goToCurrent}>اليوم</button>
        <button type="button" onClick={goToNext}>التالي</button>
      </span>
      <span className="rbc-toolbar-label">{label()}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbar.onView(Views.MONTH)}>شهر</button>
        <button type="button" onClick={() => toolbar.onView(Views.WEEK)}>أسبوع</button>
        <button type="button" onClick={() => toolbar.onView(Views.DAY)}>يوم</button>
        <button type="button" onClick={() => toolbar.onView(Views.AGENDA)}>أجندة</button>
      </span>
    </div>
  );
};

const CustomEvent = (event: any) => {
  return (
    <div>
      <strong>{event.title}</strong>
    </div>
  );
};

const ActivitiesCalendar: FC<ActivitiesCalendarProps> = ({ events }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      components={{
        toolbar: CustomToolbar,
        event: CustomEvent,
      }}
      messages={{
        next: "التالي",
        previous: "السابق",
        today: "اليوم",
        month: "شهر",
        week: "أسبوع",
        day: "يوم",
        agenda: "أجندة",
        date: "تاريخ",
        time: "وقت",
        event: "حدث",
      }}
    />
  </div>
);

export default ActivitiesCalendar;
