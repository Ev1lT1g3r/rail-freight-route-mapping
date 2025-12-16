import { WORKFLOW_STATUS } from '../utils/submissionStorage';

function StatusBadge({ status, size = 'medium' }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case WORKFLOW_STATUS.APPROVED:
        return {
          color: '#10B981',
          icon: '✓',
          label: 'Approved'
        };
      case WORKFLOW_STATUS.REJECTED:
        return {
          color: '#EF4444',
          icon: '✗',
          label: 'Rejected'
        };
      case WORKFLOW_STATUS.PENDING_APPROVAL:
        return {
          color: '#F59E0B',
          icon: '⏳',
          label: 'Pending Approval'
        };
      case WORKFLOW_STATUS.SUBMITTED:
        return {
          color: '#3B82F6',
          icon: '📤',
          label: 'Submitted'
        };
      case WORKFLOW_STATUS.DRAFT:
        return {
          color: '#64748B',
          icon: '📝',
          label: 'Draft'
        };
      default:
        return {
          color: '#64748B',
          icon: '•',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeStyles = {
    small: {
      padding: '4px 10px',
      fontSize: '11px',
      iconSize: '12px'
    },
    medium: {
      padding: '6px 14px',
      fontSize: '12px',
      iconSize: '14px'
    },
    large: {
      padding: '8px 18px',
      fontSize: '14px',
      iconSize: '16px'
    }
  };

  const style = sizeStyles[size] || sizeStyles.medium;

  return (
    <span
      style={{
        padding: style.padding,
        borderRadius: '20px',
        backgroundColor: config.color + '15',
        color: config.color,
        fontWeight: '600',
        fontSize: style.fontSize,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: `1px solid ${config.color}40`,
        boxShadow: `0 2px 4px ${config.color}20`,
        transition: 'all 0.2s ease'
      }}
      title={`Status: ${config.label}`}
    >
      <span style={{ fontSize: style.iconSize }}>{config.icon}</span>
      {config.label}
    </span>
  );
}

export default StatusBadge;

