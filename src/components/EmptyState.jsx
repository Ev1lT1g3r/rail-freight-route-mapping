import './EmptyState.css';

function EmptyState({ 
  icon = '📋', 
  title, 
  message, 
  actionLabel, 
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      <div className="empty-state-actions">
        {onAction && actionLabel && (
          <button 
            className="empty-state-primary-action"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <button 
            className="empty-state-secondary-action"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;

