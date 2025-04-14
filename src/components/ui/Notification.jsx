import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Notification component for displaying in-app notifications
const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const closeButtonRef = useRef(null);

  // Handle notification close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow exit animation to play
    }
  };

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);
  
  // Focus close button when notification appears
  useEffect(() => {
    if (isVisible && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isVisible]);

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // Different styles for different notification types
  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return createPortal(
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white
                 max-w-sm transition-all duration-300
                 ${typeClasses[type] || typeClasses.info}
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      role="alert"
      aria-live="assertive"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start">
        <div className="flex-grow mr-2">{message}</div>
        <button 
          ref={closeButtonRef}
          onClick={handleClose}
          className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
          aria-label="Close notification"
          tabIndex={0}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Notification; 