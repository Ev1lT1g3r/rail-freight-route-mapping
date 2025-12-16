import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FreightSpecification from './FreightSpecification';

describe('FreightSpecification Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render freight specification form', () => {
    render(<FreightSpecification freight={null} onFreightChange={mockOnChange} />);
    
    expect(screen.getByText(/Freight Specifications/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Freight Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Length \(feet\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Width \(feet\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height \(feet\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight \(pounds\)/i)).toBeInTheDocument();
  });

  it('should call onFreightChange when dimensions are entered', async () => {
    const user = userEvent.setup();
    render(<FreightSpecification freight={null} onFreightChange={mockOnChange} />);
    
    const lengthInput = screen.getByLabelText(/Length \(feet\)/i);
    await user.type(lengthInput, '20');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should display volume calculation when dimensions are provided', () => {
    const freight = {
      description: 'Test Freight',
      length: 10,
      width: 8,
      height: 6,
      weight: 5000
    };
    
    const { container } = render(<FreightSpecification freight={freight} onFreightChange={mockOnChange} />);
    
    // Check that volume text appears in the component
    expect(container.textContent).toMatch(/Volume/i);
    expect(container.textContent).toMatch(/480/i);
  });

  it('should display density when weight and dimensions are provided', () => {
    const freight = {
      description: 'Test Freight',
      length: 10,
      width: 8,
      height: 6,
      weight: 5000
    };
    
    const { container } = render(<FreightSpecification freight={freight} onFreightChange={mockOnChange} />);
    
    // Check that density text appears
    expect(container.textContent).toMatch(/Density/i);
  });

  it('should have file upload input', () => {
    render(<FreightSpecification freight={null} onFreightChange={mockOnChange} />);
    
    // Check that file input exists (may not have accessible label)
    const fileInputs = document.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBeGreaterThan(0);
  });
});

