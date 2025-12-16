import { useState, useEffect } from 'react';
import { getAllSubmissions, WORKFLOW_STATUS, deleteSubmission } from '../utils/submissionStorage';

function SubmissionsList({ onViewSubmission, onCreateNew, onEditSubmission }) {
  const [submissions, setSubmissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    console.log('SubmissionsList mounted');
    loadSubmissions();
    // Refresh every 5 seconds to catch updates
    const interval = setInterval(loadSubmissions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSubmissions = () => {
    const all = getAllSubmissions();
    setSubmissions(all);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case WORKFLOW_STATUS.APPROVED:
        return '#10B981'; // Sigma success green
      case WORKFLOW_STATUS.REJECTED:
        return '#EF4444'; // Sigma error red
      case WORKFLOW_STATUS.PENDING_APPROVAL:
        return '#F59E0B'; // Sigma warning amber
      case WORKFLOW_STATUS.SUBMITTED:
        return '#3B82F6'; // Sigma secondary blue
      case WORKFLOW_STATUS.DRAFT:
        return '#64748B'; // Sigma gray
      default:
        return '#64748B';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.submittedDate || a.createdDate || 0);
      const dateB = new Date(b.submittedDate || b.createdDate || 0);
      return dateB - dateA;
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    if (sortBy === 'origin') {
      return (a.origin || '').localeCompare(b.origin || '');
    }
    return 0;
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(id);
      loadSubmissions();
    }
  };

  return (
    <div>
      <div className="sigma-header" style={{ padding: '24px 32px', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: 'white', fontSize: '2rem', fontWeight: 700 }}>
            <span className="sigma-logo">Σ·IQ</span> Rail Freight Route Submissions
          </h1>
          <p className="subtitle" style={{ marginTop: '8px', color: 'rgba(255,255,255,0.9)' }}>
            Manage and track freight rail route submissions
          </p>
        </div>
      </div>
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0F172A' }}>All Submissions</h2>
        <button
          onClick={onCreateNew}
          className="sigma-btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + New Submission
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All</option>
            {Object.values(WORKFLOW_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="date">Date</option>
            <option value="status">Status</option>
            <option value="origin">Origin</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', color: '#666' }}>
          Total: {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {sortedSubmissions.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#666'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>No submissions found</p>
          <p>Click "New Submission" to create your first route submission.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {sortedSubmissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => onViewSubmission(submission.id)}
              style={{
                padding: '20px',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      {submission.origin} → {submission.destination}
                    </h3>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        backgroundColor: getStatusColor(submission.status) + '20',
                        color: getStatusColor(submission.status),
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {submission.status}
                    </span>
                  </div>
                  
                  {submission.selectedRoute && (
                    <div style={{ color: '#666', marginBottom: '10px' }}>
                      <strong>Distance:</strong> {submission.selectedRoute.totalDistance} miles
                      {' | '}
                      <strong>Operators:</strong> {submission.selectedRoute.operators.join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {(submission.status === WORKFLOW_STATUS.DRAFT || submission.status === WORKFLOW_STATUS.REJECTED) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditSubmission) {
                          onEditSubmission(submission.id);
                        }
                      }}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(submission.id, e)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                fontSize: '14px',
                color: '#666',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <div>
                  <strong>Submission ID:</strong> {submission.id}
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
                  <strong>Submitted By:</strong> {submission.submittedBy || 'N/A'}
                </div>
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
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Reason:</strong> {submission.rejectionReason}
                      </div>
                    )}
                  </>
                )}
                {submission.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Notes:</strong> {submission.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default SubmissionsList;

