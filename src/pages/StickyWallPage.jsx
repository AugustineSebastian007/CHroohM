import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiX, FiEdit } from 'react-icons/fi';
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
    initializeNotes();
  }, []); // Empty dependency array to run only once

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
    { value: 'bg-red-100', label: 'Pink' },
    { value: 'bg-orange-100', label: 'Orange' },
    { value: 'bg-gray-100', label: 'Gray' },
  ];

  return (
    <div className="w-full p-8 flex flex-col h-full min-h-screen">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800">Sticky Wall</h1>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-white flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render existing notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              className={`${note.color} p-6 rounded-md border border-gray-200 min-h-[240px] overflow-auto relative group`}
            >
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(note)}
                  className="text-gray-500 hover:text-blue-500"
                  aria-label="Edit note"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(note.id)}
                  className="text-gray-500 hover:text-red-500"
                  aria-label="Delete note"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
              <h3 className="font-bold text-xl mb-4 pr-16">{note.title}</h3>
              <div className="whitespace-pre-line leading-relaxed text-gray-700">{note.content}</div>
            </div>
          ))}
          
          {/* Empty add note card */}
          <div
            onClick={() => setShowNewNoteForm(true)}
            className="bg-gray-200 rounded-md border border-gray-200 min-h-[240px] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
          >
            <div className="text-center">
              <FiPlus className="text-5xl text-gray-500 mx-auto" />
            </div>
          </div>
          
          {notes.length === 0 && !showNewNoteForm && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-20">
              <p className="text-gray-500 mb-4">You haven't created any notes yet.</p>
              <p className="text-gray-500">Click the "+" card to create your first note!</p>
            </div>
          )}
          
          {/* New note form (only shown when adding a new note) */}
          {showNewNoteForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Add New Note</h3>
                  <button 
                    onClick={() => setShowNewNoteForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <textarea
                  placeholder="Note Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex mb-4">
                  <span className="mr-2 text-sm text-gray-600">Color:</span>
                  <div className="flex space-x-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewNote({ ...newNote, color: color.value })}
                        className={`w-6 h-6 rounded-full ${color.value} ${
                          newNote.color === color.value ? 'ring-2 ring-gray-800' : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowNewNoteForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit note form */}
          {editingNote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Edit Note</h3>
                  <button 
                    onClick={() => setEditingNote(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder="Note Title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <textarea
                  placeholder="Note Content"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex mb-4">
                  <span className="mr-2 text-sm text-gray-600">Color:</span>
                  <div className="flex space-x-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setEditingNote({ ...editingNote, color: color.value })}
                        className={`w-6 h-6 rounded-full ${color.value} ${
                          editingNote.color === color.value ? 'ring-2 ring-gray-800' : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingNote(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateNote}
                    className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete confirmation dialog */}
          {confirmDeleteId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Delete Note</h3>
                  <button 
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteNote(confirmDeleteId)}
                    className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyWallPage; 