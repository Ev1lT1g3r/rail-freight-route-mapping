import { useState } from 'react';
import { getSubmissionById, saveSubmission, WORKFLOW_STATUS, duplicateSubmission } from '../utils/submissionStorage';
import { exportSubmissionToJSON, exportSubmissionToCSV, exportSubmissionToText } from '../utils/exportUtils';
import MapComponent from './MapComponent';
import StatusBadge from './StatusBadge';
import HelpTooltip from './HelpTooltip';
import { useToast } from '../contexts/ToastContext';
import { stations } from '../data/railNetwork';

// Operator colors for route segments
const getOperatorColor = (operator) => {
  const colors = {
    'BNSF': '#FFD700',
    'UP': '#FF6B35',
    'CSX': '#4ECDC4',
    'NS': '#45B7D1',
    'CN': '#96CEB4',
    'CP': '#FFEAA7',
    'KCS': '#A29BFE',
    'KCSM': '#A29BFE',
    'Multiple': '#A0A0A0'
  };
  return colors[operator] || '#A0A0A0';
};

function SubmissionDetail({ submissionId, onBack, onEdit, currentUser = 'Current User', isApprover = false }) {
  const submission = getSubmissionById(submissionId);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  const [notes, setNotes] = useState(submission?.notes || '');
  const { success, error } = useToast();

  if (!submission) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Submission not found</p>
        <button onClick={onBack}>Back to List</button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleApprove = () => {
    if (!window.confirm('Are you sure you want to approve this submission?')) {
      return;
    }

    const updated = {
      ...submission,
      status: WORKFLOW_STATUS.APPROVED,
      approvedDate: new Date().toISOString(),
      approvedBy: currentUser,
      approvalComment: approvalComment.trim() || null,
      updatedDate: new Date().toISOString(),
      updatedBy: currentUser,
      notes
    };

    if (saveSubmission(updated)) {
      success('Submission approved successfully!');
      setTimeout(() => onBack(), 1000);
    } else {
      error('Error approving submission');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      error('Please provide a reason for rejection');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this submission?')) {
      return;
    }

    const updated = {
      ...submission,
      status: WORKFLOW_STATUS.REJECTED,
      rejectedDate: new Date().toISOString(),
      rejectedBy: currentUser,
      rejectionReason: rejectionReason.trim(),
      updatedDate: new Date().toISOString(),
      updatedBy: currentUser,
      notes
    };

    if (saveSubmission(updated)) {
      success('Submission rejected');
      setTimeout(() => onBack(), 1000);
    } else {
      error('Error rejecting submission');
    }
  };

  const canApprove = isApprover && 
    (submission.status === WORKFLOW_STATUS.SUBMITTED || 
     submission.status === WORKFLOW_STATUS.PENDING_APPROVAL);

  const canReject = isApprover && 
    (submission.status === WORKFLOW_STATUS.SUBMITTED || 
     submission.status === WORKFLOW_STATUS.PENDING_APPROVAL);

  return (
    <div>
      <div className="sigma-header" style={{ padding: '24px 32px', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: 'white', fontSize: '2rem', fontWeight: 700 }}>
            <span className="sigma-logo">Σ·IQ</span> Submission Details
          </h1>
          <p className="subtitle" style={{ marginTop: '8px', color: 'rgba(255,255,255,0.9)' }}>
            View and manage submission details
          </p>
        </div>
      </div>
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#0F172A' }}>Submission Information</h2>
            <HelpTooltip content="View complete submission details including route information, freight specifications, and approval workflow status. Approvers can approve or reject submissions from this page.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '18px' }}>ℹ️</span>
            </HelpTooltip>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const duplicated = duplicateSubmission(submissionId, currentUser);
                if (duplicated) {
                  success('Submission duplicated! Opening in edit mode...');
                  setTimeout(() => {
                    if (onEdit) {
                      onEdit(duplicated.id);
                    }
                  }, 500);
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📋 Duplicate
            </button>
            <button
              onClick={onBack}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ← Back to List
            </button>
          </div>
        </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Submission ID:</strong> {submission.id}
          </div>
          <div>
            <strong>Name:</strong> {submission.name || 'N/A'}
          </div>
          <div>
            <strong>Status:</strong> 
            <span style={{ marginLeft: '10px' }}>
              <StatusBadge status={submission.status} size="medium" />
            </span>
          </div>
          <div>
            <strong>Route:</strong> {submission.origin} → {submission.destination}
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              Shipping Origin Yard → Delivery Destination Yard
            </div>
          </div>
          <div>
            <strong>Created:</strong> {formatDate(submission.createdDate)}
          </div>
          {submission.submittedDate && (
            <div>
              <strong>Submitted:</strong> {formatDate(submission.submittedDate)}
            </div>
          )}
          <div>
            <strong>Created By:</strong> {submission.createdBy || 'N/A'}
          </div>
          {submission.submittedBy && (
            <div>
              <strong>Submitted By:</strong> {submission.submittedBy}
            </div>
          )}
                {submission.approvedDate && (
                  <>
                    <div>
                      <strong>Approved:</strong> {formatDate(submission.approvedDate)}
                    </div>
                    <div>
                      <strong>Approved By:</strong> {submission.approvedBy || 'N/A'}
                    </div>
                    {submission.approvalComment && (
                      <div style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '10px', backgroundColor: '#D1FAE5', borderRadius: '6px', border: '1px solid #10B981' }}>
                        <strong>Approval Comment:</strong>
                        <p style={{ margin: '5px 0 0 0', color: '#065F46' }}>{submission.approvalComment}</p>
                      </div>
                    )}
                  </>
                )}
          {submission.rejectedDate && (
            <>
              <div>
                <strong>Rejected:</strong> {formatDate(submission.rejectedDate)}
              </div>
              <div>
                <strong>Rejected By:</strong> {submission.rejectedBy || 'N/A'}
              </div>
              {submission.rejectionReason && (
                <div style={{ gridColumn: '1 / -1', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', marginTop: '10px' }}>
                  <strong>Rejection Reason:</strong> {submission.rejectionReason}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Large Route Map with Statistics */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#0F172A' }}>Route Map & Statistics</h3>
          <HelpTooltip content="Interactive map showing the selected route with operator-specific segment colors. The statistics panel displays route details including total distance, operator breakdown, and segment information. Transfer points are marked with rotating icons.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '18px' }}>ℹ️</span>
          </HelpTooltip>
        </div>
        {submission.selectedRoute && submission.selectedRoute.segments && submission.selectedRoute.segments.length > 0 ? (
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '600px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0'
          }}>
            <MapComponent
              stations={stations}
              origin={submission.origin}
              destination={submission.destination}
              onOriginSelect={() => {}}
              onDestinationSelect={() => {}}
              routes={[submission.selectedRoute]}
              selectedRouteIndex={0}
            />
          </div>
        ) : (
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #E2E8F0'
          }}>
            <p style={{ color: '#64748B', margin: 0 }}>No route data available for this submission.</p>
          </div>
        )}
      </div>

      {/* Route Details Section */}
      {submission.selectedRoute && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#0F172A' }}>Route Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Total Distance:</strong> {submission.selectedRoute.totalDistance?.toFixed(0) || 'N/A'} miles
            </div>
            <div>
              <strong>Operators:</strong> {submission.selectedRoute.operators?.join(', ') || 'N/A'}
            </div>
            <div>
              <strong>Operator Count:</strong> {submission.selectedRoute.operatorCount || submission.selectedRoute.operators?.length || 'N/A'}
            </div>
            <div>
              <strong>Transfers:</strong> {submission.selectedRoute.transferPoints?.length || 0}
            </div>
            <div>
              <strong>States/Provinces:</strong> {submission.selectedRoute.states?.join(', ') || 'N/A'}
            </div>
            {submission.selectedRoute.totalCurves !== undefined && (
              <div>
                <strong>Total Curves:</strong> {submission.selectedRoute.totalCurves.toFixed(1)}
              </div>
            )}
            {submission.selectedRoute.totalCost !== undefined && (
              <div>
                <strong>Route Cost Score:</strong> {submission.selectedRoute.totalCost.toFixed(2)}
              </div>
            )}
          </div>
          
          {submission.selectedRoute.segments && submission.selectedRoute.segments.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#0F172A' }}>Route Segments</h4>
              <div style={{ 
                display: 'grid', 
                gap: '10px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '4px'
              }}>
                {submission.selectedRoute.segments.map((segment, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px',
                      borderLeft: `4px solid ${getOperatorColor(segment.operator)}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <strong style={{ color: '#0F172A' }}>
                        {segment.from?.name || segment.from} → {segment.to?.name || segment.to}
                      </strong>
                      <span style={{ 
                        padding: '4px 8px', 
                        backgroundColor: getOperatorColor(segment.operator),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {segment.operator}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#64748B' }}>
                      <span>Distance: {segment.distance?.toFixed(0) || 'N/A'} miles</span>
                      {segment.curveScore !== undefined && (
                        <span>Curves: {segment.curveScore.toFixed(1)}</span>
                      )}
                      {segment.states && segment.states.length > 0 && (
                        <span>States: {segment.states.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submission.selectedRoute.transferPoints && submission.selectedRoute.transferPoints.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#0F172A' }}>Transfer Points</h4>
              <div style={{ 
                display: 'grid', 
                gap: '10px',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '4px'
              }}>
                {submission.selectedRoute.transferPoints.map((transfer, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px'
                    }}
                  >
                    <strong>{transfer.station?.name || transfer.station}</strong>
                    <div style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                      {transfer.fromOperator} → {transfer.toOperator}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Notes:
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      </div>

        {canApprove || canReject ? (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff', 
            borderRadius: '8px',
            border: '2px solid #3B82F6',
            marginBottom: '20px'
          }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Approval Actions</h3>
          
          {canApprove && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontWeight: 'bold' }}>
                Approval Comment (optional):
                <HelpTooltip content="Add an optional comment when approving this submission. This comment will be visible to the submitter and included in the submission history.">
                  <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
                </HelpTooltip>
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter optional approval comment..."
              />
            </div>
          )}

          {canReject && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontWeight: 'bold' }}>
                Rejection Reason (required):
                <HelpTooltip content="A rejection reason is required when rejecting a submission. This helps the submitter understand why the submission was rejected and what needs to be corrected.">
                  <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
                </HelpTooltip>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: rejectionReason.trim() ? '1px solid #ddd' : '2px solid #EF4444',
                  fontSize: '14px',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter reason for rejection (required)..."
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {canApprove && (
              <button
                onClick={handleApprove}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ✓ Approve Submission
              </button>
            )}
            {canReject && (
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: rejectionReason.trim() ? '#EF4444' : '#CBD5E1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: rejectionReason.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ✗ Reject Submission
              </button>
            )}
          </div>
        </div>
        ) : null}
      </div>
    </div>
  );
}

export default SubmissionDetail;

