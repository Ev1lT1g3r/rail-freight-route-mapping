// Local storage utility for submissions
// In a real app, this would connect to a backend API

const STORAGE_KEY = 'rail_freight_submissions';

export const WORKFLOW_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived'
};

export function getAllSubmissions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading submissions:', e);
    return [];
  }
}

export function saveSubmission(submission) {
  try {
    if (!submission || !submission.id) {
      console.error('Invalid submission: missing id', submission);
      return false;
    }

    const submissions = getAllSubmissions();
    const existingIndex = submissions.findIndex(s => s.id === submission.id);
    
    if (existingIndex >= 0) {
      submissions[existingIndex] = submission;
    } else {
      submissions.push(submission);
    }
    
    // Sort by submission date (newest first)
    submissions.sort((a, b) => {
      const dateA = new Date(a.submittedDate || a.createdDate || 0);
      const dateB = new Date(b.submittedDate || b.createdDate || 0);
      return dateB - dateA;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    
    // Verify the save worked
    const verify = getAllSubmissions();
    const saved = verify.find(s => s.id === submission.id);
    if (!saved) {
      console.error('Submission save verification failed:', submission.id);
      return false;
    }
    
    console.log('Submission saved successfully:', {
      id: submission.id,
      status: submission.status,
      totalSubmissions: verify.length
    });
    
    // Dispatch event to notify components of update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('submissionsUpdated'));
    }
    
    return true;
  } catch (e) {
    console.error('Error saving submission:', e, submission);
    return false;
  }
}

export function getSubmissionById(id) {
  const submissions = getAllSubmissions();
  return submissions.find(s => s.id === id);
}

export function deleteSubmission(id) {
  try {
    const submissions = getAllSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting submission:', e);
    return false;
  }
}

export function createSubmissionId() {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function duplicateSubmission(id, currentUser = 'Current User') {
  try {
    const submission = getSubmissionById(id);
    if (!submission) {
      return null;
    }

    // Create a new submission with copied data
    const duplicated = {
      ...submission,
      id: createSubmissionId(),
      name: submission.name ? `${submission.name} (Copy)` : undefined,
      status: WORKFLOW_STATUS.DRAFT,
      createdDate: new Date().toISOString(),
      createdBy: currentUser,
      submittedDate: null,
      submittedBy: null,
      approvedDate: null,
      approvedBy: null,
      rejectedDate: null,
      rejectedBy: null,
      rejectionReason: null,
      updatedDate: new Date().toISOString(),
      updatedBy: currentUser
    };

    // Remove the original ID from the duplicated object to ensure it's treated as new
    saveSubmission(duplicated);
    return duplicated;
  } catch (e) {
    console.error('Error duplicating submission:', e);
    return null;
  }
}

export function archiveSubmission(id, currentUser = 'Current User') {
  try {
    const submission = getSubmissionById(id);
    if (!submission) {
      return false;
    }

    const archived = {
      ...submission,
      status: WORKFLOW_STATUS.ARCHIVED,
      archivedDate: new Date().toISOString(),
      archivedBy: currentUser,
      updatedDate: new Date().toISOString(),
      updatedBy: currentUser
    };

    return saveSubmission(archived);
  } catch (e) {
    console.error('Error archiving submission:', e);
    return false;
  }
}

export function unarchiveSubmission(id, currentUser = 'Current User') {
  try {
    const submission = getSubmissionById(id);
    if (!submission || submission.status !== WORKFLOW_STATUS.ARCHIVED) {
      return false;
    }

    // Restore to previous status or default to DRAFT
    const restored = {
      ...submission,
      status: submission.previousStatus || WORKFLOW_STATUS.DRAFT,
      archivedDate: null,
      archivedBy: null,
      updatedDate: new Date().toISOString(),
      updatedBy: currentUser
    };

    return saveSubmission(restored);
  } catch (e) {
    console.error('Error unarchiving submission:', e);
    return false;
  }
}

export function getArchivedSubmissions() {
  return getAllSubmissions().filter(s => s.status === WORKFLOW_STATUS.ARCHIVED);
}

export function getActiveSubmissions() {
  return getAllSubmissions().filter(s => s.status !== WORKFLOW_STATUS.ARCHIVED);
}

