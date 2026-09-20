import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { Card, IconButton, MicroHeading } from '../../components/ui';
import { EventCard } from '../../features/events/EventPrimitives';
import { globalEventsData } from '../../data/events';
import { useCloseTo } from '../../lib/navigation';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/* /events/calendar — ported from EventsCalendarScreen in the mobile app. */
export default function EventsCalendarPage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const goBack = useCloseTo('/events');

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));
  const [selectedDateStr, setSelectedDateStr] = useState('2026-07-12');

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: daysInPrevMonth - firstDay + i + 1, isCurrentMonth: false, dateStr: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - firstDay + i + 1).padStart(2, '0')}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false, dateStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }
    return days;
  };

  const calendarDays = generateCalendar();
  const selectedDateEvents = globalEventsData.filter(e => e.date === selectedDateStr);

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <PageContainer className="animate-fade-in">
      <div className="flex items-center gap-3">
        <IconButton icon={ArrowLeft} label="Back" onClick={goBack} />
        <PageHeader className="flex-1" title="Calendar" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Calendar card */}
        <Card className="lg:col-span-2 w-full max-w-[420px] rounded-3xl self-start">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-extrabold ${t.text}`}>{currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next month"
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(d => (
              <div key={d} className={`text-center text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => {
              const dayEvents = globalEventsData.filter(e => e.date === d.dateStr);
              const isSelected = selectedDateStr === d.dateStr;
              const isToday = d.dateStr === '2026-07-12';

              return (
                <div
                  key={i}
                  onClick={() => d.isCurrentMonth && setSelectedDateStr(d.dateStr)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl relative cursor-pointer transition-all active:scale-95 ${
                    !d.isCurrentMonth ? 'opacity-30 pointer-events-none' :
                    isSelected ? 'bg-[#1D9BF0] text-white shadow-md' :
                    isToday ? `border-2 border-[#1D9BF0] ${t.text}` :
                    `${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} ${t.text}`
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : ''}`}>{d.day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex space-x-0.5 absolute bottom-1.5">
                      {dayEvents.slice(0, 3).map((_, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#1D9BF0]'}`}></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Selected day events */}
        <div className="lg:col-span-3 min-w-0">
          <MicroHeading>
            Events on {new Date(selectedDateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </MicroHeading>
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(ev => (
                <EventCard key={ev.id} event={ev} variant="compact" onClick={(e) => navigate(`/events/${e.id}`)} />
              ))
            ) : (
              <div className={`p-8 rounded-2xl border border-dashed ${isDark ? 'border-white/15' : 'border-black/10'} text-center`}>
                <p className={`text-xs font-bold ${t.textMuted}`}>No events scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
