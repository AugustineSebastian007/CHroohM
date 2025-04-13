import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import TaskList from '../components/ui/TaskList';
import useTaskStore from '../store/useTaskStore';

const TagPage = () => {
  const { tagId } = useParams();
  const navigate = useNavigate();
  const tasks = useTaskStore(state => state.tasks);
  const tags = useTaskStore(state => state.tags);
  const loading = useTaskStore(state => state.loading);
  const error = useTaskStore(state => state.error);
  const fetchTasks = useTaskStore(state => state.fetchTasks);

  useEffect(() => {
    // Only fetch tasks if we don't have any
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, []); // Empty dependency array to run only once

  // Find current tag
  const currentTag = tags.find(t => t.id === parseInt(tagId));
  
  // Redirect to home if tag doesn't exist
  useEffect(() => {
    if (!loading && !currentTag) {
      navigate('/');
    }
  }, [currentTag, loading, navigate]);
  
  // If tag doesn't exist and we're not loading, return null
  if (!currentTag && !loading) {
    return null;
  }
  
  // Filter tasks by tag
  const tagTasks = tasks.filter(task => {
    if (currentTag && task.tags) {
      return task.tags.includes(currentTag.name);
    }
    return false;
  });

  return (
    <div className="w-full">
      <TaskList 
        title={currentTag ? currentTag.name : 'Tag'} 
        tasks={tagTasks} 
        icon={FiTag}
        tagId={parseInt(tagId)}
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

export default TagPage; 