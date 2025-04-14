import { useEffect, useRef } from 'react';
import useTaskStore from '../store/useTaskStore';
import useSettingsStore from '../store/useSettingsStore';
import notificationService from '../services/notificationService';

const useReminders = () => {
  const tasks = useTaskStore(state => state.tasks);
  const notificationsEnabled = useSettingsStore(state => state.settings.notificationsEnabled);
  const timersRef = useRef({});

  // Calculate time until reminder is due
  const calculateReminderTime = (task) => {
    if (!task.dueDate || !task.reminderTime) return null;
    
    try {
      // Parse date in DD-MM-YY format
      const [day, month, year] = task.dueDate.split('-').map(num => parseInt(num, 10));
      const [hours, minutes] = task.reminderTime.split(':').map(num => parseInt(num, 10));
      
      const reminderDate = new Date(2000 + year, month - 1, day, hours, minutes);
      const now = new Date();
      
      // Calculate time difference in milliseconds
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      
      // Only return positive values (future reminders)
      return timeUntilReminder > 0 ? timeUntilReminder : null;
    } catch (e) {
      console.error('Error parsing date or time:', task.dueDate, task.reminderTime);
      return null;
    }
  };

  // Schedule reminders for all tasks
  const scheduleReminders = () => {
    // Clear existing timers
    Object.values(timersRef.current).forEach(timerId => {
      notificationService.cancelReminder(timerId);
    });
    
    // Reset timers object
    timersRef.current = {};
    
    // Don't schedule if notifications are disabled
    if (!notificationsEnabled) return;
    
    // Schedule new reminders for tasks with due dates and reminder times
    tasks.forEach(task => {
      if (task.dueDate && task.reminderTime && !task.completed) {
        const timeUntilReminder = calculateReminderTime(task);
        
        if (timeUntilReminder) {
          const timerId = notificationService.scheduleReminder(task, timeUntilReminder);
          if (timerId) {
            timersRef.current[task.id] = timerId;
          }
        }
      }
    });
  };

  // Schedule reminders whenever tasks or settings change
  useEffect(() => {
    scheduleReminders();
    
    // Clean up timers when component unmounts
    return () => {
      Object.values(timersRef.current).forEach(timerId => {
        notificationService.cancelReminder(timerId);
      });
    };
  }, [tasks, notificationsEnabled]);

  return {
    scheduleReminders
  };
};

export default useReminders; 