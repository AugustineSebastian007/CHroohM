import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiList } from 'react-icons/fi';
import TaskList from '../components/ui/TaskList';
import useTaskStore from '../store/useTaskStore';

const ListPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);
  const lists = useTaskStore(state => state.lists);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);

  useEffect(() => {
    // Only fetch tasks if we don't have any
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, []); // Empty dependency array to run only once

  // Find current list
  const currentList = lists.find(l => l.id === parseInt(listId));
  
  // Redirect to home if list doesn't exist
  useEffect(() => {
    if (!loading && !currentList) {
      navigate('/');
    }
  }, [currentList, loading, navigate]);
  
  // If list doesn't exist and we're not loading, return null
  if (!currentList && !loading) {
    return null;
  }
  
  // Filter tasks by list
  const listTasks = tasks.filter(task => {
    if (currentList) {
      return task.list === currentList.name;
    }
    return false;
  });

  return (
    <div className="w-full">
      <TaskList 
        title={currentList ? currentList.name : 'List'} 
        tasks={listTasks} 
        icon={FiList}
        listId={parseInt(listId)}
      />
      
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

export default ListPage; 