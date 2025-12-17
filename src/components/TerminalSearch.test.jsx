import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TerminalSearch from './TerminalSearch';
import { stations } from '../data/railNetwork';

describe('TerminalSearch Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input', () => {
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search freight yards...');
  });

  it('should display selected station when value is provided', () => {
    render(<TerminalSearch value="CHI" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input.value).toContain('Chicago');
    expect(input.value).toContain('CHI');
  });

  it('should show dropdown when typing', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Chi');
    
    await waitFor(() => {
      expect(screen.getByText(/Chicago/i)).toBeInTheDocument();
    });
  });

  it('should filter stations by search term', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Kansas');
    
    await waitFor(() => {
      expect(screen.getByText(/Kansas City/i)).toBeInTheDocument();
    });
    
    // Should not show unrelated stations
    expect(screen.queryByText(/Los Angeles/i)).not.toBeInTheDocument();
  });

  it('should call onChange when station is selected', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Chi');
    
    await waitFor(() => {
      const option = screen.getByText(/Chicago/i);
      expect(option).toBeInTheDocument();
    });
    
    const option = screen.getByText(/Chicago/i);
    await user.click(option);
    
    expect(mockOnChange).toHaveBeenCalledWith('CHI');
  });

  it('should show clear button when station is selected', () => {
    render(<TerminalSearch value="CHI" onChange={mockOnChange} />);
    
    const clearButton = screen.getByLabelText(/Clear selection/i);
    expect(clearButton).toBeInTheDocument();
  });

  it('should clear selection when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="CHI" onChange={mockOnChange} />);
    
    const clearButton = screen.getByLabelText(/Clear selection/i);
    await user.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'C');
    
    await waitFor(() => {
      expect(screen.getByText(/Chicago/i)).toBeInTheDocument();
    });
    
    // Press ArrowDown to highlight first option
    await user.keyboard('{ArrowDown}');
    
    // Press Enter to select
    await user.keyboard('{Enter}');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should close dropdown when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Chi');
    
    await waitFor(() => {
      expect(screen.getByText(/Chicago/i)).toBeInTheDocument();
    });
    
    await user.keyboard('{Escape}');
    
    // Dropdown should close (option no longer visible)
    await waitFor(() => {
      expect(screen.queryByText(/Chicago/i)).not.toBeInTheDocument();
    });
  });

  it('should show "No terminals found" when no matches', async () => {
    const user = userEvent.setup();
    render(<TerminalSearch value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'XYZ123');
    
    await waitFor(() => {
      expect(screen.getByText(/No freight yards found matching/i)).toBeInTheDocument();
    });
  });

  it('should accept custom placeholder', () => {
    render(<TerminalSearch value="" onChange={mockOnChange} placeholder="Custom placeholder" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
  });

  it('should accept custom label', () => {
    render(<TerminalSearch value="" onChange={mockOnChange} label="Shipping Origin Yard" />);
    
    expect(screen.getByText(/Shipping Origin Yard/i)).toBeInTheDocument();
  });
});

