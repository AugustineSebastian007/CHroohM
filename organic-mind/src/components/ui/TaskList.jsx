import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import TaskItem from './TaskItem';
import useTaskStore from '../../store/useTaskStore';

const TaskList = ({ title, tasks = [], icon: Icon, listId }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const addTask = useTaskStore(state => state.addTask);
  const lists = useTaskStore(state => state.lists);

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
    
    addTask({
      todo: newTaskText,
      completed: false,
      userId: 1, // Default user ID for the API
      list: listName,
    });
    
    setNewTaskText('');
  };

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
              placeholder={`Add task${listId ? ' to ' + title : ''}`}
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="w-full p-2 focus:outline-none text-gray-700"
            />
          </form>
        </div>
      </div>
      
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No tasks to display</p>
            <p className="text-sm">Add a new task using the input field above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 