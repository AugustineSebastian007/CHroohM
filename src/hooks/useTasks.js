import { useEffect, useState } from 'react';
import useTaskStore from '../store/useTaskStore';

const useTasks = (filter = 'all') => {
  const tasks = useTaskStore(state => state.tasks);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);
  const filterTasks = useTaskStore(state => state.filterTasks);

  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    // Only fetch tasks if we don't have any
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    setFilteredTasks(filterTasks(filter));
  }, [tasks, filter, filterTasks]);

  return {
    tasks: filteredTasks,
    loading,
    error,
  };
};

export default useTasks; 