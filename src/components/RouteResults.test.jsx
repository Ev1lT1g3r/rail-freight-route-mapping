import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouteResults from './RouteResults';

describe('RouteResults Component', () => {
  const mockRoutes = [
    {
      path: [
        { name: 'Chicago', lat: 41.8781, lng: -87.6298, state: 'IL', operator: 'BNSF' },
        { name: 'Kansas City', lat: 39.0997, lng: -94.5786, state: 'MO', operator: 'BNSF' }
      ],
      segments: [
        {
          from: { name: 'Chicago' },
          to: { name: 'Kansas City' },
          distance: 500,
          operator: 'BNSF',
          curveScore: 5,
          states: ['IL', 'IA', 'MO']
        }
      ],
      totalDistance: 500,
      operators: ['BNSF'],
      transferPoints: [],
      states: ['IL', 'IA', 'MO'],
      totalCost: 500,
      operatorCount: 1,
      totalCurves: 5
    },
    {
      path: [
        { name: 'Chicago' },
        { name: 'St. Louis' },
        { name: 'Kansas City' }
      ],
      segments: [
        {
          from: { name: 'Chicago' },
          to: { name: 'St. Louis' },
          distance: 300,
          operator: 'UP',
          curveScore: 4,
          states: ['IL', 'MO']
        },
        {
          from: { name: 'St. Louis' },
          to: { name: 'Kansas City' },
          distance: 250,
          operator: 'UP',
          curveScore: 4,
          states: ['MO']
        }
      ],
      totalDistance: 550,
      operators: ['UP'],
      transferPoints: [],
      states: ['IL', 'MO'],
      totalCost: 550,
      operatorCount: 1,
      totalCurves: 8
    }
  ];

  it('should render "No routes found" when routes array is empty', () => {
    const mockOnSelect = vi.fn();
    render(<RouteResults routes={[]} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
    
    expect(screen.getByText(/No routes found/i)).toBeInTheDocument();
  });

  it('should render route cards when routes are provided', () => {
    const mockOnSelect = vi.fn();
    render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
    
    expect(screen.getByText(/Top 2 Routes Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Route #1/i)).toBeInTheDocument();
    expect(screen.getByText(/Route #2/i)).toBeInTheDocument();
  });

    it('should display route distance', () => {
      const mockOnSelect = vi.fn();
      const { container } = render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
      
      const distances = screen.getAllByText(/miles/i);
      expect(distances.length).toBeGreaterThanOrEqual(2);
      // Check that both distances appear somewhere in the document
      const allText = container.textContent;
      expect(allText).toContain('500');
      expect(allText).toContain('550');
    });

    it('should display route path', () => {
      const mockOnSelect = vi.fn();
      render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
      
      // Path appears in both the path summary and route details, so use getAllByText
      const paths = screen.getAllByText(/Chicago → Kansas City/i);
      expect(paths.length).toBeGreaterThan(0);
      expect(screen.getByText(/Chicago → St. Louis → Kansas City/i)).toBeInTheDocument();
    });

    it('should display operators', () => {
      const mockOnSelect = vi.fn();
      render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
      
      // Operators text appears multiple times (once per route)
      expect(screen.getAllByText(/Operators:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/BNSF/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/UP/i).length).toBeGreaterThan(0);
    });

    it('should display states traversed', () => {
      const mockOnSelect = vi.fn();
      render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
      
      // States text appears multiple times (once per route)
      expect(screen.getAllByText(/States\/Provinces:/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/IL, IA, MO/i)).toBeInTheDocument();
      expect(screen.getByText(/IL, MO/i)).toBeInTheDocument();
    });

  it('should call onRouteSelect when route is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
    
    const route1 = screen.getByText(/Route #1/i).closest('div');
    await user.click(route1);
    
    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

  it('should highlight selected route', () => {
    const mockOnSelect = vi.fn();
    const { container } = render(
      <RouteResults 
        routes={mockRoutes} 
        onRouteSelect={mockOnSelect} 
        selectedRouteIndex={0} 
      />
    );
    
    const selectedRoute = container.querySelector('[style*="border: 3px solid"]');
    expect(selectedRoute).toBeInTheDocument();
  });

  it('should display transfer points when present', () => {
      const routeWithTransfer = {
        ...mockRoutes[0],
        transferPoints: [
          {
            station: { name: 'Kansas City' },
            fromOperator: 'BNSF',
            toOperator: 'UP'
          }
        ]
      };
    
    const mockOnSelect = vi.fn();
    render(
      <RouteResults 
        routes={[routeWithTransfer]} 
        onRouteSelect={mockOnSelect} 
        selectedRouteIndex={null} 
      />
    );
    
    expect(screen.getByText(/Transfer Points/i)).toBeInTheDocument();
      expect(screen.getByText(/Kansas City: BNSF → UP/i)).toBeInTheDocument();
  });

  it('should display route details', () => {
    const mockOnSelect = vi.fn();
    render(<RouteResults routes={mockRoutes} onRouteSelect={mockOnSelect} selectedRouteIndex={null} />);
    
      expect(screen.getByText(/Chicago → Kansas City: 500 miles \(BNSF\)/i)).toBeInTheDocument();
  });
});

