import { useState, useEffect } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDate,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import useTaskStore from '../store/useTaskStore';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use current device date
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', or 'month'
  const tasks = useTaskStore(state => state.tasks);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);

  useEffect(() => {
    // Only fetch tasks if we don't have any
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, []); // Empty dependency array to run only once

  const navigate = (direction) => {
    if (viewMode === 'day') {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    }
  };

  const nextPeriod = () => navigate('next');
  const prevPeriod = () => navigate('prev');

  // Get days of the week
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  // Get days for the current month view
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  // Parse date from DD-MM-YY format
  const parseTaskDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Handle DD-MM-YY format
      if (dateString.match(/^\d{2}-\d{2}-\d{2}$/)) {
        const [day, month, year] = dateString.split('-').map(num => parseInt(num, 10));
        // Assuming 2-digit year (YY) in the 2000s
        return new Date(2000 + year, month - 1, day);
      } 
      
      // Try parsing as ISO date if other format
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.error('Error parsing date:', dateString);
      return null;
    }
  };

  // Mock events to match the design
  const mockEvents = [
    {
      id: 1,
      title: "Session 1: Marketing Sprint",
      startTime: "09:00",
      day: 2, // Wednesday (0-indexed, 0 is Monday)
      color: "bg-blue-100",
      date: new Date('2022-02-16'),
      completed: false
    },
    {
      id: 2,
      title: "Sales Catchup",
      startTime: "10:00",
      day: 2, // Wednesday
      color: "bg-blue-100",
      date: new Date('2022-02-16'),
      completed: false
    },
    {
      id: 3,
      title: "Renew driver's license",
      startTime: "11:00",
      day: 2, // Wednesday
      color: "bg-red-100",
      date: new Date('2022-02-16'),
      completed: false
    },
    // Week view events
    {
      id: 4,
      title: "Session 1: Marketing Sprint",
      startTime: "09:00",
      day: 0, // Monday
      color: "bg-blue-100",
      date: new Date('2022-02-14'),
      completed: false
    },
    {
      id: 5,
      title: "Sales Catchup",
      startTime: "10:00",
      day: 0, // Monday
      color: "bg-blue-100",
      date: new Date('2022-02-14'),
      completed: false
    },
    {
      id: 6,
      title: "Session 2: Marketing Sprint",
      startTime: "09:00",
      day: 3, // Thursday
      color: "bg-blue-100",
      date: new Date('2022-02-17'),
      completed: false
    },
    {
      id: 7,
      title: "Sales Catchup",
      startTime: "10:00",
      day: 3, // Thursday
      color: "bg-blue-100",
      date: new Date('2022-02-17'),
      completed: false
    },
    {
      id: 8,
      title: "Coaching session",
      startTime: "11:00",
      day: 1, // Tuesday
      color: "bg-yellow-100",
      date: new Date('2022-02-15'),
      completed: false
    },
    {
      id: 9,
      title: "Brainstorm: Job posting for SEO specialist",
      startTime: "12:00",
      day: 3, // Thursday
      color: "bg-blue-100",
      date: new Date('2022-02-17'),
      completed: false
    },
    {
      id: 10,
      title: "Renew driver's license",
      startTime: "01:00",
      day: 1, // Tuesday
      color: "bg-red-100",
      date: new Date('2022-02-15'),
      completed: false
    },
    {
      id: 11,
      title: "Business lunch w/ Aaron",
      startTime: "12:00",
      day: 5, // Saturday
      color: "bg-yellow-100",
      date: new Date('2022-02-19'),
      completed: false
    }
  ];

  // Combine real tasks with mock events for the design
  const getTaskEvents = () => {
    return tasks
      .filter(task => task.dueDate) // Only include tasks with due dates
      .map(task => {
        const date = parseTaskDate(task.dueDate);
        if (!date) return null;
        
        // Determine color based on list
        let color = "bg-blue-100";
        if (task.list === "Personal") color = "bg-red-100";
        else if (task.list === "Work") color = "bg-blue-100";
        else if (task.list === "List 1") color = "bg-yellow-100";
        
        return {
          id: task.id,
          title: task.todo,
          startTime: "09:00", // Default time
          day: date.getDay() === 0 ? 6 : date.getDay() - 1, // Adjust for week starting Monday
          color,
          date,
          completed: task.completed
        };
      })
      .filter(Boolean); // Remove null events
  };

  // Get task events
  const taskEvents = getTaskEvents();

  // Hours to display
  const hours = [
    { time: "09:00", label: "09:00", period: "AM" },
    { time: "10:00", label: "10:00", period: "AM" },
    { time: "11:00", label: "11:00", period: "AM" },
    { time: "12:00", label: "12:00", period: "PM" },
    { time: "01:00", label: "01:00", period: "PM" },
    { time: "02:00", label: "02:00", period: "PM" }
  ];

  // Get events for a specific hour and day
  const getEventsForHourAndDay = (hourTime, dayIndex) => {
    return taskEvents.filter(event => event.startTime === hourTime && event.day === dayIndex);
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return taskEvents.filter(event => event.date && isSameDay(event.date, date));
  };

  // Format the week range for display
  const formatWeekRange = () => {
    return `${format(weekStart, 'd')}–${format(weekEnd, 'd')} ${format(currentDate, 'MMMM yyyy')}`;
  };

  // Day view render function to match the design
  const renderDayView = () => (
    <>
      {/* Day label */}
      <div className="text-center mb-4">
        <h2 className="text-sm text-gray-600 font-medium uppercase">{format(currentDate, 'EEEE')}</h2>
      </div>
      
      {/* Time slots */}
      <div className="relative">
        {hours.map((hour, i) => (
          <div key={i} className="flex items-start mb-10">
            {/* Time indicator */}
            <div className="flex-shrink-0 w-16 py-2 px-2 text-right text-xs font-medium text-gray-600">
              {hour.label}
              <div className="text-xs">{hour.period}</div>
            </div>
            
            {/* Timeline */}
            <div className="relative flex-1 border-t border-gray-200 mt-4">
              <div className="absolute left-0 top-0 w-2 h-2 bg-gray-400 rounded-full -mt-1"></div>
              
              {/* Events */}
              {getEventsForDate(currentDate)
                .filter(event => event.startTime === hour.time)
                .map((event) => (
                <div 
                  key={event.id} 
                  className={`${event.color} ${event.completed ? 'line-through opacity-50' : ''} p-4 rounded-md shadow-sm ml-6 mr-4`}
                >
                  <p className="font-medium">{event.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Week view render function to match the design
  const renderWeekView = () => (
    <>
      {/* Week grid */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-8">
          {/* Empty corner */}
          <div></div>
          
          {/* Day labels */}
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
            <div key={i} className="text-center py-2">
              <div className="text-xs font-medium text-gray-600">{day}</div>
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        {hours.map((hour, hourIndex) => (
          <div key={hourIndex} className="grid grid-cols-8 mb-4">
            {/* Time indicator */}
            <div className="py-2 px-2 text-right text-xs font-medium text-gray-600">
              {hour.label}
              <div className="text-xs">{hour.period}</div>
              
              {hourIndex === 0 && (
                <div className="absolute w-full border-t border-gray-200 mt-3 left-0"></div>
              )}
            </div>
            
            {/* Day slots */}
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <div key={dayIndex} className="px-1 pt-2 relative">
                {hourIndex === 0 && dayIndex === 0 && (
                  <div className="absolute h-2 w-2 rounded-full bg-gray-400 left-0 top-4 -ml-1"></div>
                )}
                
                {getEventsForHourAndDay(hour.time, dayIndex).map((event) => (
                  <div 
                    key={event.id} 
                    className={`${event.color} ${event.completed ? 'line-through opacity-50' : ''} p-2 rounded-md shadow-sm mb-1 text-xs`}
                  >
                    <p className="font-medium truncate">{event.title}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  // Month view render function to match the design
  const renderMonthView = () => (
    <div className="overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
          <div key={i} className="text-center py-2">
            <div className="text-xs font-medium text-gray-600">{day}</div>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, i) => {
          const dayEvents = getEventsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div 
              key={i} 
              className={`min-h-24 p-1 ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className="text-right text-xs font-medium mb-1 text-gray-700">
                {getDate(day)}
              </div>
              
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`${event.color} ${event.completed ? 'line-through opacity-50' : ''} h-5 rounded-sm`}
                  ></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderView = () => {
    // If there are no tasks with due dates, show empty state
    if (taskEvents.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-md shadow-sm">
          <FiCalendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">No tasks with due dates to display</p>
          <p className="text-sm text-gray-500 mt-1">Add due dates to your tasks to see them here</p>
        </div>
      );
    }

    // Otherwise show the appropriate view
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          {viewMode === 'day' 
            ? format(currentDate, 'd MMMM yyyy')
            : viewMode === 'week'
              ? `${format(weekStart, 'd')}–${format(weekEnd, 'd')} ${format(currentDate, 'MMMM yyyy')}`
              : format(currentDate, 'MMMM yyyy')
          }
        </h1>
        
        <div className="flex items-center">
          <button className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">
            Add Event
          </button>
        </div>
      </div>
      
      <div className="flex mb-6">
        <div className="inline-flex bg-gray-100 rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 text-sm ${viewMode === 'day' ? 'bg-white' : ''}`}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 text-sm ${viewMode === 'week' ? 'bg-white' : ''}`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 text-sm ${viewMode === 'month' ? 'bg-white' : ''}`}
          >
            Month
          </button>
        </div>
        <div className="ml-auto flex">
          <button
            onClick={prevPeriod}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextPeriod}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        renderView()
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage; 