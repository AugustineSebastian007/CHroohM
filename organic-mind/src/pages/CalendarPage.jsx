import React, { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiFilter, FiChevronDown } from 'react-icons/fi';
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

// CSS for hiding scrollbars
const hideScrollbarStyle = {
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE/Edge
  WebkitOverflowScrolling: 'touch', // Mobile momentum scrolling
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use current device date
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', or 'month'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const tasks = useTaskStore(state => state.tasks);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);

  // Add CSS to hide webkit scrollbars
  useEffect(() => {
    // Add a style tag to the document head
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      // Check if dateString contains time information (has a T separator)
      let datePart = dateString;
      let timePart = null;
      
      if (dateString.includes('T')) {
        [datePart, timePart] = dateString.split('T');
      }
      
      // Handle DD-MM-YY format
      if (datePart.match(/^\d{2}-\d{2}-\d{2}$/)) {
        const [day, month, year] = datePart.split('-').map(num => parseInt(num, 10));
        // Assuming 2-digit year (YY) in the 2000s
        const date = new Date(2000 + year, month - 1, day);
        
        // Add time if available
        if (timePart && timePart.match(/^\d{2}:\d{2}$/)) {
          const [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));
          date.setHours(hours, minutes);
        }
        
        return date;
      } 
      
      // Try parsing as ISO date if other format
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.error('Error parsing date:', dateString);
      return null;
    }
  };

  // Reference for the calendar container to enable scrolling to current time
  const calendarRef = useRef(null);

  // Hours to display - full 24 hours
  const hours = [
    { time: "00:00", label: "12:00", period: "AM" },
    { time: "01:00", label: "01:00", period: "AM" },
    { time: "02:00", label: "02:00", period: "AM" },
    { time: "03:00", label: "03:00", period: "AM" },
    { time: "04:00", label: "04:00", period: "AM" },
    { time: "05:00", label: "05:00", period: "AM" },
    { time: "06:00", label: "06:00", period: "AM" },
    { time: "07:00", label: "07:00", period: "AM" },
    { time: "08:00", label: "08:00", period: "AM" },
    { time: "09:00", label: "09:00", period: "AM" },
    { time: "10:00", label: "10:00", period: "AM" },
    { time: "11:00", label: "11:00", period: "AM" },
    { time: "12:00", label: "12:00", period: "PM" },
    { time: "13:00", label: "01:00", period: "PM" },
    { time: "14:00", label: "02:00", period: "PM" },
    { time: "15:00", label: "03:00", period: "PM" },
    { time: "16:00", label: "04:00", period: "PM" },
    { time: "17:00", label: "05:00", period: "PM" },
    { time: "18:00", label: "06:00", period: "PM" },
    { time: "19:00", label: "07:00", period: "PM" },
    { time: "20:00", label: "08:00", period: "PM" },
    { time: "21:00", label: "09:00", period: "PM" },
    { time: "22:00", label: "10:00", period: "PM" },
    { time: "23:00", label: "11:00", period: "PM" }
  ];

  // Get current time information for the dot marker
  const getCurrentTimeInfo = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1; // Convert to 0 = Monday format
    
    // Calculate the fractional hour based on minutes
    const hourFraction = currentHour + (currentMinute / 60);
    
    return { 
      day: currentDay, 
      hour: currentHour,
      minute: currentMinute,
      hourIndex: currentHour, // For direct hour index lookup
      hourFraction: hourFraction, // For precise positioning
      isCurrentDay: true
    };
  };

  // Modify the useEffect for scrolling to current time to work with sections
  useEffect(() => {
    // Only scroll if we're in a view that shows hours (day or week)
    if (calendarRef.current && (viewMode === 'week' || viewMode === 'day')) {
      const currentTime = getCurrentTimeInfo();
      
      // Add a small delay to ensure content is fully rendered
      const scrollTimer = setTimeout(() => {
        if (calendarRef.current) {
          if (viewMode === 'day') {
            // For day view - hourly based scrolling
            const hourHeight = calendarRef.current.scrollHeight / hours.length;
            const scrollPosition = (currentTime.hourFraction * hourHeight) - 
                                (calendarRef.current.clientHeight / 2) + 
                                (hourHeight / 2);
            
            calendarRef.current.scrollTo({
              top: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
          } else {
            // For week view - section based scrolling
            const timeSections = [
              { startHour: 0, endHour: 4 },
              { startHour: 5, endHour: 9 },
              { startHour: 10, endHour: 14 },
              { startHour: 15, endHour: 19 },
              { startHour: 20, endHour: 23 }
            ];
            
            // Find which section contains current hour
            let targetSectionIndex = 0;
            for (let i = 0; i < timeSections.length; i++) {
              if (currentTime.hourIndex >= timeSections[i].startHour && 
                  currentTime.hourIndex <= timeSections[i].endHour) {
                targetSectionIndex = i;
                break;
              }
            }
            
            // Calculate section height (all sections have equal height)
            const sectionHeight = calendarRef.current.scrollHeight / timeSections.length;
            
            // Calculate position within section
            const sectionStartHour = timeSections[targetSectionIndex].startHour;
            const sectionEndHour = timeSections[targetSectionIndex].endHour;
            const positionInSection = (currentTime.hourIndex - sectionStartHour + currentTime.minute/60) / 
                                    (sectionEndHour - sectionStartHour + 1);
            
            // Calculate final scroll position
            const scrollPosition = (targetSectionIndex * sectionHeight) + 
                                  (positionInSection * sectionHeight) - 
                                  (calendarRef.current.clientHeight / 2) + 
                                  (sectionHeight / 2);
            
            calendarRef.current.scrollTo({
              top: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
          }
        }
      }, 100); // Short delay to ensure rendering is complete
      
      // Clean up timer on unmount or when dependencies change
      return () => clearTimeout(scrollTimer);
    }
  }, [viewMode, loading, hours.length]);

  // Also add a useEffect that handles resetting the position when switching to month view
  useEffect(() => {
    // When switching to month view, scroll to top
    if (calendarRef.current && viewMode === 'month') {
      calendarRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [viewMode]);

  // Combine real tasks with mock events for the design
  const getTaskEvents = () => {
    // Filter tasks by completion status first
    const filteredTasks = tasks.filter(task => {
      if (filterStatus === 'completed') return task.completed;
      if (filterStatus === 'pending') return !task.completed;
      return true; // 'all' filter
    });
    
    return filteredTasks
      .filter(task => task.dueDate) // Only include tasks with due dates
      .map(task => {
        const date = parseTaskDate(task.dueDate);
        if (!date) return null;
        
        // Determine color based on list - exactly match the colors in the image
        let color = "bg-blue-100";
        if (task.list === "Personal") color = "bg-red-100";
        else if (task.list === "Work") color = "bg-blue-100";
        else if (task.list === "List 1") color = "bg-yellow-100";
        
        // Use actual time from the parsed date object
        const hour = date.getHours();
        const minute = date.getMinutes();
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        return {
          id: task.id,
          title: task.todo,
          startTime: time,
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

  // Get current time marker position
  const currentTimeMarker = getCurrentTimeInfo();

  // Get events for a specific hour and day
  const getEventsForHourAndDay = (hourTime, dayIndex) => {
    const hourNumber = parseInt(hourTime.split(':')[0]);
    
    // Get all events for this day
    return taskEvents.filter(event => {
      // First check if the event is on the correct day
      if (event.day !== dayIndex) return false;
      
      // Then check if the event hour matches the hour we're currently rendering
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hourNumber;
    }).map(event => {
      // Calculate the minute as a percentage of the hour for positioning
      const eventMinute = parseInt(event.startTime.split(':')[1]) || 0;
      const minutePercentage = (eventMinute / 60) * 100;
      
      return {
        ...event,
        minutePercentage
      };
    });
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
    <div className="overflow-hidden">
      {/* Time slots - directly render without an additional scrollable container */}
      <div className="grid grid-cols-[minmax(80px,_1fr)_7fr]">
        {hours.map((hour, i) => {
          const isCurrentHour = parseInt(hour.time) === currentTimeMarker.hourIndex;
          const currentTimePosition = isCurrentHour ? 
            (currentTimeMarker.minute / 60) * 100 : // Convert minutes to % of hour
            null;
          
          return (
            <div key={i} className="contents">
              {/* Time indicator - exact same as week view */}
              <div className="border-r py-8 relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
                  <div className="text-xs font-medium text-gray-600">{hour.label}</div>
                  <div className="text-xs text-gray-500">{hour.period}</div>
                </div>
                {/* Position the dot in the time column if this is the current hour */}
                {isCurrentHour && (
                  <div 
                    className="h-2 w-2 bg-black rounded-full absolute right-0 z-20"
                    style={{ 
                      top: `calc(${currentTimeMarker.minute / 60 * 100}% + 4px)`,
                      transform: 'translateX(50%)'
                    }}
                  ></div>
                )}
            </div>
              
              {/* Content area - match week view structure */}
              <div className="relative min-h-[100px]">
                {/* Current time marker - horizontal line */}
                {isCurrentHour && (
                  <div 
                    className="absolute left-0 right-0 z-10"
                    style={{ 
                      top: `calc(${currentTimePosition}% + 5px)`,
                      height: '1px',
                      backgroundColor: '#9CA3AF',
                      width: '100%'
                    }}
                  ></div>
                )}
                
                {/* Events - styled similar to week view with minute-based positioning */}
                {getEventsForHourAndDay(hour.time, currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)
                  .map((event) => (
                    <div 
                      key={event.id} 
                      className={`${event.color} ${event.completed ? 'line-through opacity-60' : ''} py-1.5 px-2 rounded-md mb-1 text-xs absolute left-1 right-1`}
                      style={{ 
                        fontSize: '0.75rem',
                        top: `${event.minutePercentage}%` 
                      }}
                    >
                      <p className="font-medium text-gray-700 truncate">{event.title}</p>
                    </div>
                  ))
                }
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );

  // Week view render function to exactly match the image
  const renderWeekView = () => {
    // Create 5 time sections instead of showing all 24 hours
    const timeSections = [
      { label: "12-5 AM", period: "Early Morning", startHour: 0, endHour: 4 },
      { label: "5-10 AM", period: "Morning", startHour: 5, endHour: 9 },
      { label: "10-3 PM", period: "Midday", startHour: 10, endHour: 14 },
      { label: "3-8 PM", period: "Evening", startHour: 15, endHour: 19 },
      { label: "8-12 PM", period: "Night", startHour: 20, endHour: 23 }
    ];

    return (
      <div className="overflow-hidden">
        {/* Content without scrollable container */}
        <div className="grid grid-cols-8">
          {/* Time sections */}
          {timeSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="contents">
              {/* Time indicator in first column */}
              <div className="border-r py-8 relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
                  <div className="text-xs font-medium text-gray-600">{section.label}</div>
                  <div className="text-xs text-gray-500">{section.period}</div>
                </div>
                {/* Position the dot in the time column if current time is in this section */}
                {currentTimeMarker.hourIndex >= section.startHour && 
                 currentTimeMarker.hourIndex <= section.endHour && (
                  <div 
                    className="h-2 w-2 bg-black rounded-full absolute right-0 z-20"
                    style={{ 
                      // Calculate relative position in section
                      top: `calc(${(currentTimeMarker.hourIndex - section.startHour + currentTimeMarker.minute/60) / (section.endHour - section.startHour + 1) * 100}% + 4px)`,
                      transform: 'translateX(50%)'
                    }}
                  ></div>
                )}
              </div>
              
              {/* Day cells for this time section */}
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                // Determine if current time is in this section
                const isCurrentTimeSection = 
                  currentTimeMarker.hourIndex >= section.startHour && 
                  currentTimeMarker.hourIndex <= section.endHour;
                const isToday = dayIndex === currentTimeMarker.day;
                
                // Calculate section-relative position for current time marker
                const currentTimePosition = isCurrentTimeSection ? 
                  ((currentTimeMarker.hourIndex - section.startHour + currentTimeMarker.minute/60) / 
                   (section.endHour - section.startHour + 1)) * 100 : null;
                
                // Get all events for this day that fall within the current section's hours
                const sectionEvents = taskEvents.filter(event => {
                  if (event.day !== dayIndex) return false;
                  
                  const eventHour = parseInt(event.startTime.split(':')[0]);
                  return eventHour >= section.startHour && eventHour <= section.endHour;
                }).map(event => {
                  // Calculate position relative to the section
                  const eventHour = parseInt(event.startTime.split(':')[0]);
                  const eventMinute = parseInt(event.startTime.split(':')[1]) || 0;
                  const hourPosition = eventHour - section.startHour;
                  const sectionPercentage = 
                    (hourPosition + eventMinute/60) / (section.endHour - section.startHour + 1) * 100;
                  
                  return {
                    ...event,
                    minutePercentage: sectionPercentage
                  };
                });
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`border-r last:border-r-0 relative min-h-[100px] ${sectionIndex === 0 ? 'pt-3' : 'pt-1'} pb-1 px-1 ${isToday ? 'bg-gray-100' : ''}`}
                  >                        
                    {/* Current time marker - only the horizontal line */}
                    {isCurrentTimeSection && (
                      <div 
                        className="absolute left-0 right-0 z-10"
                        style={{ 
                          top: `calc(${currentTimePosition}% + 5px)`,
                          height: '1px',
                          backgroundColor: '#9CA3AF',
                          width: '100%'
                        }}
                      ></div>
                    )}
                    
                    {/* Events styled to match the image */}
                    {sectionEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className={`${event.color} ${event.completed ? 'line-through opacity-60' : ''} py-1.5 px-2 rounded-md mb-1 text-xs absolute left-1 right-1`}
                        style={{ 
                          fontSize: '0.75rem',
                          top: `${event.minutePercentage}%` 
                        }}
                      >
                        <p className="font-medium text-gray-700 truncate">{event.title}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Month view render function - ensure equal row spacing
  const renderMonthView = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      {/* Day labels - fixed header */}
      <div className="grid grid-cols-7 border-b sticky top-0 bg-white z-10">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
          <div key={i} className="text-center py-1.5 border-r last:border-r-0">
            <div className="text-xs font-bold text-gray-800">{day}</div>
          </div>
        ))}
      </div>
      
      {/* Calendar grid - set grid-auto-rows for equal row heights */}
      <div className="grid grid-cols-7 grid-rows-[repeat(6,_1fr)] flex-grow">
        {/* First determine the total weeks (for proper grid distribution) */}
        {(() => {
          // Group days by week
          const weeks = monthDays.reduce((acc, day, index) => {
            const weekIndex = Math.floor(index / 7);
            if (!acc[weekIndex]) acc[weekIndex] = [];
            acc[weekIndex].push(day);
            return acc;
          }, []);
          
          // Render each week's days with equal height
          return weeks.map((week, weekIndex) => (
            <React.Fragment key={`week-${weekIndex}`}>
              {week.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div 
                    key={`${weekIndex}-${dayIndex}`}
                    className={`border-b border-r last:border-r-0 p-1.5 flex flex-col ${
                      !isCurrentMonth ? 'bg-gray-50' : isToday ? 'bg-gray-200' : 'bg-white'
                    } ${isToday ? 'font-bold' : ''} min-h-[85px]`}
                  >
                    {/* Day number - left aligned and bigger, extra bold */}
                    <div className="text-left font-bold mb-1 text-gray-800">
                      <span className="text-base">{getDate(day)}</span>
                    </div>
                    
                    {/* Events list */}
                    <div className="space-y-0.5 flex-grow">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={`${event.color} ${event.completed ? 'line-through opacity-50' : ''} rounded-md p-1`}
                        >
                          <p className="truncate text-gray-800 font-bold text-xs">{event.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ));
        })()}
      </div>
    </div>
  );

  const renderView = () => {
    // If there are no tasks with due dates that match the filter, show empty state
    if (taskEvents.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-md shadow-sm">
          <FiCalendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">No {filterStatus !== 'all' ? filterStatus : ''} tasks with due dates to display</p>
          <p className="text-sm text-gray-500 mt-1">
            {filterStatus === 'all' 
              ? 'Add due dates to your tasks to see them here' 
              : `No ${filterStatus} tasks found with the current filter`}
          </p>
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
    <div className="pt-6 pb-3 px-10 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          {viewMode === 'day' 
            ? format(currentDate, 'd MMMM yyyy')
            : viewMode === 'week'
              ? `${format(weekStart, 'd')}–${format(weekEnd, 'd')} ${format(currentDate, 'MMMM yyyy')}`
              : format(currentDate, 'MMMM yyyy')
          }
        </h1>
        
        <div className="flex items-center">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium">
            Add Event
          </button>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => {
              setViewMode('day');
              // Force a recalculation with longer delay
              if (calendarRef.current) {
                setTimeout(() => {
                  const currentTime = getCurrentTimeInfo();
                  // Force a new calculation of hour height after render
                  const hourHeight = calendarRef.current.scrollHeight / hours.length;
                  console.log("Day view scroll height:", calendarRef.current.scrollHeight);
                  console.log("Hour height calculated:", hourHeight);
                  
                  const scrollPosition = (currentTime.hourFraction * hourHeight) - 
                                        (calendarRef.current.clientHeight / 2) + 
                                        (hourHeight / 2);
                  
                  calendarRef.current.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                  });
                }, 500); // Much longer delay for transitions between views
              }
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${viewMode === 'day' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            Day
          </button>
          <button
            onClick={() => {
              setViewMode('week');
              // Force a recalculation with longer delay
              if (calendarRef.current) {
                setTimeout(() => {
                  const currentTime = getCurrentTimeInfo();
                  // Force a new calculation of hour height after render
                  const hourHeight = calendarRef.current.scrollHeight / hours.length;
                  console.log("Week view scroll height:", calendarRef.current.scrollHeight);
                  console.log("Hour height calculated:", hourHeight);
                  
                  const scrollPosition = (currentTime.hourFraction * hourHeight) - 
                                        (calendarRef.current.clientHeight / 2) + 
                                        (hourHeight / 2);
                  
                  calendarRef.current.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                  });
                }, 500); // Much longer delay for transitions between views
              }
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${viewMode === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            Week
          </button>
          <button
            onClick={() => {
              setViewMode('month');
              // Scroll to top for month view
              if (calendarRef.current) {
                setTimeout(() => {
                  calendarRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }, 100);
              }
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${viewMode === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            Month
          </button>
        </div>
        
        <div className="flex ml-auto">
          {/* Filter dropdown - only show when there are tasks */}
          {taskEvents.length > 0 && (
            <div className="relative mr-4">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FiFilter className="text-gray-500" size={16} />
                <span className="text-gray-700">{filterStatus === 'all' ? 'All Tasks' : filterStatus === 'completed' ? 'Completed' : 'Pending'}</span>
                <FiChevronDown className="text-gray-500" size={16} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-md z-20">
                  <div 
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filterStatus === 'all' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      setFilterStatus('all');
                      setIsFilterOpen(false);
                    }}
                  >
                    All Tasks
                  </div>
                  <div 
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filterStatus === 'completed' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      setFilterStatus('completed');
                      setIsFilterOpen(false);
                    }}
                  >
                    Completed
                  </div>
                  <div 
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${filterStatus === 'pending' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      setFilterStatus('pending');
                      setIsFilterOpen(false);
                    }}
                  >
                    Pending
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center">
          <button
            onClick={prevPeriod}
            className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Previous period"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextPeriod}
            className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Next period"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Fixed headers based on view mode */}
          {viewMode === 'day' && (
            <div className="text-center py-3 border-b sticky top-0 bg-white z-10">
              <h2 className="text-sm text-gray-600 font-medium uppercase">{format(currentDate, 'EEEE')}</h2>
            </div>
          )}
          
          {viewMode === 'week' && (
            <div className="grid grid-cols-8 border-b sticky top-0 z-10 bg-white">
              <div className="border-r py-3 bg-white"></div> {/* Empty corner */}
              
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                <div key={i} className="text-center py-3 border-r last:border-r-0 bg-white">
                  <div className="text-xs font-medium text-gray-600">{day}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Scrollable content area */}
          <div 
            ref={calendarRef} 
            className="h-[calc(100vh-180px)] overflow-y-auto hide-scrollbar"
            style={hideScrollbarStyle}
          >
            {renderView()}
          </div>
        </div>
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