import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Empty initial data
const mockTasks = [];

// Lists data
const mockLists = [
  { id: 1, name: 'Personal', color: 'bg-secondary' },
  { id: 2, name: 'Work', color: 'bg-accent1' },
];

// Tags data
const mockTags = [
  { id: 1, name: 'Tag 1', color: 'bg-accent1' },
  { id: 2, name: 'Tag 2', color: 'bg-secondary' },
];

const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      lists: mockLists,
      tags: mockTags,
      loading: false,
      error: null,
      
      // Fetch tasks from API
      fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
          // For now, just use the mock data
          setTimeout(() => {
            set({ loading: false }); // Just toggle loading state for simulation
          }, 500);
          
          // Comment out actual API call for now
          /*
          const response = await fetch('https://dummyjson.com/todos');
          if (!response.ok) throw new Error('Failed to fetch tasks');
          
          const data = await response.json();
          set({ tasks: data.todos || [], loading: false });
          */
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error fetching tasks:', error);
        }
      },
      
      // Add a new task
      addTask: async (task) => {
        set({ loading: true, error: null });
        try {
          // For demo, add task directly to state with a generated ID
          const newTask = {
            ...task,
            id: Math.max(0, ...get().tasks.map(t => t.id)) + 1
          };
          
          set((state) => ({ 
            tasks: [...state.tasks, newTask],
            loading: false 
          }));
          
          return newTask;
          
          // Commented out API call for demo purposes
          /*
          const response = await fetch('https://dummyjson.com/todos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
          });
          
          if (!response.ok) throw new Error('Failed to add task');
          
          const newTask = await response.json();
          set((state) => ({ 
            tasks: [...state.tasks, newTask],
            loading: false 
          }));
          
          return newTask;
          */
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error adding task:', error);
        }
      },
      
      // Update a task
      updateTask: async (taskId, updatedTask) => {
        set({ loading: true, error: null });
        try {
          // For demo, update task directly in state
          set((state) => ({
            tasks: state.tasks.map((task) => 
              task.id === taskId ? { ...task, ...updatedTask } : task
            ),
            loading: false,
          }));
          
          // Return the updated task for chaining
          return get().tasks.find(t => t.id === taskId);
          
          // Commented out API call for demo purposes
          /*
          const response = await fetch(`https://dummyjson.com/todos/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
          });
          
          if (!response.ok) throw new Error('Failed to update task');
          
          const updated = await response.json();
          set((state) => ({
            tasks: state.tasks.map((task) => 
              task.id === taskId ? { ...task, ...updated } : task
            ),
            loading: false,
          }));
          
          return updated;
          */
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error updating task:', error);
        }
      },
      
      // Set reminder for a task
      setTaskReminder: async (taskId, reminderTime) => {
        return get().updateTask(taskId, { reminderTime });
      },
      
      // Remove reminder from a task
      removeTaskReminder: async (taskId) => {
        return get().updateTask(taskId, { reminderTime: null });
      },
      
      // Toggle task completion status
      toggleTaskComplete: async (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        
        return get().updateTask(taskId, { completed: !task.completed });
      },
      
      // Delete a task
      deleteTask: async (taskId) => {
        set({ loading: true, error: null });
        try {
          // For demo, delete task directly from state
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            loading: false,
          }));
          
          // Commented out API call for demo purposes
          /*
          const response = await fetch(`https://dummyjson.com/todos/${taskId}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) throw new Error('Failed to delete task');
          
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            loading: false,
          }));
          */
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error deleting task:', error);
        }
      },
      
      // Filter tasks by status
      filterTasks: (filter = 'all') => {
        const tasks = get().tasks;
        switch (filter) {
          case 'completed':
            return tasks.filter((task) => task.completed);
          case 'active':
            return tasks.filter((task) => !task.completed);
          default:
            return tasks;
        }
      },

      // Get all lists
      getLists: () => {
        return get().lists;
      },
      
      // Add a new list
      addList: (list) => {
        set((state) => {
          const newList = {
            ...list,
            id: Math.max(0, ...state.lists.map(l => l.id)) + 1
          };
          
          return { lists: [...state.lists, newList] };
        });
      },
      
      // Update a list
      updateList: (listId, updatedList) => {
        set((state) => ({
          lists: state.lists.map((list) => 
            list.id === listId ? { ...list, ...updatedList } : list
          )
        }));
      },
      
      // Delete a list
      deleteList: (listId) => {
        const listName = get().lists.find(l => l.id === listId)?.name;
        
        // First update any tasks that are in this list
        if (listName) {
          set((state) => ({
            tasks: state.tasks.map(task => 
              task.list === listName ? { ...task, list: '' } : task
            )
          }));
        }
        
        // Then remove the list
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId)
        }));
      },
      
      // Get tasks by list
      getTasksByList: (listName) => {
        return get().tasks.filter(task => task.list === listName);
      },
      
      // Get all tags
      getTags: () => {
        return get().tags;
      },
      
      // Add a new tag
      addTag: (tag) => {
        set((state) => {
          const newTag = {
            ...tag,
            id: Math.max(0, ...state.tags.map(t => t.id)) + 1
          };
          
          return { tags: [...state.tags, newTag] };
        });
      },
      
      // Update a tag
      updateTag: (tagId, updatedTag) => {
        set((state) => ({
          tags: state.tags.map((tag) => 
            tag.id === tagId ? { ...tag, ...updatedTag } : tag
          )
        }));
      },
      
      // Delete a tag
      deleteTag: (tagId) => {
        const tagName = get().tags.find(t => t.id === tagId)?.name;
        
        // First update any tasks that have this tag
        if (tagName) {
          set((state) => ({
            tasks: state.tasks.map(task => {
              if (task.tags && task.tags.includes(tagName)) {
                return {
                  ...task,
                  tags: task.tags.filter(t => t !== tagName)
                };
              }
              return task;
            })
          }));
        }
        
        // Then remove the tag
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== tagId)
        }));
      },
      
      // Get tasks by tag
      getTasksByTag: (tagName) => {
        return get().tasks.filter(task => 
          task.tags && task.tags.includes(tagName)
        );
      },
      
      // Get tasks for today (no due date or due date is today)
      getTodayTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().tasks.filter(task => {
          // If task has no due date, it's not a today task
          if (!task.dueDate) return false;
          
          try {
            // Parse date in DD-MM-YY format
            const [day, month, year] = task.dueDate.split('-').map(num => parseInt(num, 10));
            const taskDate = new Date(2000 + year, month - 1, day);
            taskDate.setHours(0, 0, 0, 0);
            
            // Check if date is today
            return taskDate.getTime() === today.getTime();
          } catch (e) {
            console.error('Error parsing date:', task.dueDate);
            return false;
          }
        });
      },
      
      // Get upcoming tasks (due date is in the future)
      getUpcomingTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().tasks.filter(task => {
          // If task has no due date, it's not an upcoming task
          if (!task.dueDate) return false;
          
          try {
            // Parse date in DD-MM-YY format
            const [day, month, year] = task.dueDate.split('-').map(num => parseInt(num, 10));
            const taskDate = new Date(2000 + year, month - 1, day);
            taskDate.setHours(0, 0, 0, 0);
            
            // Check if date is after today
            return taskDate.getTime() > today.getTime();
          } catch (e) {
            console.error('Error parsing date:', task.dueDate);
            return false;
          }
        });
      },
      
      // Get tasks with upcoming reminders
      getTasksWithReminders: () => {
        return get().tasks.filter(task => 
          task.reminderTime && task.dueDate && !task.completed
        );
      },
      
      // Reset all tasks (clear the task list)
      resetTasks: () => {
        set({ tasks: [] });
      }
    }),
    {
      name: 'organic-mind-tasks',
      getStorage: () => localStorage,
    }
  )
);

export default useTaskStore; 