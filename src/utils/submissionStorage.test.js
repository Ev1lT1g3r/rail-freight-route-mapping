import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAllSubmissions,
  saveSubmission,
  getSubmissionById,
  deleteSubmission,
  createSubmissionId,
  WORKFLOW_STATUS
} from './submissionStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

global.localStorage = localStorageMock;

describe('Submission Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAllSubmissions', () => {
    it('should return empty array when no submissions exist', () => {
      const submissions = getAllSubmissions();
      expect(submissions).toEqual([]);
    });

    it('should return all submissions from localStorage', () => {
      const mockSubmissions = [
        { id: '1', status: WORKFLOW_STATUS.DRAFT },
        { id: '2', status: WORKFLOW_STATUS.SUBMITTED }
      ];
      localStorage.setItem('rail_freight_submissions', JSON.stringify(mockSubmissions));
      
      const submissions = getAllSubmissions();
      expect(submissions).toHaveLength(2);
    });
  });

  describe('saveSubmission', () => {
    it('should save a new submission', () => {
      const submission = {
        id: 'test-1',
        origin: 'CHI',
        destination: 'KC',
        status: WORKFLOW_STATUS.DRAFT
      };
      
      const result = saveSubmission(submission);
      expect(result).toBe(true);
      
      const saved = getAllSubmissions();
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('test-1');
    });

    it('should update existing submission', () => {
      const submission1 = { id: 'test-1', status: WORKFLOW_STATUS.DRAFT };
      const submission2 = { id: 'test-1', status: WORKFLOW_STATUS.SUBMITTED };
      
      saveSubmission(submission1);
      saveSubmission(submission2);
      
      const saved = getAllSubmissions();
      expect(saved).toHaveLength(1);
      expect(saved[0].status).toBe(WORKFLOW_STATUS.SUBMITTED);
    });
  });

  describe('getSubmissionById', () => {
    it('should return submission by id', () => {
      const submission = { id: 'test-1', origin: 'CHI' };
      saveSubmission(submission);
      
      const found = getSubmissionById('test-1');
      expect(found).toBeDefined();
      expect(found.id).toBe('test-1');
    });

    it('should return undefined for non-existent id', () => {
      const found = getSubmissionById('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('deleteSubmission', () => {
    it('should delete submission by id', () => {
      const submission = { id: 'test-1', origin: 'CHI' };
      saveSubmission(submission);
      
      const result = deleteSubmission('test-1');
      expect(result).toBe(true);
      
      const submissions = getAllSubmissions();
      expect(submissions).toHaveLength(0);
    });
  });

  describe('createSubmissionId', () => {
    it('should create unique submission ids', () => {
      const id1 = createSubmissionId();
      const id2 = createSubmissionId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^sub_/);
    });
  });

  describe('WORKFLOW_STATUS', () => {
    it('should have all required status values', () => {
      expect(WORKFLOW_STATUS.DRAFT).toBe('Draft');
      expect(WORKFLOW_STATUS.SUBMITTED).toBe('Submitted');
      expect(WORKFLOW_STATUS.PENDING_APPROVAL).toBe('Pending Approval');
      expect(WORKFLOW_STATUS.APPROVED).toBe('Approved');
      expect(WORKFLOW_STATUS.REJECTED).toBe('Rejected');
    });
  });
});

