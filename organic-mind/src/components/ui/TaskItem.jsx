import { useState } from 'react';
import { FiChevronRight, FiCalendar } from 'react-icons/fi';
import useTaskStore from '../../store/useTaskStore';
import TaskDetails from './TaskDetails';

const TaskItem = ({ task }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const toggleTaskComplete = useTaskStore(state => state.toggleTaskComplete);

  const handleCheckboxChange = () => {
    toggleTaskComplete(task.id);
  };

  // Determine if task is associated with a list (to show color)
  const getListColor = () => {
    if (task.list === 'Personal') return 'bg-secondary';
    if (task.list === 'Work') return 'bg-accent1';
    if (task.list === 'List 1') return 'bg-primary';
    return 'bg-gray-200';
  };

  // Format for subtasks display
  const getSubtasksText = () => {
    if (!task.subtasks) return null;
    return task.subtasks === 1 ? '1 Subtask' : `${task.subtasks} Subtasks`;
  };

  return (
    <>
      <div 
        className="task-item flex items-center py-3 border-b border-gray-100 hover:bg-gray-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0 mx-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-300 cursor-pointer"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`text-base ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.todo}
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button 
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={() => setShowDetails(true)}
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Task metadata row (date, subtasks, list) */}
      {(task.dueDate || task.subtasks || task.list) && (
        <div className="task-metadata pl-10">
          {task.dueDate && (
            <div className="task-metadata-item task-metadata-date">
              <FiCalendar className="text-gray-400 mr-1" />
              <span>{task.dueDate}</span>
            </div>
          )}
          
          {task.subtasks > 0 && (
            <div className="task-metadata-item">
              <span className="task-metadata-subtasks">
                {task.subtasks} {task.subtasks === 1 ? 'Subtask' : 'Subtasks'}
              </span>
            </div>
          )}
          
          {task.list && (
            <div className={`task-metadata-list ${getListColor()}`}>
              {task.list}
            </div>
          )}
        </div>
      )}
      
      {showDetails && (
        <TaskDetails 
          taskId={task.id} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

export default TaskItem; 