import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Create Message Context
const MessageContext = createContext(null);

// Custom hook to use message context
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Toast Component
const Toast = ({ message, onClose }) => {
  const { type, title, description, duration } = message;

  // Auto-close after duration
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case MESSAGE_TYPES.SUCCESS:
        return (
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case MESSAGE_TYPES.ERROR:
        return (
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case MESSAGE_TYPES.WARNING:
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case MESSAGE_TYPES.INFO:
      default:
        return (
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  // Background color based on type
  const getBgColor = () => {
    switch (type) {
      case MESSAGE_TYPES.SUCCESS:
        return 'bg-green-50 border-green-200';
      case MESSAGE_TYPES.ERROR:
        return 'bg-red-50 border-red-200';
      case MESSAGE_TYPES.WARNING:
        return 'bg-yellow-50 border-yellow-200';
      case MESSAGE_TYPES.INFO:
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case MESSAGE_TYPES.SUCCESS:
        return 'text-green-900';
      case MESSAGE_TYPES.ERROR:
        return 'text-red-900';
      case MESSAGE_TYPES.WARNING:
        return 'text-yellow-900';
      case MESSAGE_TYPES.INFO:
      default:
        return 'text-blue-900';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-md w-full ${getBgColor()} border-2 rounded-lg shadow-lg p-4 pointer-events-auto`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          {title && (
            <p className={`text-sm font-semibold ${getTextColor()}`}>
              {title}
            </p>
          )}
          {description && (
            <p className={`text-sm ${getTextColor()} ${title ? 'mt-1' : ''}`}>
              {description}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className={`inline-flex rounded-md ${getTextColor()} hover:opacity-75 focus:outline-none`}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({ messages, removeMessage }) => {
  return (
    <div
      className="fixed top-0 right-0 z-50 p-6 space-y-4 pointer-events-none"
      style={{ maxWidth: '100vw' }}
    >
      <AnimatePresence>
        {messages.map((message) => (
          <Toast
            key={message.id}
            message={message}
            onClose={() => removeMessage(message.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Message Provider Component
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Add a new message
  const showMessage = useCallback(
    ({ type = MESSAGE_TYPES.INFO, title, description, duration = 5000 }) => {
      const id = Date.now() + Math.random();
      const message = { id, type, title, description, duration };

      setMessages((prev) => [...prev, message]);

      return id;
    },
    []
  );

  // Remove a message by ID
  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Convenience methods for different message types
  const success = useCallback(
    (title, description, duration) => {
      return showMessage({
        type: MESSAGE_TYPES.SUCCESS,
        title,
        description,
        duration,
      });
    },
    [showMessage]
  );

  const error = useCallback(
    (title, description, duration) => {
      return showMessage({
        type: MESSAGE_TYPES.ERROR,
        title,
        description,
        duration,
      });
    },
    [showMessage]
  );

  const warning = useCallback(
    (title, description, duration) => {
      return showMessage({
        type: MESSAGE_TYPES.WARNING,
        title,
        description,
        duration,
      });
    },
    [showMessage]
  );

  const info = useCallback(
    (title, description, duration) => {
      return showMessage({
        type: MESSAGE_TYPES.INFO,
        title,
        description,
        duration,
      });
    },
    [showMessage]
  );

  const value = {
    // State
    messages,
    
    // Methods
    showMessage,
    removeMessage,
    clearMessages,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
      <ToastContainer messages={messages} removeMessage={removeMessage} />
    </MessageContext.Provider>
  );
};

export default MessageContext;