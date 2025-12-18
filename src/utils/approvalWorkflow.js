// Multi-level approval workflow utility

import { WORKFLOW_STATUS } from './submissionStorage';
import { getApprovalConfig, canUserApprove, hasUserApprovedForRole, getPendingApprovals } from './approvalConfig';

/**
 * Add an approval to a submission
 * @param {Object} submission - Submission object
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @param {string} comment - Optional approval comment
 * @returns {Object} Updated submission
 */
export function addApproval(submission, userId, roleId, comment = '') {
  const approvals = submission.approvals || [];
  
  // Check if user already approved for this role
  if (hasUserApprovedForRole(submission, userId, roleId)) {
    throw new Error('User has already approved for this role');
  }
  
  const newApproval = {
    id: `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    roleId,
    comment: comment.trim() || null,
    approvedDate: new Date().toISOString(),
    rejected: false
  };
  
  const updated = {
    ...submission,
    approvals: [...approvals, newApproval],
    updatedDate: new Date().toISOString()
  };
  
  // Check if fully approved
  const pending = getPendingApprovals(updated);
  if (pending.isFullyApproved) {
    updated.status = WORKFLOW_STATUS.APPROVED;
    updated.approvedDate = new Date().toISOString();
    updated.approvedBy = userId; // Last approver
  } else {
    updated.status = WORKFLOW_STATUS.PENDING_APPROVAL;
  }
  
  return updated;
}

/**
 * Add a rejection to a submission
 * @param {Object} submission - Submission object
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @param {string} reason - Rejection reason (required)
 * @returns {Object} Updated submission
 */
export function addRejection(submission, userId, roleId, reason) {
  if (!reason || !reason.trim()) {
    throw new Error('Rejection reason is required');
  }
  
  const approvals = submission.approvals || [];
  
  const newRejection = {
    id: `rejection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    roleId,
    reason: reason.trim(),
    rejectedDate: new Date().toISOString(),
    rejected: true
  };
  
  const updated = {
    ...submission,
    approvals: [...approvals, newRejection],
    status: WORKFLOW_STATUS.REJECTED,
    rejectedDate: new Date().toISOString(),
    rejectedBy: userId,
    rejectionReason: reason.trim(),
    updatedDate: new Date().toISOString()
  };
  
  return updated;
}

/**
 * Get approval history for a submission
 * @param {Object} submission - Submission object
 * @returns {Array} Approval history sorted by date
 */
export function getApprovalHistory(submission) {
  const approvals = submission.approvals || [];
  return [...approvals].sort((a, b) => {
    const dateA = new Date(a.approvedDate || a.rejectedDate || 0);
    const dateB = new Date(b.approvedDate || b.rejectedDate || 0);
    return dateA - dateB;
  });
}

/**
 * Get approval summary for display
 * @param {Object} submission - Submission object
 * @returns {Object} Approval summary
 */
export function getApprovalSummary(submission) {
  const config = getApprovalConfig();
  const pending = getPendingApprovals(submission, config);
  const history = getApprovalHistory(submission);
  
  return {
    pending,
    history,
    config,
    status: submission.status,
    isFullyApproved: pending.isFullyApproved,
    isRejected: pending.isRejected,
    totalApprovals: pending.totalApproved,
    totalRejections: pending.totalRejected,
    totalRequired: pending.totalRequired
  };
}

