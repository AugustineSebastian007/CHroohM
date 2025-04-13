import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { FiX, FiTrash2, FiCalendar, FiClock, FiTag, FiPlus, FiChevronDown, FiCheck } from 'react-icons/fi';
import useTaskStore from '../../store/useTaskStore';

const TaskDetails = ({ taskId, onClose }) => {
  const tasks = useTaskStore(state => state.tasks);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const addTask = useTaskStore(state => state.addTask);
  const storeTags = useTaskStore(state => state.tags);
  const addTag = useTaskStore(state => state.addTag);
  
  const [task, setTask] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(taskId === null);
  const [editedTask, setEditedTask] = useState({
    todo: '',
    description: '',
    dueDate: '',
    dueTime: '',
    list: 'Personal',
    tags: [],
    subtasks: 0,
    subtasksList: [],
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState('bg-accent1');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const calendarRef = useRef(null);
  const timePickerRef = useRef(null);
  const tagSelectorRef = useRef(null);
  
  // Available colors for tags
  const tagColors = [
    { name: 'Primary', value: 'bg-primary' },
    { name: 'Secondary', value: 'bg-secondary' },
    { name: 'Accent 1', value: 'bg-accent1' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
  ];
  
  // Add a class to the main content container to shrink it when details panel is open
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('details-panel-open');
    }
    
    // Set panel open with a slight delay for animation
    setTimeout(() => {
      setIsPanelOpen(true);
    }, 10);
    
    return () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.classList.remove('details-panel-open');
      }
    };
  }, []);
  
  useEffect(() => {
    if (taskId === null) {
      // Creating a new task
      setIsNewTask(true);
      setTask({
        todo: '',
        description: '',
        dueDate: '',
        dueTime: '',
        list: 'Personal',
        tags: [],
        subtasks: 0,
        subtasksList: [],
      });
      // Default date to today (formatted as DD-MM-YY)
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = String(today.getFullYear()).slice(-2);
      setEditedTask({
        todo: '',
        description: '',
        dueDate: `${day}-${month}-${year}`,
        dueTime: '',
        list: 'Personal',
        tags: [],
        subtasks: 0,
        subtasksList: [],
      });
    } else {
      // Editing an existing task
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        // Extract date and time from combined dueDate if available
        let dueDate = '';
        let dueTime = '';
        
        if (foundTask.dueDate) {
          // Check if the dueDate contains time information (has a T separator)
          if (foundTask.dueDate.includes('T')) {
            const [datePart, timePart] = foundTask.dueDate.split('T');
            dueDate = datePart;
            dueTime = timePart;
          } else {
            dueDate = foundTask.dueDate;
          }
        }
        
        setTask(foundTask);
        setEditedTask({
          todo: foundTask.todo,
          description: foundTask.description || '',
          dueDate: dueDate,
          dueTime: dueTime || foundTask.dueTime || '',
          list: foundTask.list || 'Personal',
          tags: foundTask.tags || [],
          subtasks: foundTask.subtasks || 0,
          subtasksList: foundTask.subtasksList || [],
        });
      }
    }
  }, [taskId, tasks]);
  
  // Close calendar, time picker, and tag selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
      if (tagSelectorRef.current && !tagSelectorRef.current.contains(event.target)) {
        setShowTagSelector(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!task && !isNewTask) {
    return null;
  }
  
  const handleSave = () => {
    // Validate date format if entered (should be DD-MM-YY)
    if (editedTask.dueDate && !/^\d{2}-\d{2}-\d{2}$/.test(editedTask.dueDate)) {
      alert('Please enter date in DD-MM-YY format');
      return;
    }
    
    // Create a combined date-time value if both are present
    let combinedDueDate = editedTask.dueDate;
    if (editedTask.dueDate && editedTask.dueTime) {
      // We keep the displayed format as DD-MM-YY but store the time information
      // in a way that can be used by the calendar
      combinedDueDate = `${editedTask.dueDate}T${editedTask.dueTime}`;
    }
    
    // Update subtasks count and save the task with combined date-time
    const updatedTask = {
      ...editedTask,
      dueDate: combinedDueDate,
      subtasks: editedTask.subtasksList.length,
    };
    
    if (isNewTask) {
      // Add new task
      addTask(updatedTask);
    } else {
      // Update existing task
      updateTask(taskId, updatedTask);
    }
    
    handleClose();
  };
  
  const handleClose = () => {
    // First animate the panel closing
    setIsPanelOpen(false);
    
    // Remove the class from main content right away to animate it back
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.remove('details-panel-open');
    }
    
    // Then wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  const handleDelete = () => {
    deleteTask(taskId);
    handleClose();
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

  // Handle creating a new tag
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      // Create the new tag
      const newTag = {
        name: newTagName.trim(),
        color: selectedTagColor
      };
      
      addTag(newTag);
      
      // Add the tag to the task
      const updatedTags = [...editedTask.tags, newTagName.trim()];
      setEditedTask({
        ...editedTask,
        tags: updatedTags
      });
      
      // Reset the input
      setNewTagName('');
      setSelectedTagColor('bg-accent1');
    }
  };

  // Toggle tag selection
  const toggleTag = (tagName) => {
    const newTags = [...editedTask.tags];
    const tagIndex = newTags.indexOf(tagName);
    
    if (tagIndex === -1) {
      // Add tag
      newTags.push(tagName);
    } else {
      // Remove tag
      newTags.splice(tagIndex, 1);
    }
    
    setEditedTask({
      ...editedTask,
      tags: newTags
    });
  };
  
  const lists = [
    { id: 'personal', name: 'Personal', color: 'bg-secondary' },
    { id: 'work', name: 'Work', color: 'bg-accent1' },
    { id: 'list1', name: 'List 1', color: 'bg-primary' },
  ];

  // Format date for display (DD-MM-YY)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : format(date, 'dd-MM-yy');
  };
  
  // Handle date selection from calendar
  const handleDateSelect = (dateString) => {
    setEditedTask({ ...editedTask, dueDate: formatDate(dateString) });
    setShowCalendar(false);
  };
  
  // Handle time selection
  const handleTimeSelect = (timeString) => {
    setEditedTask({ ...editedTask, dueTime: timeString });
    setShowTimePicker(false);
  };
  
  // Generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const formattedHour = hour.toString().padStart(2, '0');
    return `${formattedHour}:${minute}`;
  });

  return (
    <div className={`task-details-panel-wrapper ${isPanelOpen ? 'open' : ''}`}>
      <div className="task-details-panel shadow-lg h-full">
        <div className="task-details-header">
          <h3 className="text-lg font-medium text-gray-700">{isNewTask ? 'New Event:' : 'Task:'}</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <div className="task-details-content space-y-8">
          <div>
            <input
              type="text"
              value={editedTask.todo}
              onChange={(e) => setEditedTask({ ...editedTask, todo: e.target.value })}
              className="w-full p-2 text-lg focus:outline-none bg-transparent text-gray-800 font-medium"
              placeholder="Task name"
            />
          </div>
          
          <div>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={5}
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none text-gray-600 bg-gray-100"
              placeholder="Description"
            />
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 items-center">
            <label className="text-gray-600">
              List
            </label>
            <div className="relative">
              <select
                value={editedTask.list}
                onChange={(e) => setEditedTask({ ...editedTask, list: e.target.value })}
                className="w-full p-2 pr-8 border border-gray-200 rounded-md appearance-none focus:outline-none text-gray-700 bg-gray-100"
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
            
            <label className="text-gray-600">
              Due date
            </label>
            <div className="date-time-container">
              <div className="relative">
                <input
                  type="text"
                  value={editedTask.dueDate}
                  onClick={() => setShowCalendar(true)}
                  readOnly
                  className="date-picker"
                  placeholder="DD-MM-YY"
                />
                {showCalendar && (
                  <div className="calendar-popup" ref={calendarRef}>
                    {/* Simple calendar UI - in a real app you'd use a proper calendar component */}
                    <div className="flex justify-between mb-2">
                      <button className="text-gray-500">&lt;</button>
                      <div>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                      <button className="text-gray-500">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {['Mo','Tu','We','Th','Fr','Sa','Su'].map(day => (
                        <div key={day} className="text-xs font-medium text-gray-500">{day}</div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => (
                        <button 
                          key={i+1} 
                          className="w-8 h-8 rounded-full hover:bg-gray-100"
                          onClick={() => {
                            const today = new Date();
                            const selected = new Date(today.getFullYear(), today.getMonth(), i+1);
                            handleDateSelect(selected);
                          }}
                        >
                          {i+1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={editedTask.dueTime}
                  onClick={() => setShowTimePicker(true)}
                  readOnly
                  className="time-picker"
                  placeholder="Time"
                />
                {showTimePicker && (
                  <div className="time-dropdown" ref={timePickerRef}>
                    {timeOptions.map(time => (
                      <div 
                        key={time} 
                        onClick={() => handleTimeSelect(time)}
                        className="hover:bg-gray-100 cursor-pointer px-3 py-1"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <label className="text-gray-600">
              Tags
            </label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 items-center">
                {editedTask.tags && editedTask.tags.length > 0 ? (
                  editedTask.tags.map((tagName, index) => {
                    const tag = storeTags.find(t => t.name === tagName);
                    return (
                      <div 
                        key={index} 
                        className={`${tag ? tag.color : 'bg-gray-200'} bg-opacity-20 rounded-full px-3 py-1 text-sm text-gray-700 flex items-center gap-1`}
                      >
                        <FiTag size={12} />
                        {tagName}
                        <button 
                          onClick={() => toggleTag(tagName)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-500">No tags</span>
                )}
                <button 
                  className="flex items-center text-sm text-gray-500 px-2 hover:text-gray-700"
                  onClick={() => setShowTagSelector(true)}
                >
                  <span className="mr-1">+</span>
                  Add Tag
                </button>
                
                {showTagSelector && (
                  <div 
                    className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-md w-72 max-h-72 overflow-auto p-3"
                    ref={tagSelectorRef}
                  >
                    <div className="mb-3 border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Select a tag:</h4>
                      <div className="flex flex-wrap gap-2">
                        {storeTags.map(tag => (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.name)}
                            className={`${tag.color} ${
                              editedTask.tags.includes(tag.name) 
                                ? 'bg-opacity-100 text-white' 
                                : 'bg-opacity-20 text-gray-700 hover:bg-opacity-30'
                            } rounded-full px-3 py-1 text-sm flex items-center gap-1 transition-colors`}
                          >
                            {editedTask.tags.includes(tag.name) && (
                              <FiCheck size={12} className="mr-1" />
                            )}
                            <FiTag size={12} />
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-2 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-600">Create new tag:</div>
                        <button 
                          onClick={() => setShowTagSelector(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                      
                      <div className="relative flex items-center bg-white rounded-full border border-blue-300 overflow-hidden shadow-sm mb-2">
                        <div className="absolute left-3">
                          <div className={`w-4 h-4 ${selectedTagColor} rounded-full`}></div>
                        </div>
                        <input
                          type="text"
                          className="flex-1 py-2 pl-10 pr-10 text-sm border-none outline-none bg-transparent text-gray-800"
                          placeholder="Tag name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newTagName.trim()) handleCreateTag();
                          }}
                        />
                        <button 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          onClick={handleCreateTag}
                          disabled={!newTagName.trim()}
                        >
                          <FiCheck size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-full py-1.5 px-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center"
                      >
                        <span className="flex items-center">
                          <span className={`inline-block w-4 h-4 ${selectedTagColor} rounded-full mr-2`}></span>
                          Select color
                        </span>
                        <FiChevronDown size={16} />
                      </button>
                      
                      {showColorPicker && (
                        <div className="mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tagColors.map(color => (
                              <button 
                                key={color.value}
                                onClick={() => {
                                  setSelectedTagColor(color.value);
                                  setShowColorPicker(false);
                                }}
                                className={`w-7 h-7 rounded-full ${color.value} cursor-pointer hover:opacity-80 transition-opacity ${selectedTagColor === color.value ? 'ring-2 ring-blue-400' : ''}`}
                                aria-label={`Select ${color.name} color`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Subtasks:</h3>
            <div className="mb-4">
              <button 
                className="flex items-center text-sm text-gray-600 py-1"
                onClick={addNewSubtask}
              >
                <FiPlus className="mr-2" />
                <span>Add New Subtask</span>
              </button>
            </div>
            <div className="space-y-3">
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
        
        <div className="task-details-footer">
          {!isNewTask && (
            <button
              onClick={handleDelete}
              className="py-2 px-4 text-gray-700 hover:text-red-500 font-medium"
            >
              Delete Task
            </button>
          )}
          {isNewTask && (
            <div></div> // Empty div to maintain flex spacing
          )}
          <button
            onClick={handleSave}
            className="py-2 px-6 bg-yellow-400 text-yellow-900 rounded-md hover:bg-yellow-300 font-medium"
          >
            {isNewTask ? 'Add Event' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 