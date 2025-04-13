import { useState, useEffect } from 'react';
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
  FiCheck,
  FiMenu,
  FiArrowLeft,
  FiTag
} from 'react-icons/fi';
import useTaskStore from '../../store/useTaskStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storeLists = useTaskStore(state => state.lists);
  const addList = useTaskStore(state => state.addList);
  const updateList = useTaskStore(state => state.updateList);
  const deleteList = useTaskStore(state => state.deleteList);
  const storeTags = useTaskStore(state => state.tags);
  const addTag = useTaskStore(state => state.addTag);
  const updateTag = useTaskStore(state => state.updateTag);
  const deleteTag = useTaskStore(state => state.deleteTag);
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
  
  // State for new tag input
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  // State for tag options
  const [activeTagOptions, setActiveTagOptions] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagColor, setEditingTagColor] = useState('');
  const [editingTagName, setEditingTagName] = useState('');

  // Add state for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Available colors for lists and tags
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
  const upcomingTasksCount = getTodayTasks().length + getUpcomingTasks().length;
  
  // Count tasks per list
  const getListTaskCount = (listName) => {
    return tasks.filter(task => task.list === listName).length;
  };
  
  // Count tasks per tag
  const getTagTaskCount = (tagName) => {
    return tasks.filter(task => task.tags && task.tags.includes(tagName)).length;
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

  // Handle creating a new tag
  const handleAddTag = () => {
    if (newTagName.trim()) {
      // Add new tag
      addTag({
        name: newTagName.trim(),
        color: 'bg-accent1' // Default color
      });
      
      // Reset input
      setNewTagName('');
      setIsAddingTag(false);
    }
  };
  
  // Handle deleting a tag
  const handleDeleteTag = (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag? It will be removed from all tasks.')) {
      deleteTag(tagId);
      setActiveTagOptions(null);
    }
  };
  
  // Handle editing a tag
  const handleEditTag = (tagId) => {
    const tag = storeTags.find(t => t.id === tagId);
    if (tag) {
      setEditingTagId(tagId);
      setEditingTagColor(tag.color);
      setEditingTagName(tag.name);
    }
  };
  
  // Handle saving the edited tag
  const handleSaveTag = () => {
    if (editingTagId && editingTagName.trim()) {
      updateTag(editingTagId, { 
        name: editingTagName.trim(),
        color: editingTagColor 
      });
      
      setEditingTagId(null);
      setEditingTagColor('');
      setEditingTagName('');
      setActiveTagOptions(null);
    }
  };
  
  // Toggle tag options menu
  const toggleTagOptions = (tagId) => {
    setActiveTagOptions(activeTagOptions === tagId ? null : tagId);
    setEditingTagId(null);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Update main content area when sidebar state changes
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (isSidebarOpen) {
        mainContent.classList.add('sidebar-open');
        mainContent.classList.remove('sidebar-closed');
      } else {
        mainContent.classList.add('sidebar-closed');
        mainContent.classList.remove('sidebar-open');
      }
    }
  }, [isSidebarOpen]);

  return (
    <>
      {/* Toggle button for mobile/collapsed view */}
      {!isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="sidebar-toggle-button"
          aria-label="Open sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      )}

      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-inner">
          <div className="h-full bg-gray-50 w-72 border-r-0 p-4 flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">Menu</h1>
              <button 
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close sidebar"
              >
                <FiArrowLeft className="h-6 w-6" />
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
                      <span className="w-4 h-4 mr-2 bg-primary rounded-sm"></span>
                      <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent">
                        <input
                          type="text"
                          className="flex-1 py-1.5 px-3 text-sm border-none outline-none"
                          placeholder="List name"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          autoFocus
                          onBlur={(e) => {
                            // Check if the relatedTarget is the Add button
                            // Only collapse if clicking outside both input and Add button
                            const isClickingAddButton = e.relatedTarget && 
                              e.relatedTarget.classList.contains('add-list-button');
                            
                            if (!isClickingAddButton) {
                              // Allow time for button click to process if needed
                              setTimeout(() => {
                                if (newListName.trim() === '') {
                                  setIsAddingList(false);
                                }
                              }, 100);
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleAddList();
                          }}
                        />
                        <button 
                          className="add-list-button bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm transition-colors"
                          onClick={handleAddList}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li>
                    <button 
                      className="flex items-center py-2 px-1 text-gray-800 w-full hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setIsAddingList(true)}
                    >
                      <FiPlusCircle className="text-base mr-2" />
                      <span>Add New List</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="mb-4">
              <h2 className="uppercase text-xs font-semibold text-gray-500 mb-1">Tags</h2>
              <div className="flex flex-wrap gap-1 mb-1">
                {storeTags.map(tag => (
                  <div key={tag.id} className="relative">
                    {editingTagId === tag.id ? (
                      <div className="p-1.5 bg-white border border-gray-200 rounded shadow-md z-10">
                        <div className="flex flex-col">
                          <input
                            type="text"
                            className="w-full p-1 mb-1.5 border border-gray-200 rounded text-sm"
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            placeholder="Tag name"
                            autoFocus
                          />
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {listColors.map(color => (
                              <button
                                key={color.value}
                                onClick={() => setEditingTagColor(color.value)}
                                className={`w-5 h-5 rounded-full ${color.value} ${editingTagColor === color.value ? 'ring-1 ring-blue-400' : ''}`}
                                aria-label={`Select ${color.name} color`}
                              />
                            ))}
                          </div>
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => setEditingTagId(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <FiX size={12} />
                            </button>
                            <button 
                              onClick={handleSaveTag}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FiCheck size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="inline-block relative">
                        <Link 
                          to={`/tag/${tag.id}`} 
                          className={`${tag.color} bg-opacity-20 hover:bg-opacity-30 px-2 py-0.5 rounded-full text-xs text-gray-700 flex items-center gap-1 group`}
                        >
                          <FiTag size={10} />
                          {tag.name}
                          {getTagTaskCount(tag.name) > 0 && (
                            <span className="bg-gray-200 px-1 rounded-full text-xs">{getTagTaskCount(tag.name)}</span>
                          )}
                          <button 
                            className="ml-0.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleTagOptions(tag.id);
                            }}
                          >
                            <FiMoreVertical size={10} />
                          </button>
                        </Link>
                        
                        {activeTagOptions === tag.id && (
                          <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded shadow-md z-10 w-28">
                            <button 
                              className="flex items-center px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleEditTag(tag.id)}
                            >
                              <FiEdit className="mr-1" size={10} />
                              Edit Tag
                            </button>
                            <button 
                              className="flex items-center px-2 py-1 text-xs text-red-600 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <FiTrash2 className="mr-1" size={10} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {isAddingTag ? (
                  <div className="w-full">
                    <div className="relative flex items-center bg-white rounded-full border border-blue-300 overflow-hidden shadow-sm">
                      <div className="absolute left-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                      <input
                        type="text"
                        className="flex-1 py-1 pl-7 pr-8 text-xs border-none outline-none bg-transparent text-gray-800"
                        placeholder="Tag name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        autoFocus
                        onBlur={(e) => {
                          const isClickingAddButton = e.relatedTarget && 
                            e.relatedTarget.classList.contains('add-tag-button');
                          
                          if (!isClickingAddButton) {
                            setTimeout(() => {
                              if (newTagName.trim() === '') {
                                setIsAddingTag(false);
                              }
                            }, 100);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddTag();
                        }}
                      />
                      <button 
                        className="add-tag-button absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                        onClick={handleAddTag}
                      >
                        <FiCheck size={10} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs flex items-center hover:bg-gray-200"
                    onClick={() => setIsAddingTag(true)}
                  >
                    <span className="mr-0.5">+</span>
                    Add Tag
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-auto">
              <Link 
                to="/settings" 
                className={`flex items-center py-2 px-1 text-gray-800 w-full ${isActive('/settings') ? 'bg-gray-200 rounded' : ''}`}
              >
                <FiSettings className="text-base mr-2" />
                <span>Settings</span>
              </Link>
              <button 
                className="flex items-center py-2 px-1 text-gray-800 w-full"
                onClick={() => navigate('/sign-out')}
              >
                <FiLogOut className="text-base mr-2" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 