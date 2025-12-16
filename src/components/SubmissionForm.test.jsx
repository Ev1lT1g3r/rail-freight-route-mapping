import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubmissionForm from './SubmissionForm';
import { ToastProvider } from '../contexts/ToastContext';
import { stations } from '../data/railNetwork';
import * as submissionStorage from '../utils/submissionStorage';

// Mock the submission storage
vi.mock('../utils/submissionStorage', () => ({
  saveSubmission: vi.fn(),
  createSubmissionId: vi.fn(() => 'test-id-123'),
  getSubmissionById: vi.fn(),
  WORKFLOW_STATUS: {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted'
  }
}));

// Mock MapComponent to avoid Leaflet issues in tests
vi.mock('./MapComponent', () => ({
  default: () => <div data-testid="map-component">Map Component</div>
}));

describe('SubmissionForm Component', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    submissionStorage.getSubmissionById.mockReturnValue(null);
  });

  it('should render submission form', () => {
    render(
      <ToastProvider>
        <SubmissionForm onSave={mockOnSave} onCancel={mockOnCancel} currentUser="Test User" />
      </ToastProvider>
    );
    
    expect(screen.getByText(/New Route Submission/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Origin Terminal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination Terminal/i)).toBeInTheDocument();
  });

  it('should call onCancel when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <SubmissionForm onSave={mockOnSave} onCancel={mockOnCancel} currentUser="Test User" />
      </ToastProvider>
    );
    
    const backButton = screen.getByText(/Back to List/i);
    await user.click(backButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should allow selecting origin and destination', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <SubmissionForm onSave={mockOnSave} onCancel={mockOnCancel} currentUser="Test User" />
      </ToastProvider>
    );
    
    const originSelect = screen.getByLabelText(/Origin Terminal/i);
    await user.selectOptions(originSelect, 'CHI');
    
    expect(originSelect.value).toBe('CHI');
    
    const destSelect = screen.getByLabelText(/Destination Terminal/i);
    await user.selectOptions(destSelect, 'KC');
    
    expect(destSelect.value).toBe('KC');
  });

  it('should show step navigation', () => {
    render(
      <ToastProvider>
        <SubmissionForm onSave={mockOnSave} onCancel={mockOnCancel} currentUser="Test User" />
      </ToastProvider>
    );
    
    expect(screen.getByText(/Route Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Freight Specification/i)).toBeInTheDocument();
    expect(screen.getByText(/Review & Submit/i)).toBeInTheDocument();
  });

  it('should allow saving as draft', async () => {
    const user = userEvent.setup();
    submissionStorage.saveSubmission.mockReturnValue(true);
    
    render(
      <ToastProvider>
        <SubmissionForm onSave={mockOnSave} onCancel={mockOnCancel} currentUser="Test User" />
      </ToastProvider>
    );
    
    const originSelect = screen.getByLabelText(/Origin Terminal/i);
    await user.selectOptions(originSelect, 'CHI');
    
    const destSelect = screen.getByLabelText(/Destination Terminal/i);
    await user.selectOptions(destSelect, 'KC');
    
    const draftButton = screen.getByText(/Save as Draft/i);
    await user.click(draftButton);
    
    expect(submissionStorage.saveSubmission).toHaveBeenCalled();
  });
});

