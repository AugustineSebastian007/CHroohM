import { useState } from 'react';
import { FiChevronRight, FiCalendar, FiTag, FiClock, FiDivideCircle } from 'react-icons/fi';
import useTaskStore from '../../store/useTaskStore';
import TaskDetails from './TaskDetails';

const TaskItem = ({ task }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const toggleTaskComplete = useTaskStore(state => state.toggleTaskComplete);
  const storeTags = useTaskStore(state => state.tags);
  const storeLists = useTaskStore(state => state.lists);
  
  // Extract date and time from dueDate if it contains a time component
  const dateTime = task.dueDate && task.dueDate.includes('T') 
    ? { 
        date: task.dueDate.split('T')[0],
        time: task.dueDate.split('T')[1].substring(0, 5) // Get HH:MM format
      }
    : { date: task.dueDate, time: task.dueTime };

  const handleCheckboxChange = () => {
    toggleTaskComplete(task.id);
  };

  // Determine if task is associated with a list (to show color)
  const getListColor = () => {
    const list = storeLists.find(l => l.name === task.list);
    if (list) return list.color;
    
    // Fallbacks for default lists
    if (task.list === 'Personal') return 'bg-secondary';
    if (task.list === 'Work') return 'bg-accent1';
    return 'bg-gray-200';
  };

  // Get tag color
  const getTagColor = (tagName) => {
    if (tagName.toUpperCase() === 'ASAP') return 'asap';
    if (tagName.toUpperCase() === 'QUICK') return 'quick';
    const tag = storeTags.find(t => t.name === tagName);
    return tag ? tag.color : 'bg-gray-200';
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

      {/* Task metadata row (date, subtasks, list, tags) */}
      {(task.dueDate || task.subtasks || task.list || (task.tags && task.tags.length > 0)) && (
        <div className="task-metadata pl-10">
          {dateTime.date && (
            <div className="task-metadata-item task-metadata-date">
              <FiCalendar className="text-gray-400 mr-1" />
              <span>{dateTime.date}</span>
            </div>
          )}
          
          {dateTime.time && (
            <>
              <div className="metadata-divider"></div>
              <div className="task-metadata-item task-metadata-time">
                <FiClock className="text-gray-400 mr-1" />
                <span>{dateTime.time}</span>
              </div>
            </>
          )}
          
          {task.subtasks > 0 && (
            <>
              <div className="metadata-divider"></div>
              <div className="task-metadata-item">
                <span className="task-metadata-subtasks">
                  {task.subtasks} {task.subtasks === 1 ? 'Subtask' : 'Subtasks'}
                </span>
              </div>
            </>
          )}
          
          {task.list && (
            <>
              <div className="metadata-divider"></div>
              <div className={`task-metadata-item task-metadata-list ${getListColor()}`}>
                {task.list}
              </div>
            </>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <>
              <div className="metadata-divider"></div>
              <div className="task-metadata-tags-container">
                {task.tags.map((tagName, index) => (
                  <div 
                    key={index} 
                    className={`task-metadata-item task-metadata-tag ${getTagColor(tagName)} bg-opacity-80`}
                  >
                    <FiTag className="mr-1" size={12} />
                    {tagName}
                  </div>
                ))}
              </div>
            </>
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