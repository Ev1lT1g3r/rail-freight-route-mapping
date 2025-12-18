import { useState, useEffect } from 'react';
import { getApprovalConfig, saveApprovalConfig, DEFAULT_APPROVAL_CONFIG } from '../utils/approvalConfig';
import { useToast } from '../contexts/ToastContext';
import HelpTooltip from './HelpTooltip';

function ApprovalConfig({ onClose }) {
  const [config, setConfig] = useState(DEFAULT_APPROVAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const loaded = getApprovalConfig();
    setConfig(loaded);
    setLoading(false);
  }, []);

  const handleAddRole = () => {
    const newRole = {
      id: `role_${Date.now()}`,
      name: 'New Role',
      description: '',
      requiredApprovals: 1,
      order: config.roles.length + 1
    };
    setConfig({
      ...config,
      roles: [...config.roles, newRole]
    });
  };

  const handleRemoveRole = (roleId) => {
    setConfig({
      ...config,
      roles: config.roles.filter(r => r.id !== roleId)
    });
  };

  const handleUpdateRole = (roleId, field, value) => {
    setConfig({
      ...config,
      roles: config.roles.map(r => 
        r.id === roleId ? { ...r, [field]: value } : r
      )
    });
  };

  const handleSave = () => {
    if (saveApprovalConfig(config)) {
      success('Approval configuration saved successfully!');
      if (onClose) onClose();
    } else {
      error('Error saving approval configuration');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset to default configuration? This will overwrite your current settings.')) {
      setConfig(DEFAULT_APPROVAL_CONFIG);
      saveApprovalConfig(DEFAULT_APPROVAL_CONFIG);
      success('Configuration reset to defaults');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0F172A' }}>Approval Workflow Configuration</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600' }}>
            <input
              type="checkbox"
              checked={config.requireAllRoles}
              onChange={(e) => setConfig({ ...config, requireAllRoles: e.target.checked })}
            />
            Require All Roles to Approve
            <HelpTooltip content="If checked, all roles must approve. If unchecked, any role can approve.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600' }}>
            <input
              type="checkbox"
              checked={config.sequential}
              onChange={(e) => setConfig({ ...config, sequential: e.target.checked })}
            />
            Sequential Approval Required
            <HelpTooltip content="If checked, approvals must happen in order. If unchecked, approvals can happen in parallel.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#0F172A' }}>Approval Roles</h3>
            <button
              onClick={handleAddRole}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Add Role
            </button>
          </div>

          {config.roles.map((role, index) => (
            <div
              key={role.id}
              style={{
                padding: '20px',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                marginBottom: '15px',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#0F172A' }}>Role {index + 1}</h4>
                <button
                  onClick={() => handleRemoveRole(role.id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>

              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => handleUpdateRole(role.id, 'name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="e.g., Operations Manager"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={role.description}
                    onChange={(e) => handleUpdateRole(role.id, 'description', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="e.g., Approves operational feasibility"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                    Required Approvals *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={role.requiredApprovals}
                    onChange={(e) => handleUpdateRole(role.id, 'requiredApprovals', parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <small style={{ color: '#6B7280', fontSize: '12px' }}>
                    Number of people with this role who must approve
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                    Approval Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={role.order}
                    onChange={(e) => handleUpdateRole(role.id, 'order', parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <small style={{ color: '#6B7280', fontSize: '12px' }}>
                    Order in which this role must approve (if sequential)
                  </small>
                </div>
              </div>
            </div>
          ))}

          {config.roles.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              No roles configured. Add a role to get started.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovalConfig;

