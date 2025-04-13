import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiX, FiEdit, FiFileText } from 'react-icons/fi';
import useStickyNotesStore from '../store/useStickyNotesStore';

const StickyWallPage = () => {
  // Get notes from Zustand store
  const notes = useStickyNotesStore(state => state.notes);
  
  // Get actions from store but don't include in dependency arrays
  const { 
    initializeNotes, 
    addNote, 
    updateNote, 
    deleteNote 
  } = useStickyNotesStore();

  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: 'bg-yellow-100',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  // Initialize notes if needed on first load
  useEffect(() => {
    // Only initialize if no notes exist
    if (notes.length === 0) {
      // Add sample notes for demo purposes
      const sampleNotes = [
        {
          id: '1',
          title: 'Social Media',
          content: '- Plan social content\n- Build content calendar\n- Plan promotion and distribution',
          color: 'bg-yellow-100'
        },
        {
          id: '2',
          title: 'Content Strategy',
          content: 'Would need time to get insights (goals, personals, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling.',
          color: 'bg-blue-100'
        },
        {
          id: '3',
          title: 'Email A/B Tests',
          content: '- Subject lines\n- Sender\n- CTA\n- Sending times',
          color: 'bg-pink-100'
        },
        {
          id: '4',
          title: 'Banner Ads',
          content: 'Notes from the workshop:\n- Sizing matters\n- Choose distinctive imagery\n- The landing page must match the display ad',
          color: 'bg-orange-100'
        }
      ];
      
      // Add sample notes one by one to ensure correct IDs
      sampleNotes.forEach(note => {
        addNote(note);
      });
    }
  }, [notes.length, addNote]);

  const handleAddNote = () => {
    if (newNote.title.trim() === '') return;
    
    addNote(newNote);
    
    setNewNote({
      title: '',
      content: '',
      color: 'bg-yellow-100',
    });
    
    setShowNewNoteForm(false);
  };

  const handleDeleteNote = (id) => {
    deleteNote(id);
    setConfirmDeleteId(null);
  };

  const handleEditClick = (note) => {
    setEditingNote({...note});
  };

  const handleUpdateNote = () => {
    if (editingNote.title.trim() === '') return;
    
    updateNote(editingNote.id, editingNote);
    setEditingNote(null);
  };

  const colorOptions = [
    { value: 'bg-yellow-100', label: 'Yellow' },
    { value: 'bg-blue-100', label: 'Blue' },
    { value: 'bg-pink-100', label: 'Pink' },
    { value: 'bg-orange-100', label: 'Orange' },
    { value: 'bg-gray-100', label: 'Gray' },
    { value: 'bg-green-100', label: 'Green' },
    { value: 'bg-purple-100', label: 'Purple' },
  ];

  return (
    <div className="p-8 flex flex-col h-[calc(100vh-64px)]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Sticky Wall</h1>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full auto-rows-fr">
          {/* Render existing notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              className={`${note.color} p-6 rounded-lg border border-gray-200 shadow-sm overflow-auto relative group transition-all hover:shadow-md flex flex-col`}
            >
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(note)}
                  className="p-1.5 bg-white bg-opacity-80 rounded-full text-gray-600 hover:text-blue-500 hover:bg-opacity-100 transition-colors"
                  aria-label="Edit note"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(note.id)}
                  className="p-1.5 bg-white bg-opacity-80 rounded-full text-gray-600 hover:text-red-500 hover:bg-opacity-100 transition-colors"
                  aria-label="Delete note"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-bold text-lg mb-4">{note.title}</h3>
              <div className="whitespace-pre-line leading-relaxed text-gray-700 flex-grow">{note.content}</div>
            </div>
          ))}
          
          {/* Add note button */}
          <div
            onClick={() => setShowNewNoteForm(true)}
            className="bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="text-4xl text-gray-400">+</div>
          </div>
        </div>
      </div>
          
      {/* New note form (only shown when adding a new note) */}
      {showNewNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Note</h3>
              <button 
                onClick={() => setShowNewNoteForm(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="note-title"
                  type="text"
                  placeholder="Enter a title for your note"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  id="note-content"
                  placeholder="Write your note..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewNote({ ...newNote, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} ${
                        newNote.color === color.value ? 'ring-2 ring-gray-800 ring-offset-2' : 'hover:ring-1 hover:ring-gray-400'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewNoteForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.title.trim()}
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors ${!newNote.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit note form */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Note</h3>
              <button 
                onClick={() => setEditingNote(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-note-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="edit-note-title"
                  type="text"
                  placeholder="Enter a title for your note"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="edit-note-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  id="edit-note-content"
                  placeholder="Write your note..."
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditingNote({ ...editingNote, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} ${
                        editingNote.color === color.value ? 'ring-2 ring-gray-800 ring-offset-2' : 'hover:ring-1 hover:ring-gray-400'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                disabled={!editingNote.title.trim()}
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors ${!editingNote.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Note</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyWallPage; 