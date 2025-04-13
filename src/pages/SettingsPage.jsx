import { useState, useEffect } from 'react';
import { FiSettings, FiSun, FiMoon, FiTrash } from 'react-icons/fi';
import useSettingsStore from '../store/useSettingsStore';
import useTaskStore from '../store/useTaskStore';

const SettingsPage = () => {
  // Get settings state and actions from Zustand store
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  
  // Use the task store for reset functionality
  const resetTasks = useTaskStore(state => state.resetTasks);
  
  // Create a local copy for editing
  const [formSettings, setFormSettings] = useState(settings);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Update local state when store settings change
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Update local form state
    setFormSettings({
      ...formSettings,
      [name]: newValue
    });
    
    // Auto-save the setting immediately
    updateSetting(name, newValue);
  };

  // Save settings (not really needed with auto-save, but kept for UX)
  const saveSettings = () => {
    updateSettings(formSettings);
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  // Handle reset tasks
  const handleResetTasks = () => {
    if (window.confirm('Are you sure you want to reset all tasks? This cannot be undone.')) {
      resetTasks();
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2000);
    }
  };

  // Theme toggle handler
  const handleThemeToggle = (theme) => {
    // Update local form state
    setFormSettings({
      ...formSettings,
      theme
    });
    
    // Save to store
    updateSetting('theme', theme);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 flex items-center">
          <FiSettings className="mr-3" /> Settings
        </h1>

        {/* Appearance Settings */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FiSun className="mr-2" /> Appearance
          </h2>

          <div className="space-y-8">
            <div>
              <p className="text-gray-700 mb-3">Theme</p>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => handleThemeToggle('light')}
                  className={`flex items-center gap-2 py-2 px-4 border ${
                    formSettings.theme === 'light' 
                      ? 'border-yellow-400 bg-white' 
                      : 'border-gray-200 bg-white'
                  } rounded-l-md`}
                >
                  <FiSun /> Light
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeToggle('dark')}
                  className={`flex items-center gap-2 py-2 px-4 border ${
                    formSettings.theme === 'dark' 
                      ? 'border-yellow-400 bg-white' 
                      : 'border-gray-200 bg-white'
                  } rounded-r-md`}
                >
                  <FiMoon /> Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
          
          <div>
            <p className="text-gray-700 mb-3">Enable notifications</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notificationsEnabled"
                className="sr-only"
                checked={formSettings.notificationsEnabled}
                onChange={handleChange}
              />
              <div className={`w-12 h-6 rounded-full ${formSettings.notificationsEnabled ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formSettings.notificationsEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-14">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FiTrash className="mr-2" /> Data Management
          </h2>
          
          <div>
            <p className="text-gray-700 mb-4">Manage your task data and reset options.</p>
            <button 
              className="flex items-center gap-2 py-2 px-4 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              onClick={handleResetTasks}
            >
              <FiTrash />
              Reset All Tasks
            </button>
            <p className="text-sm text-gray-500 mt-2">This will permanently delete all your tasks.</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-800 py-2 px-6 rounded-md hover:bg-yellow-500 transition-colors font-medium"
            onClick={saveSettings}
          >
            Save Settings
          </button>
        </div>

        {/* Confirmation message */}
        {showSaveConfirmation && (
          <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 