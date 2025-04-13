import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Empty default notes array
const defaultNotes = [];

const useStickyNotesStore = create(
  persist(
    (set, get) => ({
      notes: [],
      loading: false,
      error: null,
      
      // Initialize notes - no longer adds default notes
      initializeNotes: () => {
        // No longer adds default notes, this function mostly exists
        // for compatibility with existing code
        const currentNotes = get().notes;
        if (!currentNotes) {
          set({ notes: [] });
        }
      },
      
      // Add a new note
      addNote: (note) => {
        set((state) => ({ 
          notes: [
            ...state.notes, 
            {
              ...note,
              id: Date.now(),
            }
          ]
        }));
      },
      
      // Update a note
      updateNote: (noteId, updatedNote) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === noteId ? { ...note, ...updatedNote } : note
          )
        }));
      },
      
      // Delete a note
      deleteNote: (noteId) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId)
        }));
      },
      
      // Get all notes
      getNotes: () => {
        return get().notes;
      },
    }),
    {
      name: 'organic-mind-sticky-notes',
      getStorage: () => localStorage,
    }
  )
);

export default useStickyNotesStore; 