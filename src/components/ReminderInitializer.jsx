import { useEffect } from 'react';
import useReminders from '../hooks/useReminders';
import { useNotification } from '../context/NotificationContext';
import useTaskStore from '../store/useTaskStore';
import useSettingsStore from '../store/useSettingsStore';
import notificationService from '../services/notificationService';

// This component doesn't render anything visible
// It just initializes and connects notifications and reminders
const ReminderInitializer = () => {
  const { scheduleReminders } = useReminders();
  const { showInfo } = useNotification();
  const notificationsEnabled = useSettingsStore(state => state.settings.notificationsEnabled);
  const tasks = useTaskStore(state => state.tasks);

  // Initialize notification permission and reminders on component mount
  useEffect(() => {
    const initializeNotifications = async () => {
      if (notificationsEnabled) {
        // Request notification permission if needed
        const permissionGranted = await notificationService.checkPermission();
        
        if (permissionGranted) {
          // Schedule reminders for existing tasks
          scheduleReminders();
        } else if (Notification.permission === 'denied') {
          // Show in-app notification if browser notifications are blocked
          showInfo('Browser notifications are disabled. Enable them in your browser settings for reminders.', {
            duration: 10000
          });
        }
      }
    };

    initializeNotifications();
  }, [notificationsEnabled, showInfo, scheduleReminders]);

  // Set up listener for task changes
  useEffect(() => {
    if (notificationsEnabled) {
      // Re-schedule reminders when tasks change
      scheduleReminders();
    }
  }, [tasks, notificationsEnabled, scheduleReminders]);

  // This component doesn't render anything
  return null;
};

export default ReminderInitializer; 