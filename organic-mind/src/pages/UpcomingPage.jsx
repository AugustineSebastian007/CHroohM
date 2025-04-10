import { useEffect, useState } from 'react';
import { FiPlus, FiChevronRight, FiCalendar } from 'react-icons/fi';
import useTaskStore from '../store/useTaskStore';
import { format, addDays, isToday, isTomorrow, isThisWeek, isAfter } from 'date-fns';

const UpcomingPage = () => {
  const tasks = useTaskStore(state => state.tasks);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);
  const toggleTaskComplete = useTaskStore(state => state.toggleTaskComplete);
  const getUpcomingTasks = useTaskStore(state => state.getUpcomingTasks);

  useEffect(() => {
    // Only fetch tasks if we don't have any
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, []); // Empty dependency array to run only once

  // Get upcoming tasks
  const upcomingTasks = getUpcomingTasks();
  
  // Group tasks by time period
  const todayTasks = [];
  const tomorrowTasks = [];
  const thisWeekTasks = [];
  const laterTasks = [];
  
  upcomingTasks.forEach(task => {
    if (!task.dueDate) return;
    
    try {
      const dateStr = task.dueDate;
      const [day, month, year] = dateStr.split('-').map(num => parseInt(num, 10));
      
      // Create date object - assuming format is DD-MM-YY
      const taskDate = new Date(2000 + year, month - 1, day);
      
      if (isToday(taskDate)) {
        todayTasks.push(task);
      } else if (isTomorrow(taskDate)) {
        tomorrowTasks.push(task);
      } else if (isThisWeek(taskDate)) {
        thisWeekTasks.push(task);
      } else {
        laterTasks.push(task);
      }
    } catch (e) {
      console.error('Error parsing date:', task.dueDate);
    }
  });

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

  const renderTaskItem = (task) => (
    <div key={task.id} className="bg-white rounded-md shadow-sm mb-1">
      <div className="p-3 flex items-center group">
        <div className="mr-2 flex-shrink-0">
          <input 
            type="checkbox" 
            checked={task.completed}
            onChange={() => toggleTaskComplete(task.id)}
            className="h-4 w-4 rounded border-gray-300 cursor-pointer"
          />
        </div>
        <div className="flex-grow">
          <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.todo}
          </p>
          {(task.dueDate || task.subtasks || task.list) && (
            <div className="flex items-center gap-1 mt-1">
              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <FiCalendar className="mr-1" />
                  <span>{task.dueDate}</span>
                </div>
              )}
              {task.subtasks > 0 && (
                <div className="bg-gray-100 text-xs text-gray-500 px-1 py-0.5 rounded">
                  {task.subtasks} {task.subtasks === 1 ? 'Subtask' : 'Subtasks'}
                </div>
              )}
              {task.list && (
                <div className={`${getListColor(task.list)} text-xs px-1.5 py-0.5 rounded`}>
                  {task.list}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-auto h-full p-6">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800">Upcoming</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Today Section */}
          {todayTasks.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Today</h2>
                <button 
                  onClick={() => handleAddTask('today')}
                  className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                >
                  <FiPlus className="mr-1" /> 
                  Add Task
                </button>
              </div>
              <div>
                {todayTasks.map(task => renderTaskItem(task))}
              </div>
            </div>
          )}
          
          {/* Tomorrow Section */}
          {tomorrowTasks.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Tomorrow</h2>
                <button 
                  onClick={() => handleAddTask('tomorrow')}
                  className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                >
                  <FiPlus className="mr-1" /> 
                  Add Task
                </button>
              </div>
              <div>
                {tomorrowTasks.map(task => renderTaskItem(task))}
              </div>
            </div>
          )}
          
          {/* This Week Section */}
          {thisWeekTasks.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">This Week</h2>
                <button 
                  onClick={() => handleAddTask('thisWeek')}
                  className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                >
                  <FiPlus className="mr-1" /> 
                  Add Task
                </button>
              </div>
              <div>
                {thisWeekTasks.map(task => renderTaskItem(task))}
              </div>
            </div>
          )}
          
          {/* Later Section */}
          {laterTasks.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Later</h2>
                <button 
                  onClick={() => handleAddTask('later')}
                  className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                >
                  <FiPlus className="mr-1" /> 
                  Add Task
                </button>
              </div>
              <div>
                {laterTasks.map(task => renderTaskItem(task))}
              </div>
            </div>
          )}
          
          {upcomingTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming tasks</p>
            </div>
          )}
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

export default UpcomingPage; 