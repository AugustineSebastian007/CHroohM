import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/ui/Notification';

// Create notification context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((message, options = {}) => {
    const id = Date.now(); // Simple unique ID
    const newNotification = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification(message, { ...options, type: 'success' });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification(message, { ...options, type: 'error' });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification(message, { ...options, type: 'warning' });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification(message, { ...options, type: 'info' });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      
      {/* Render all active notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 