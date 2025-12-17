import { useState } from 'react';
import { getSubmissionById, saveSubmission, WORKFLOW_STATUS } from '../utils/submissionStorage';
import MapComponent from './MapComponent';
import RouteResults from './RouteResults';
import StatusBadge from './StatusBadge';
import { stations } from '../data/railNetwork';

function SubmissionDetail({ submissionId, onBack, currentUser = 'Current User', isApprover = false }) {
  const submission = getSubmissionById(submissionId);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState(submission?.notes || '');

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
      updatedDate: new Date().toISOString(),
      updatedBy: currentUser,
      notes
    };

    if (saveSubmission(updated)) {
      alert('Submission approved successfully!');
      onBack();
    } else {
      alert('Error approving submission');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
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
      alert('Submission rejected');
      onBack();
    } else {
      alert('Error rejecting submission');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0F172A' }}>Submission Information</h2>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Route Map</h3>
          <MapComponent
            stations={stations}
            origin={submission.origin}
            destination={submission.destination}
            onOriginSelect={() => {}}
            onDestinationSelect={() => {}}
            selectedRoute={submission.selectedRoute}
          />
        </div>

        <div>
          <h3>Selected Route</h3>
          {submission.selectedRoute ? (
            <RouteResults
              routes={[submission.selectedRoute]}
              onRouteSelect={() => {}}
              selectedRouteIndex={0}
            />
          ) : (
            <p>No route selected</p>
          )}
        </div>
      </div>

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
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0 }}>Approval Actions</h3>
          
          {canReject && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Rejection Reason (required for rejection):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for rejection..."
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
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            {canApprove && (
              <button
                onClick={handleApprove}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
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
                  padding: '12px 24px',
                  backgroundColor: rejectionReason.trim() ? '#dc3545' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: rejectionReason.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: 'bold'
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

