import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'info', duration = 5000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: { icon: '✓', bgColor: '#10B981', borderColor: '#059669' },
    error: { icon: '✕', bgColor: '#EF4444', borderColor: '#DC2626' },
    warning: { icon: '⚠', bgColor: '#F59E0B', borderColor: '#D97706' },
    info: { icon: 'ℹ', bgColor: '#3B82F6', borderColor: '#2563EB' }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div 
      className="toast"
      style={{
        backgroundColor: config.bgColor,
        borderLeft: `4px solid ${config.borderColor}`
      }}
    >
      <div className="toast-icon">{config.icon}</div>
      <div className="toast-message">{message}</div>
      {onClose && (
        <button 
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;

