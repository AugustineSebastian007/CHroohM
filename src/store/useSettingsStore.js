import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define default settings
const defaultSettings = {
  theme: 'light',
  notificationsEnabled: true
};

// Create settings store with persistence
const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Initial state
      settings: defaultSettings,
      isLoaded: false,
      
      // Set loaded state
      setLoaded: () => set({ isLoaded: true }),
      
      // Update a single setting
      updateSetting: (key, value) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value
          }
        }));
      },
      
      // Update multiple settings at once
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings
          }
        }));
      },
      
      // Reset settings to defaults
      resetSettings: () => {
        set({ settings: defaultSettings });
      },
      
      // Get a specific setting
      getSetting: (key) => {
        return get().settings[key];
      }
    }),
    {
      name: 'organic-mind-settings',
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoaded();
        }
      }
    }
  )
);

export default useSettingsStore; 