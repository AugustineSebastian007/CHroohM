import { useState } from 'react';
import { FiPlus, FiFilter, FiChevronDown } from 'react-icons/fi';
import TaskItem from './TaskItem';
import useTaskStore from '../../store/useTaskStore';

const TaskList = ({ title, tasks = [], icon: Icon, listId, tagId }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const addTask = useTaskStore(state => state.addTask);
  const lists = useTaskStore(state => state.lists);
  const tags = useTaskStore(state => state.tags);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    // Determine if we're adding to a specific list
    let listName = '';
    if (listId) {
      const list = lists.find(l => l.id === listId);
      if (list) {
        listName = list.name;
      }
    }
    
    // Determine if we're adding with a specific tag
    let taskTags = [];
    if (tagId) {
      const tag = tags.find(t => t.id === tagId);
      if (tag) {
        taskTags = [tag.name];
      }
    }
    
    addTask({
      todo: newTaskText,
      completed: false,
      userId: 1, // Default user ID for the API
      list: listName,
      tags: taskTags,
    });
    
    setNewTaskText('');
  };

  // Filter tasks based on filter status
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'completed') return task.completed;
    if (filterStatus === 'pending') return !task.completed;
    return true; // 'all' filter
  });

  return (
    <div className="w-full p-6 transition-all duration-300">
      {title && (
        <div className="flex items-center mb-8">
          <div className="flex-1">
            <div className="flex items-baseline">
              <h1 className="text-5xl font-bold text-gray-800">{title}</h1>
              {tasks.length > 0 && (
                <span className="ml-5 text-5xl font-bold text-gray-400">
                  {tasks.length}
                </span>
              )}
            </div>
          </div>
          
          {/* Filter dropdown */}
          {tasks.length > 0 && (
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
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center border border-gray-200 rounded-md hover:shadow-sm focus-within:border-gray-300">
          <button
            type="button"
            onClick={handleAddTask}
            className="p-3 text-gray-400 hover:text-gray-600"
            aria-label="Add new task"
          >
            <FiPlus className="h-5 w-5" />
          </button>
          <form onSubmit={handleAddTask} className="flex-1">
            <input
              type="text"
              placeholder={`Add task${listId ? ' to ' + title : ''}${tagId ? ' with tag ' + title : ''}`}
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="w-full p-2 focus:outline-none text-gray-700"
            />
          </form>
        </div>
      </div>
      
      <div className="space-y-1">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} isCompact={true} />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No {filterStatus !== 'all' ? filterStatus : ''} tasks to display</p>
            <p className="text-sm">
              {filterStatus === 'all' 
                ? 'Add a new task using the input field above' 
                : `No ${filterStatus} tasks found with the current filter`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 