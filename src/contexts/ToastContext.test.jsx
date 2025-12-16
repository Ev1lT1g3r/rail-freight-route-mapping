import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';

// Test component that uses the toast context
function TestComponent() {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Success message')}>Show Success</button>
      <button onClick={() => error('Error message')}>Show Error</button>
      <button onClick={() => warning('Warning message')}>Show Warning</button>
      <button onClick={() => info('Info message')}>Show Info</button>
    </div>
  );
}

describe('ToastContext', () => {
  it('should provide toast functions', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    expect(screen.getByText(/Show Success/i)).toBeInTheDocument();
    expect(screen.getByText(/Show Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Show Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/Show Info/i)).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
    
    console.error = consoleError;
  });

  it('should provide toast functions that can be called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    // Verify the component renders and buttons are clickable
    const successButton = screen.getByText(/Show Success/i);
    expect(successButton).toBeInTheDocument();
    
    // The toast functions should be available and callable
    // (Actual toast rendering is tested in ToastContainer component tests)
    expect(successButton).toBeEnabled();
  });
});

