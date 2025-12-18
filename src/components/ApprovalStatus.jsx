import { getApprovalSummary } from '../utils/approvalWorkflow';
import HelpTooltip from './HelpTooltip';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

function ApprovalStatus({ submission }) {
  if (!submission) return null;

  const summary = getApprovalSummary(submission);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#F8F9FA',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#0F172A' }}>Approval Status</h3>
        <HelpTooltip content="Multi-level approval workflow showing progress for each required role. Approvals are tracked individually and the submission is approved when all requirements are met.">
          <span style={{ color: '#6B7280', cursor: 'help', fontSize: '18px' }}>ℹ️</span>
        </HelpTooltip>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: summary.isFullyApproved ? '#10B981' : summary.isRejected ? '#EF4444' : '#F59E0B'
          }} />
          <span style={{ fontWeight: '600', color: '#0F172A' }}>
            {summary.isFullyApproved ? 'Fully Approved' : summary.isRejected ? 'Rejected' : 'Pending Approval'}
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginLeft: '22px' }}>
          {summary.totalApprovals} of {summary.totalRequired} required approvals
        </div>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {summary.pending.roles.map((role) => (
          <div
            key={role.roleId}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              borderLeft: `4px solid ${role.isComplete ? '#10B981' : role.isRejected ? '#EF4444' : '#F59E0B'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>
                  {role.roleName}
                </div>
                {summary.config.roles.find(r => r.id === role.roleId)?.description && (
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {summary.config.roles.find(r => r.id === role.roleId).description}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', color: role.isComplete ? '#10B981' : role.isRejected ? '#EF4444' : '#F59E0B' }}>
                  {role.approved} / {role.required}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {role.pending > 0 ? `${role.pending} pending` : 'Complete'}
                </div>
              </div>
            </div>

            {role.approvals.length > 0 && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                  Approvals:
                </div>
                {role.approvals.map((approval) => (
                  <div key={approval.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#0F172A' }}>{approval.userId}</span>
                        {approval.comment && (
                          <div style={{ color: '#6B7280', marginTop: '2px', fontStyle: 'italic' }}>
                            "{approval.comment}"
                          </div>
                        )}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '11px' }}>
                        {formatDate(approval.approvedDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {role.rejections.length > 0 && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#EF4444', marginBottom: '8px' }}>
                  Rejections:
                </div>
                {role.rejections.map((rejection) => (
                  <div key={rejection.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#EF4444' }}>{rejection.userId}</span>
                        <div style={{ color: '#DC2626', marginTop: '2px' }}>
                          Reason: {rejection.reason}
                        </div>
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '11px' }}>
                        {formatDate(rejection.rejectedDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {summary.history.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #E5E7EB' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0F172A' }}>Approval History</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary.history.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  borderLeft: `4px solid ${item.rejected ? '#EF4444' : '#10B981'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0F172A' }}>
                      {item.rejected ? '❌ Rejected' : '✅ Approved'} by {item.userId}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                      Role: {summary.config.roles.find(r => r.id === item.roleId)?.name || item.roleId}
                    </div>
                    {item.comment && (
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', fontStyle: 'italic' }}>
                        "{item.comment}"
                      </div>
                    )}
                    {item.reason && (
                      <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                        Reason: {item.reason}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    {formatDate(item.approvedDate || item.rejectedDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalStatus;

