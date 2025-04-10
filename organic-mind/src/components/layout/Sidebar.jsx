import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiChevronRight,
  FiList, 
  FiGrid, 
  FiSettings,
  FiSearch,
  FiPlusCircle,
  FiLogOut,
  FiRefreshCw,
  FiMoreVertical,
  FiTrash2,
  FiEdit,
  FiX,
  FiCheck
} from 'react-icons/fi';
import useTaskStore from '../../store/useTaskStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storeLists = useTaskStore(state => state.lists);
  const addList = useTaskStore(state => state.addList);
  const updateList = useTaskStore(state => state.updateList);
  const deleteList = useTaskStore(state => state.deleteList);
  const tasks = useTaskStore(state => state.tasks);
  const resetTasks = useTaskStore(state => state.resetTasks);
  const getTodayTasks = useTaskStore(state => state.getTodayTasks);
  const getUpcomingTasks = useTaskStore(state => state.getUpcomingTasks);
  
  // State for new list input
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  // State for list options
  const [activeListOptions, setActiveListOptions] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [editingColor, setEditingColor] = useState('');
  
  const [tags, setTags] = useState([
    { id: 1, name: 'Tag 1', color: 'bg-accent1' },
    { id: 2, name: 'Tag 2', color: 'bg-secondary' },
  ]);

  // Available colors for lists
  const listColors = [
    { name: 'Primary', value: 'bg-primary' },
    { name: 'Secondary', value: 'bg-secondary' },
    { name: 'Accent 1', value: 'bg-accent1' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
  ];

  const isActive = (path) => location.pathname === path;
  
  // Get task counts
  const todayTasksCount = getTodayTasks().length + tasks.filter(task => !task.dueDate).length;
  const upcomingTasksCount = getUpcomingTasks().length;
  
  // Count tasks per list
  const getListTaskCount = (listName) => {
    return tasks.filter(task => task.list === listName).length;
  };
  
  // Handle creating a new list
  const handleAddList = () => {
    if (newListName.trim()) {
      // Add new list
      addList({
        name: newListName.trim(),
        color: 'bg-primary' // Default color
      });
      
      // Reset input
      setNewListName('');
      setIsAddingList(false);
    }
  };
  
  // Handle deleting a list
  const handleDeleteList = (listId) => {
    if (window.confirm('Are you sure you want to delete this list? Tasks in this list will be removed from it.')) {
      deleteList(listId);
      setActiveListOptions(null);
    }
  };
  
  // Handle editing the color of a list
  const handleEditColor = (listId) => {
    const list = storeLists.find(l => l.id === listId);
    if (list) {
      setEditingListId(listId);
      setEditingColor(list.color);
    }
  };
  
  // Handle saving the edited list color
  const handleSaveColor = () => {
    if (editingListId && editingColor) {
      updateList(editingListId, { color: editingColor });
      setEditingListId(null);
      setEditingColor('');
      setActiveListOptions(null);
    }
  };
  
  // Toggle list options menu
  const toggleListOptions = (listId) => {
    setActiveListOptions(activeListOptions === listId ? null : listId);
    setEditingListId(null);
  };

  return (
    <div className="h-full bg-gray-50 w-72 border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Menu</h1>
        <button className="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border-none text-sm"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="uppercase text-xs font-semibold text-gray-500 mb-2">Tasks</h2>
        <ul>
          <li>
            <Link to="/upcoming" className={`flex items-center py-2 px-1 ${isActive('/upcoming') ? 'bg-gray-200 rounded' : ''}`}>
              <FiChevronRight className="text-base mr-2" />
              <span className="text-gray-800">Upcoming</span>
              {upcomingTasksCount > 0 && (
                <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">{upcomingTasksCount}</span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/" className={`flex items-center py-2 px-1 ${isActive('/') ? 'bg-gray-200 rounded' : ''}`}>
              <FiList className="text-base mr-2" />
              <span className="text-gray-800">Today</span>
              {todayTasksCount > 0 && (
                <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">{todayTasksCount}</span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/calendar" className={`flex items-center py-2 px-1 ${isActive('/calendar') ? 'bg-gray-200 rounded' : ''}`}>
              <FiCalendar className="text-base mr-2" />
              <span className="text-gray-800">Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/sticky-wall" className={`flex items-center py-2 px-1 ${isActive('/sticky-wall') ? 'bg-gray-200 rounded' : ''}`}>
              <FiGrid className="text-base mr-2" />
              <span className="text-gray-800">Sticky Wall</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="uppercase text-xs font-semibold text-gray-500 mb-2">Lists</h2>
        <ul>
          {storeLists.map(list => (
            <li key={list.id} className="relative">
              {editingListId === list.id ? (
                <div className="py-2 px-1">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <span className={`w-4 h-4 mr-2 ${list.color}`}></span>
                      <span className="text-gray-800">{list.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {listColors.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setEditingColor(color.value)}
                          className={`w-6 h-6 rounded-full ${color.value} ${editingColor === color.value ? 'ring-2 ring-blue-400' : ''}`}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingListId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX />
                      </button>
                      <button 
                        onClick={handleSaveColor}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiCheck />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link to={`/list/${list.id}`} className={`flex items-center py-2 px-1 ${location.pathname === `/list/${list.id}` ? 'bg-gray-200 rounded' : ''}`}>
                    <span className={`w-4 h-4 mr-2 ${list.color}`}></span>
                    <span className="text-gray-800">{list.name}</span>
                    <span className="ml-auto bg-gray-200 px-2 rounded-full text-xs">{getListTaskCount(list.name)}</span>
                    <button 
                      className="ml-1 text-gray-400 hover:text-gray-600 p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleListOptions(list.id);
                      }}
                    >
                      <FiMoreVertical size={14} />
                    </button>
                  </Link>
                  
                  {activeListOptions === list.id && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow-md z-10 w-32">
                      <button 
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleEditColor(list.id)}
                      >
                        <FiEdit className="mr-2" size={14} />
                        Edit Color
                      </button>
                      <button 
                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleDeleteList(list.id)}
                      >
                        <FiTrash2 className="mr-2" size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
          
          {isAddingList ? (
            <li className="py-2 px-1">
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2 bg-primary"></span>
                <input
                  type="text"
                  className="flex-1 py-1 px-2 text-sm border border-gray-300 rounded"
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddList();
                  }}
                />
                <button 
                  className="ml-2 text-gray-600 hover:text-gray-800"
                  onClick={handleAddList}
                >
                  Add
                </button>
              </div>
            </li>
          ) : (
            <li>
              <button 
                className="flex items-center py-2 px-1 text-gray-800 w-full"
                onClick={() => setIsAddingList(true)}
              >
                <FiPlusCircle className="text-base mr-2" />
                <span>Add New List</span>
              </button>
            </li>
          )}
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="uppercase text-xs font-semibold text-gray-500 mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag.id} className={`${tag.color} bg-opacity-20 px-3 py-1 rounded-full text-sm text-gray-700`}>
              {tag.name}
            </span>
          ))}
          <button className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center">
            <span className="mr-1">+</span>
            Add Tag
          </button>
        </div>
      </div>
      
      <div className="mt-auto">
        <button 
          className="flex items-center py-2 px-1 text-gray-800 w-full"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all tasks? This cannot be undone.')) {
              resetTasks();
            }
          }}
        >
          <FiRefreshCw className="text-base mr-2" />
          <span>Reset Tasks</span>
        </button>
        <button className="flex items-center py-2 px-1 text-gray-800 w-full">
          <FiSettings className="text-base mr-2" />
          <span>Settings</span>
        </button>
        <button 
          className="flex items-center py-2 px-1 text-gray-800 w-full"
          onClick={() => navigate('/sign-out')}
        >
          <FiLogOut className="text-base mr-2" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 