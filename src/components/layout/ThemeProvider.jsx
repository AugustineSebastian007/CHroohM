import { useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

// ThemeProvider applies the theme from settings to the app
const ThemeProvider = ({ children }) => {
  const settings = useSettingsStore((state) => state.settings);
  const isLoaded = useSettingsStore((state) => state.isLoaded);

  // Apply theme to document
  useEffect(() => {
    if (isLoaded) {
      const root = document.documentElement;
      
      // Apply theme
      if (settings.theme === 'dark') {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  }, [settings, isLoaded]);

  return children;
};

export default ThemeProvider; 