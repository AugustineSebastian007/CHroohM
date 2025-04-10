import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { FiX, FiTrash2, FiCalendar, FiTag, FiPlus, FiChevronDown } from 'react-icons/fi';
import useTaskStore from '../../store/useTaskStore';

const TaskDetails = ({ taskId, onClose }) => {
  const tasks = useTaskStore(state => state.tasks);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  
  const [task, setTask] = useState(null);
  const [editedTask, setEditedTask] = useState({
    todo: '',
    description: '',
    dueDate: '',
    list: '',
    tags: [],
    subtasks: 0,
    subtasksList: [],
  });
  
  // Add a class to the main content container to shrink it when details panel is open
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('details-panel-open');
    }
    
    return () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.classList.remove('details-panel-open');
      }
    };
  }, []);
  
  useEffect(() => {
    const foundTask = tasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setEditedTask({
        todo: foundTask.todo,
        description: foundTask.description || '',
        dueDate: foundTask.dueDate || '',
        list: foundTask.list || 'Personal',
        tags: foundTask.tags || [],
        subtasks: foundTask.subtasks || 0,
        subtasksList: foundTask.subtasksList || [],
      });
    }
  }, [taskId, tasks]);
  
  if (!task) {
    return null;
  }
  
  const handleSave = () => {
    // Validate date format if entered (should be DD-MM-YY)
    if (editedTask.dueDate && !/^\d{2}-\d{2}-\d{2}$/.test(editedTask.dueDate)) {
      alert('Please enter date in DD-MM-YY format');
      return;
    }
    
    // Update subtasks count
    const updatedTask = {
      ...editedTask,
      subtasks: editedTask.subtasksList.length,
    };
    
    updateTask(taskId, updatedTask);
    onClose();
  };
  
  const handleDelete = () => {
    deleteTask(taskId);
    onClose();
  };
  
  const addNewSubtask = () => {
    const newSubtask = {
      id: editedTask.subtasksList.length + 1,
      text: '',
      completed: false
    };
    
    setEditedTask({
      ...editedTask,
      subtasksList: [...editedTask.subtasksList, newSubtask]
    });
  };
  
  const lists = [
    { id: 'personal', name: 'Personal', color: 'bg-secondary' },
    { id: 'work', name: 'Work', color: 'bg-accent1' },
    { id: 'list1', name: 'List 1', color: 'bg-primary' },
  ];
  
  const tags = [
    { id: 1, name: 'Tag 1', color: 'bg-accent1' },
    { id: 2, name: 'Tag 2', color: 'bg-secondary' },
  ];

  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 flex justify-end">
      <div className="task-details-panel bg-gray-50 shadow-lg">
        <div className="task-details-header">
          <h3 className="text-xl font-semibold text-gray-700">Task:</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <div className="task-details-content space-y-6">
          <div>
            <input
              type="text"
              value={editedTask.todo}
              onChange={(e) => setEditedTask({ ...editedTask, todo: e.target.value })}
              className="w-full p-2 text-lg focus:outline-none border-b border-gray-100 bg-transparent text-gray-800"
              placeholder="Task name"
            />
          </div>
          
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={3}
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none text-gray-600 bg-white"
              placeholder="Add description..."
            />
          </div>
          
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              List
            </label>
            <div className="relative">
              <select
                value={editedTask.list}
                onChange={(e) => setEditedTask({ ...editedTask, list: e.target.value })}
                className="w-full p-2 pr-8 border border-gray-200 rounded-md appearance-none focus:outline-none text-gray-700 bg-white"
              >
                <option value="">No List</option>
                {lists.map(list => (
                  <option key={list.id} value={list.name}>
                    {list.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Due date
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none text-gray-700 bg-white"
                placeholder="DD-MM-YY (e.g. 25-03-22)"
              />
              <div className="absolute right-2 pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="text-sm text-gray-400 mb-2">
              {editedTask.tags.length === 0 ? 'No tags assigned' : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {editedTask.tags.map((tagName, idx) => {
                const tag = tags.find(t => t.name === tagName) || { color: 'bg-gray-200' };
                return (
                  <div 
                    key={idx} 
                    className={`${tag.color} bg-opacity-20 rounded-full px-3 py-1 text-sm text-gray-700`}
                  >
                    {tagName}
                  </div>
                );
              })}
              <button className="rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-700 flex items-center">
                <span className="mr-1">+</span>
                Add Tag
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Subtasks:</h3>
            <div className="mb-4">
              <button 
                className="flex items-center text-gray-600 py-2 px-1 w-full"
                onClick={addNewSubtask}
              >
                <FiPlus className="mr-2" />
                <span>Add New Subtask</span>
              </button>
            </div>
            <div className="space-y-2">
              {editedTask.subtasksList && editedTask.subtasksList.length > 0 ? (
                editedTask.subtasksList.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={subtask.completed} 
                      onChange={() => {
                        const updatedSubtasks = [...editedTask.subtasksList];
                        updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
                        setEditedTask({ ...editedTask, subtasksList: updatedSubtasks });
                      }}
                      className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={subtask.text}
                      onChange={(e) => {
                        const updatedSubtasks = [...editedTask.subtasksList];
                        updatedSubtasks[index].text = e.target.value;
                        setEditedTask({ ...editedTask, subtasksList: updatedSubtasks });
                      }}
                      className="flex-1 p-1 border-b border-gray-100 focus:outline-none bg-transparent"
                      placeholder="Subtask"
                    />
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Subtask</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="task-details-footer bg-gray-50">
          <button
            onClick={handleDelete}
            className="py-2 px-4 text-gray-700 hover:text-red-500 font-medium"
          >
            Delete Task
          </button>
          <button
            onClick={handleSave}
            className="py-3 px-6 bg-primary text-gray-800 rounded-lg hover:bg-primary/90 font-medium"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 