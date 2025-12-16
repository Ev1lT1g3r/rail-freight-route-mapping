import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';
import { WORKFLOW_STATUS } from '../utils/submissionStorage';

describe('StatusBadge Component', () => {
  it('should render approved status badge', () => {
    render(<StatusBadge status={WORKFLOW_STATUS.APPROVED} />);
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
  });

  it('should render rejected status badge', () => {
    render(<StatusBadge status={WORKFLOW_STATUS.REJECTED} />);
    expect(screen.getByText(/Rejected/i)).toBeInTheDocument();
  });

  it('should render draft status badge', () => {
    render(<StatusBadge status={WORKFLOW_STATUS.DRAFT} />);
    expect(screen.getByText(/Draft/i)).toBeInTheDocument();
  });

  it('should render submitted status badge', () => {
    render(<StatusBadge status={WORKFLOW_STATUS.SUBMITTED} />);
    expect(screen.getByText(/Submitted/i)).toBeInTheDocument();
  });

  it('should render pending approval status badge', () => {
    render(<StatusBadge status={WORKFLOW_STATUS.PENDING_APPROVAL} />);
    expect(screen.getByText(/Pending Approval/i)).toBeInTheDocument();
  });

  it('should support different sizes', () => {
    const { container: small } = render(<StatusBadge status={WORKFLOW_STATUS.APPROVED} size="small" />);
    const { container: medium } = render(<StatusBadge status={WORKFLOW_STATUS.APPROVED} size="medium" />);
    const { container: large } = render(<StatusBadge status={WORKFLOW_STATUS.APPROVED} size="large" />);
    
    expect(small).toBeInTheDocument();
    expect(medium).toBeInTheDocument();
    expect(large).toBeInTheDocument();
  });

  it('should handle unknown status gracefully', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />);
    expect(screen.getByText(/Unknown/i)).toBeInTheDocument();
  });
});

