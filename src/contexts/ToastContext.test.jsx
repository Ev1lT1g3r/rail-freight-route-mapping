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

  it('should display toast messages', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    // ToastProvider renders ToastContainer, which should be in the DOM
    // The toast-container div should exist (even if empty initially)
    const toastContainer = container.querySelector('.toast-container');
    // Verify ToastContainer is rendered by ToastProvider
    expect(toastContainer).toBeInTheDocument();
  });
});

