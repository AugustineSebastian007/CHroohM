import { useEffect } from 'react';
import { FiList } from 'react-icons/fi';
import TaskList from '../components/ui/TaskList';
import useTaskStore from '../store/useTaskStore';

const TodayPage = () => {
  const tasks = useTaskStore(state => state.tasks);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);
  const getTodayTasks = useTaskStore(state => state.getTodayTasks);

  useEffect(() => {
    // Only fetch tasks if we don't have any
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, []); // Empty dependency array to run only once

  // Get tasks that are due today
  const todayDueTasks = getTodayTasks();
  
  // Get tasks with no due date
  const undatedTasks = tasks.filter(task => !task.dueDate);
  
  // Combine both sets of tasks for display
  const tasksToShow = [...todayDueTasks, ...undatedTasks];

  return (
    <div className="w-full">
      <TaskList title="Today" tasks={tasksToShow} icon={FiList} />
      
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

export default TodayPage; 