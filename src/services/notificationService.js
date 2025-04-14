class NotificationService {
  constructor() {
    this.isPermissionGranted = false;
    this.checkPermission();
  }

  // Check if notification permission is granted or request it
  async checkPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.isPermissionGranted = true;
      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.isPermissionGranted = permission === 'granted';
      return this.isPermissionGranted;
    }

    return false;
  }

  // Show a notification
  async showNotification(title, options = {}) {
    if (!this.isPermissionGranted) {
      const permissionGranted = await this.checkPermission();
      if (!permissionGranted) return false;
    }

    try {
      const notification = new Notification(title, {
        body: options.body || '',
        icon: options.icon || '',
        tag: options.tag || 'default',
        ...options
      });

      if (options.onClick) {
        notification.onclick = options.onClick;
      }

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Schedule a reminder notification
  scheduleReminder(task, timeInMs) {
    if (!task || !task.id || !timeInMs) return null;

    const timerId = setTimeout(() => {
      this.showNotification(`Reminder: ${task.title}`, {
        body: task.description || 'Task reminder',
        tag: `task-${task.id}`,
        onClick: () => {
          window.focus();
          // You can add navigation to the task here if needed
        }
      });
    }, timeInMs);

    return timerId;
  }

  // Cancel a scheduled reminder
  cancelReminder(timerId) {
    if (timerId) {
      clearTimeout(timerId);
    }
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService; 