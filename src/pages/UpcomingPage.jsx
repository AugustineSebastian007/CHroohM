import { useEffect, useState } from 'react';
import { FiPlus, FiChevronRight, FiCalendar, FiFilter, FiChevronDown } from 'react-icons/fi';
import useTaskStore from '../store/useTaskStore';
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';
import TaskItem from '../components/ui/TaskItem';
import TaskDetails from '../components/ui/TaskDetails';

const UpcomingPage = () => {
  const tasks = useTaskStore(state => state.tasks);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);
  const toggleTaskComplete = useTaskStore(state => state.toggleTaskComplete);
  const getUpcomingTasks = useTaskStore(state => state.getUpcomingTasks);
  const getTodayTasks = useTaskStore(state => state.getTodayTasks);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Fetch tasks if we don't have any or force refresh
    fetchTasks();
  }, []); // Empty dependency array to run only once

  // Get today's tasks directly from the store function for better accuracy
  const allTodayTasks = getTodayTasks();
  
  // Get upcoming tasks for tomorrow and this week
  const upcomingTasks = getUpcomingTasks();
  
  // Group tasks by time period (tomorrow and this week)
  const allTomorrowTasks = [];
  const allThisWeekTasks = [];
  
  upcomingTasks.forEach(task => {
    if (!task.dueDate) return;
    
    try {
      // Try to parse using different date formats
      let taskDate;
      
      // DD-MM-YY format (standard format in the app)
      if (task.dueDate.includes('-')) {
        const [day, month, year] = task.dueDate.split('-').map(num => parseInt(num, 10));
        // Check if it's a 2-digit or 4-digit year
        const fullYear = year > 99 ? year : 2000 + year;
        taskDate = new Date(fullYear, month - 1, day);
      } 
      // ISO format (YYYY-MM-DD) if it comes from API
      else if (task.dueDate.includes('T')) {
        taskDate = parseISO(task.dueDate);
      }
      // Fallback to general date parsing
      else {
        taskDate = new Date(task.dueDate);
      }
      
      // Skip invalid dates
      if (isNaN(taskDate.getTime())) {
        console.error('Invalid date format:', task.dueDate);
        return;
      }
      
      // Reset hours to midnight for consistent date comparison
      taskDate.setHours(0, 0, 0, 0);
      
      // We skip today tasks since we got them directly from the store
      if (isTomorrow(taskDate)) {
        allTomorrowTasks.push(task);
      } else if (isThisWeek(taskDate) && !isToday(taskDate) && !isTomorrow(taskDate)) {
        allThisWeekTasks.push(task);
      }
    } catch (e) {
      console.error('Error parsing date:', task.dueDate, e);
    }
  });

  // Apply filter to all task sections
  const applyFilter = (tasks) => {
    return tasks.filter(task => {
      if (filterStatus === 'completed') return task.completed;
      if (filterStatus === 'pending') return !task.completed;
      return true; // 'all' filter
    });
  };

  // Apply filters to each section
  const todayTasks = applyFilter(allTodayTasks);
  const tomorrowTasks = applyFilter(allTomorrowTasks);
  const thisWeekTasks = applyFilter(allThisWeekTasks);

  const handleAddTask = (section) => {
    console.log(`Add task to ${section}`);
    // You can implement task adding logic here
  };

  const getListColor = (listName) => {
    if (listName === 'Personal') return 'bg-red-200 text-red-700';
    if (listName === 'Work') return 'bg-blue-200 text-blue-700';
    if (listName === 'List 1') return 'bg-yellow-200 text-yellow-700';
    return 'bg-gray-200 text-gray-700';
  };

  const AddTaskButton = ({ section }) => (
    <div className="flex items-center py-3 text-gray-500 border-b border-gray-100">
      <FiPlus className="h-5 w-5 mr-3 ml-0.5" />
      <span>Add New Task</span>
    </div>
  );

  const TaskSection = ({ title, tasks, allTasks }) => (
    <div className={`${title === 'Today' ? 'col-span-2' : ''} bg-white rounded-lg border border-gray-200 overflow-hidden`}>
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="px-5">
        <AddTaskButton section={title.toLowerCase()} />
        
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="py-4 text-gray-500 text-center">
            {allTasks.length > 0 ? (
              <p>No {filterStatus !== 'all' ? filterStatus : ''} tasks for {title.toLowerCase()}</p>
            ) : (
              <p>No tasks for {title.toLowerCase()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const totalTasks = allTodayTasks.length + allTomorrowTasks.length + allThisWeekTasks.length;
  const upcomingTasksCount = todayTasks.length + tomorrowTasks.length + thisWeekTasks.length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-gray-800">Upcoming</h1>
          {totalTasks > 0 && (
            <div className="ml-4 px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-lg">
              {totalTasks}
            </div>
          )}
        </div>
        
        {/* Filter dropdown */}
        {totalTasks > 0 && (
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter className="text-gray-500" size={16} />
              <span className="text-gray-700">{filterStatus === 'all' ? 'All Tasks' : filterStatus === 'completed' ? 'Completed' : 'Pending'}</span>
              <FiChevronDown className="text-gray-500" size={16} />
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
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
      </div>
      
      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <TaskSection title="Today" tasks={todayTasks} allTasks={allTodayTasks} />
          <TaskSection title="Tomorrow" tasks={tomorrowTasks} allTasks={allTomorrowTasks} />
          <TaskSection title="This Week" tasks={thisWeekTasks} allTasks={allThisWeekTasks} />
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p>{error}</p>
        </div>
      )}

      {selectedTaskId && (
        <TaskDetails 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}
    </div>
  );
};

export default UpcomingPage; 