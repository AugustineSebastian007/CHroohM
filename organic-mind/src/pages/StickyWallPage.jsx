import { useState } from 'react';
import { FiGrid, FiPlus } from 'react-icons/fi';

const StickyWallPage = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Social Media',
      content: '- Plan social content\n- Build content calendar\n- Plan promotion and distribution',
      color: 'bg-yellow-100',
    },
    {
      id: 2,
      title: 'Content Strategy',
      content: 'Would need time to get insights (goals, personals, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling.',
      color: 'bg-blue-100',
    },
    {
      id: 3,
      title: 'Email A/B Tests',
      content: '- Subject lines\n- Sender\n- CTA\n- Sending times',
      color: 'bg-red-100',
    },
    {
      id: 4,
      title: 'Banner Ads',
      content: 'Notes from the workshop:\n- Sizing matters\n- Choose distinctive imagery\n- The landing page must match the display ad',
      color: 'bg-orange-100',
    },
  ]);

  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: 'bg-yellow-100',
  });

  const handleAddNote = () => {
    if (newNote.title.trim() === '') return;
    
    setNotes([
      ...notes,
      {
        id: Date.now(),
        ...newNote,
      },
    ]);
    
    setNewNote({
      title: '',
      content: '',
      color: 'bg-yellow-100',
    });
    
    setShowNewNoteForm(false);
  };

  const colorOptions = [
    { value: 'bg-yellow-100', label: 'Yellow' },
    { value: 'bg-blue-100', label: 'Blue' },
    { value: 'bg-red-100', label: 'Pink' },
    { value: 'bg-orange-100', label: 'Orange' },
    { value: 'bg-gray-100', label: 'Gray' },
  ];

  return (
    <div className="w-full p-4">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800">Sticky Wall</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render existing notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`${note.color} p-6 rounded-md shadow-sm min-h-[240px] overflow-auto`}
          >
            <h3 className="font-bold text-xl mb-4">{note.title}</h3>
            <div className="whitespace-pre-line leading-relaxed">{note.content}</div>
          </div>
        ))}
        
        {/* Empty add note card */}
        <div
          onClick={() => setShowNewNoteForm(true)}
          className="bg-gray-100 p-6 rounded-md shadow-sm min-h-[240px] flex items-center justify-center cursor-pointer"
        >
          <div className="text-center">
            <FiPlus className="text-5xl text-gray-600 mx-auto" />
          </div>
        </div>
        
        {/* New note form (only shown when adding a new note) */}
        {showNewNoteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add New Note</h3>
              
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
      </div>
    </div>
  );
};

export default StickyWallPage; 