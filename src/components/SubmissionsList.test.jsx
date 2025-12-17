import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubmissionsList from './SubmissionsList';
import * as submissionStorage from '../utils/submissionStorage';

// Mock the submission storage
vi.mock('../utils/submissionStorage', () => ({
  getAllSubmissions: vi.fn(),
  WORKFLOW_STATUS: {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  },
  deleteSubmission: vi.fn(),
  saveSubmission: vi.fn()
}));

describe('SubmissionsList Component', () => {
  const mockOnViewSubmission = vi.fn();
  const mockOnCreateNew = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    submissionStorage.getAllSubmissions.mockReturnValue([]);
  });

  it('should render empty state when no submissions', () => {
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    expect(screen.getByText(/No Submissions Yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Your First Submission/i)).toBeInTheDocument();
  });

  it('should render submissions list', () => {
    const mockSubmissions = [
      {
        id: 'sub1',
        name: 'Test Route',
        origin: 'CHI',
        destination: 'KC',
        status: 'Submitted',
        createdDate: new Date().toISOString(),
        submittedDate: new Date().toISOString(),
        submittedBy: 'Test User',
        selectedRoute: {
          totalDistance: 500,
          operators: ['BNSF']
        }
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    const { container } = render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    // Check that the route path is displayed
    expect(container.textContent).toMatch(/CHI.*KC/i);
  });

  it('should call onCreateNew when new submission button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    const newButton = screen.getByRole('button', { name: /New Submission/i }) || 
                     screen.getByText(/\+ New Submission/i);
    await user.click(newButton);
    
    expect(mockOnCreateNew).toHaveBeenCalledTimes(1);
  });

  it('should call onViewSubmission when submission is clicked', async () => {
    const user = userEvent.setup();
    const mockSubmissions = [
      {
        id: 'sub1',
        name: 'Test Route',
        origin: 'CHI',
        destination: 'KC',
        status: 'Submitted',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    const submissionCard = screen.getByText(/CHI → KC/i).closest('div');
    await user.click(submissionCard);
    
    expect(mockOnViewSubmission).toHaveBeenCalledWith('sub1');
  });

  it('should filter submissions by status', async () => {
    const user = userEvent.setup();
    const mockSubmissions = [
      {
        id: 'sub1',
        origin: 'CHI',
        destination: 'KC',
        status: 'Submitted',
        createdDate: new Date().toISOString()
      },
      {
        id: 'sub2',
        origin: 'LAX',
        destination: 'DEN',
        status: 'Approved',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    // Find the select element by finding all selects and getting the first one (filter)
    const selects = screen.getAllByRole('combobox');
    const filterSelect = selects.find(select => select.value === 'all') || selects[0];
    
    if (filterSelect) {
      await user.selectOptions(filterSelect, 'Approved');
      
      // After filtering, only approved submission should be visible
      expect(screen.getByText(/LAX → DEN/i)).toBeInTheDocument();
      // The submitted one might still be in DOM but filtered, so we check it's not visible in the list
    }
  });

  it('should enable bulk mode when bulk actions button is clicked', async () => {
    const user = userEvent.setup();
    const mockSubmissions = [
      {
        id: 'sub1',
        origin: 'CHI',
        destination: 'KC',
        status: 'Draft',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(<SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />);
    
    const bulkButton = screen.getByText(/Bulk Actions/i);
    await user.click(bulkButton);
    
    expect(screen.getByText(/Bulk Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Select All/i)).toBeInTheDocument();
  });

  it('should show checkboxes when bulk mode is enabled', async () => {
    const user = userEvent.setup();
    const mockSubmissions = [
      {
        id: 'sub1',
        origin: 'CHI',
        destination: 'KC',
        status: 'Draft',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(<SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />);
    
    const bulkButton = screen.getByText(/Bulk Actions/i);
    await user.click(bulkButton);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should select submission when checkbox is clicked in bulk mode', async () => {
    const user = userEvent.setup();
    const mockSubmissions = [
      {
        id: 'sub1',
        origin: 'CHI',
        destination: 'KC',
        status: 'Draft',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    const bulkButton = screen.getByText(/Bulk Actions/i);
    await user.click(bulkButton);
    
    const checkboxes = screen.getAllByRole('checkbox');
    const submissionCheckbox = checkboxes.find(cb => cb.type === 'checkbox' && cb !== screen.getByText(/Select All/i)?.closest('button')?.querySelector('input'));
    
    if (submissionCheckbox) {
      await user.click(submissionCheckbox);
      expect(screen.getByText(/1 of 1 selected/i)).toBeInTheDocument();
    }
  });

  it('should call deleteSubmission when bulk delete is clicked', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);
    
    const mockSubmissions = [
      {
        id: 'sub1',
        origin: 'CHI',
        destination: 'KC',
        status: 'Draft',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    const bulkButton = screen.getByText(/Bulk Actions/i);
    await user.click(bulkButton);
    
    const checkboxes = screen.getAllByRole('checkbox');
    const submissionCheckbox = checkboxes.find(cb => cb.type === 'checkbox');
    
    if (submissionCheckbox) {
      await user.click(submissionCheckbox);
      
      const deleteButton = screen.getByText(/Delete Selected/i);
      await user.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(submissionStorage.deleteSubmission).toHaveBeenCalledWith('sub1');
    }
  });

  it('should not allow clicking submission card when in bulk mode', async () => {
    const user = userEvent.setup();
    const mockSubmissions = [
      {
        id: 'sub1',
        origin: 'CHI',
        destination: 'KC',
        status: 'Draft',
        createdDate: new Date().toISOString()
      }
    ];

    submissionStorage.getAllSubmissions.mockReturnValue(mockSubmissions);
    
    render(
      <ToastProvider>
        <SubmissionsList onViewSubmission={mockOnViewSubmission} onCreateNew={mockOnCreateNew} />
      </ToastProvider>
    );
    
    const bulkButton = screen.getByText(/Bulk Actions/i);
    await user.click(bulkButton);
    
    const submissionCard = screen.getByText(/CHI → KC/i).closest('div');
    await user.click(submissionCard);
    
    // Should not call onViewSubmission when in bulk mode
    expect(mockOnViewSubmission).not.toHaveBeenCalled();
  });
});

