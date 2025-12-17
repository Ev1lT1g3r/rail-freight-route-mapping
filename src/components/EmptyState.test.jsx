import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('should render with title and message', () => {
    render(<EmptyState title="Test Title" message="Test message" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    render(<EmptyState icon="🚀" title="Test" />);
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const handleAction = () => {};
    render(
      <EmptyState
        title="Test"
        actionLabel="Click Me"
        onAction={handleAction}
      />
    );
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should render secondary action button when provided', () => {
    const handleSecondary = () => {};
    render(
      <EmptyState
        title="Test"
        secondaryActionLabel="Secondary"
        onSecondaryAction={handleSecondary}
      />
    );
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('should not render action buttons when not provided', () => {
    render(<EmptyState title="Test" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should handle action button click', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Test"
        actionLabel="Click Me"
        onAction={handleAction}
      />
    );
    screen.getByText('Click Me').click();
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

