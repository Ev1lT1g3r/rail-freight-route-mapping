// Approval workflow configuration utility

// Default approval configuration
export const DEFAULT_APPROVAL_CONFIG = {
  requireAllRoles: true, // If true, all roles must approve. If false, any role can approve.
  roles: [
    {
      id: 'operations',
      name: 'Operations Manager',
      description: 'Approves operational feasibility',
      requiredApprovals: 1,
      order: 1
    },
    {
      id: 'safety',
      name: 'Safety Officer',
      description: 'Approves safety compliance',
      requiredApprovals: 1,
      order: 2
    },
    {
      id: 'finance',
      name: 'Finance Manager',
      description: 'Approves financial terms',
      requiredApprovals: 1,
      order: 3
    }
  ],
  sequential: false // If true, approvals must happen in order. If false, can happen in parallel.
};

/**
 * Get approval configuration (can be extended to load from storage/API)
 * @returns {Object} Approval configuration
 */
export function getApprovalConfig() {
  try {
    const stored = localStorage.getItem('rail_freight_approval_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading approval config:', e);
  }
  return DEFAULT_APPROVAL_CONFIG;
}

/**
 * Save approval configuration
 * @param {Object} config - Approval configuration
 */
export function saveApprovalConfig(config) {
  try {
    localStorage.setItem('rail_freight_approval_config', JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving approval config:', e);
    return false;
  }
}

/**
 * Get user roles (can be extended to load from auth system)
 * @param {string} userId - User ID
 * @returns {Array} Array of role IDs the user has
 */
export function getUserRoles(userId) {
  // For now, return a mock. In production, this would come from an auth system
  try {
    const stored = localStorage.getItem(`rail_freight_user_roles_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading user roles:', e);
  }
  
  // Default: assign roles based on user name (for demo purposes)
  // In production, this would come from your authentication/authorization system
  const defaultRoles = {
    'admin': ['operations', 'safety', 'finance'],
    'operations': ['operations'],
    'safety': ['safety'],
    'finance': ['finance'],
    'manager': ['operations', 'finance']
  };
  
  const userKey = userId.toLowerCase();
  for (const [key, roles] of Object.entries(defaultRoles)) {
    if (userKey.includes(key)) {
      return roles;
    }
  }
  
  return ['operations']; // Default role
}

/**
 * Set user roles (for demo/testing purposes)
 * @param {string} userId - User ID
 * @param {Array} roles - Array of role IDs
 */
export function setUserRoles(userId, roles) {
  try {
    localStorage.setItem(`rail_freight_user_roles_${userId}`, JSON.stringify(roles));
    return true;
  } catch (e) {
    console.error('Error saving user roles:', e);
    return false;
  }
}

/**
 * Check if a user can approve for a specific role
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {boolean} True if user can approve for this role
 */
export function canUserApproveForRole(userId, roleId) {
  const userRoles = getUserRoles(userId);
  return userRoles.includes(roleId);
}

/**
 * Get pending approvals for a submission
 * @param {Object} submission - Submission object
 * @param {Object} config - Approval configuration (optional)
 * @returns {Object} Pending approvals breakdown
 */
export function getPendingApprovals(submission, config = null) {
  const approvalConfig = config || getApprovalConfig();
  const approvals = submission.approvals || [];
  
  const pending = {
    roles: [],
    totalRequired: 0,
    totalApproved: 0,
    totalRejected: 0,
    canApprove: false,
    isFullyApproved: false,
    isRejected: false
  };
  
  // Check each role requirement
  approvalConfig.roles.forEach(role => {
    const roleApprovals = approvals.filter(a => a.roleId === role.id && !a.rejected);
    const roleRejections = approvals.filter(a => a.roleId === role.id && a.rejected);
    
    const approvedCount = roleApprovals.length;
    const rejectedCount = roleRejections.length;
    const requiredCount = role.requiredApprovals;
    
    pending.roles.push({
      roleId: role.id,
      roleName: role.name,
      required: requiredCount,
      approved: approvedCount,
      rejected: rejectedCount,
      pending: Math.max(0, requiredCount - approvedCount),
      isComplete: approvedCount >= requiredCount,
      isRejected: rejectedCount > 0,
      approvals: roleApprovals,
      rejections: roleRejections
    });
    
    pending.totalRequired += requiredCount;
    pending.totalApproved += approvedCount;
    pending.totalRejected += rejectedCount;
  });
  
  // Check if fully approved
  if (approvalConfig.requireAllRoles) {
    pending.isFullyApproved = pending.roles.every(r => r.isComplete && !r.isRejected);
  } else {
    pending.isFullyApproved = pending.totalApproved >= approvalConfig.roles[0]?.requiredApprovals || 0;
  }
  
  // Check if rejected
  pending.isRejected = pending.roles.some(r => r.isRejected);
  
  return pending;
}

/**
 * Check if a user can approve a submission
 * @param {Object} submission - Submission object
 * @param {string} userId - User ID
 * @param {Object} config - Approval configuration (optional)
 * @returns {Object} Approval capability info
 */
export function canUserApprove(submission, userId, config = null) {
  const approvalConfig = config || getApprovalConfig();
  const pending = getPendingApprovals(submission, approvalConfig);
  
  if (pending.isFullyApproved || pending.isRejected) {
    return {
      canApprove: false,
      reason: pending.isFullyApproved ? 'Already fully approved' : 'Submission has been rejected'
    };
  }
  
  // Check if sequential approval is required
  if (approvalConfig.sequential) {
    // Find first incomplete role
    const firstIncomplete = pending.roles.find(r => !r.isComplete && !r.isRejected);
    if (firstIncomplete) {
      const userRoles = getUserRoles(userId);
      if (!userRoles.includes(firstIncomplete.roleId)) {
        return {
          canApprove: false,
          reason: `Must wait for ${firstIncomplete.roleName} approval first`
        };
      }
    }
  }
  
  // Check if user has any required roles
  const userRoles = getUserRoles(userId);
  const canApproveRoles = pending.roles.filter(r => 
    !r.isComplete && 
    !r.isRejected && 
    userRoles.includes(r.roleId) &&
    r.approved < r.required
  );
  
  if (canApproveRoles.length === 0) {
    return {
      canApprove: false,
      reason: 'No pending approvals for your roles'
    };
  }
  
  return {
    canApprove: true,
    roles: canApproveRoles.map(r => r.roleId),
    roleNames: canApproveRoles.map(r => r.roleName)
  };
}

/**
 * Check if user has already approved for a role
 * @param {Object} submission - Submission object
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {boolean} True if user has already approved
 */
export function hasUserApprovedForRole(submission, userId, roleId) {
  const approvals = submission.approvals || [];
  return approvals.some(a => 
    a.userId === userId && 
    a.roleId === roleId && 
    !a.rejected
  );
}

