// Local storage utility for submissions
// In a real app, this would connect to a backend API

const STORAGE_KEY = 'rail_freight_submissions';

export const WORKFLOW_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
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
    const submissions = getAllSubmissions();
    const existingIndex = submissions.findIndex(s => s.id === submission.id);
    
    if (existingIndex >= 0) {
      submissions[existingIndex] = submission;
    } else {
      submissions.push(submission);
    }
    
    // Sort by submission date (newest first)
    submissions.sort((a, b) => new Date(b.submittedDate || b.createdDate) - new Date(a.submittedDate || a.createdDate));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return true;
  } catch (e) {
    console.error('Error saving submission:', e);
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

