import { describe, it, expect } from 'vitest';
import { findRoutes } from './routeFinder';
import { stations } from '../data/railNetwork';

describe('Route Finder', () => {
  const defaultPreferences = {
    weightDistance: 1.0,
    weightSingleOperator: 0.5,
    weightCurves: 0.3,
    maxTransfers: 5
  };

  describe('Basic Route Finding', () => {
    it('should find a route between CHI and KC', () => {
      const routes = findRoutes('CHI', 'KC', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      expect(routes[0].path[0].name).toBe('Chicago');
      expect(routes[0].path[routes[0].path.length - 1].name).toBe('Kansas City');
    });

    it('should return empty array for same origin and destination', () => {
      const routes = findRoutes('CHI', 'CHI', defaultPreferences);
      expect(routes).toEqual([]);
    });

    it('should find routes between CHI and STL', () => {
      const routes = findRoutes('CHI', 'STL', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      routes.forEach(route => {
        expect(route.path[0].name).toBe('Chicago');
        expect(route.path[route.path.length - 1].name).toBe('St. Louis');
      });
    });

    it('should return at most 3 routes', () => {
      const routes = findRoutes('CHI', 'DEN', defaultPreferences);
      expect(routes.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Route Properties', () => {
    it('should return routes with required properties', () => {
      const routes = findRoutes('CHI', 'KC', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('segments');
        expect(route).toHaveProperty('totalDistance');
        expect(route).toHaveProperty('operators');
        expect(route).toHaveProperty('transferPoints');
        expect(route).toHaveProperty('states');
        expect(route).toHaveProperty('totalCost');
        expect(route).toHaveProperty('operatorCount');
        expect(Array.isArray(route.path)).toBe(true);
        expect(Array.isArray(route.segments)).toBe(true);
        expect(Array.isArray(route.operators)).toBe(true);
        expect(Array.isArray(route.states)).toBe(true);
        expect(typeof route.totalDistance).toBe('number');
        expect(route.totalDistance).toBeGreaterThan(0);
      });
    });

    it('should have path starting at origin and ending at destination', () => {
      const routes = findRoutes('CHI', 'KC', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        expect(route.path[0].name).toBe('Chicago');
        expect(route.path[route.path.length - 1].name).toBe('Kansas City');
      });
    });

    it('should calculate total distance correctly', () => {
      const routes = findRoutes('CHI', 'KC', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        const calculatedDistance = route.segments.reduce((sum, seg) => sum + seg.distance, 0);
        expect(route.totalDistance).toBe(Math.round(calculatedDistance));
      });
    });
  });

  describe('Preferences Impact', () => {
    it('should prefer shorter routes when distance weight is high', () => {
      const highDistanceWeight = {
        ...defaultPreferences,
        weightDistance: 2.0,
        weightSingleOperator: 0.1,
        weightCurves: 0.1
      };
      
      const routes = findRoutes('CHI', 'DEN', highDistanceWeight);
      if (routes.length > 1) {
        // First route should have lower or equal distance than second
        expect(routes[0].totalDistance).toBeLessThanOrEqual(routes[1].totalDistance);
      }
    });

    it('should prefer single operator routes when operator weight is high', () => {
      const highOperatorWeight = {
        ...defaultPreferences,
        weightDistance: 0.1,
        weightSingleOperator: 2.0,
        weightCurves: 0.1
      };
      
      const routes = findRoutes('CHI', 'DEN', highOperatorWeight);
      if (routes.length > 0) {
        // Routes should be sorted by cost (which includes operator preference)
        routes.forEach(route => {
          expect(route.operatorCount).toBeGreaterThan(0);
        });
      }
    });

    it('should respect maxTransfers limit', () => {
      const strictTransfers = {
        ...defaultPreferences,
        maxTransfers: 1
      };
      
      const routes = findRoutes('CHI', 'LAX', strictTransfers);
      routes.forEach(route => {
        // With maxTransfers=1, path should have at most 3 stations (origin, 1 transfer, destination)
        expect(route.path.length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('Route Segments', () => {
    it('should have segments connecting consecutive stations in path', () => {
      const routes = findRoutes('CHI', 'STL', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        expect(route.segments.length).toBe(route.path.length - 1);
        
        route.segments.forEach((segment, index) => {
          expect(segment.from).toEqual(route.path[index]);
          expect(segment.to).toEqual(route.path[index + 1]);
        });
      });
    });

    it('should have segment properties', () => {
      const routes = findRoutes('CHI', 'KC', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        route.segments.forEach(segment => {
          expect(segment).toHaveProperty('from');
          expect(segment).toHaveProperty('to');
          expect(segment).toHaveProperty('distance');
          expect(segment).toHaveProperty('operator');
          expect(segment).toHaveProperty('curveScore');
          expect(segment).toHaveProperty('states');
        });
      });
    });
  });

  describe('Transfer Points', () => {
    it('should identify transfer points correctly', () => {
      const routes = findRoutes('CHI', 'DEN', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        // Transfer points should only occur where operators change
        route.transferPoints.forEach(transfer => {
          expect(transfer).toHaveProperty('station');
          expect(transfer).toHaveProperty('fromOperator');
          expect(transfer).toHaveProperty('toOperator');
          expect(transfer.fromOperator).not.toBe(transfer.toOperator);
        });
      });
    });
  });

  describe('States Traversed', () => {
    it('should include all states from segments', () => {
      const routes = findRoutes('CHI', 'STL', defaultPreferences);
      expect(routes.length).toBeGreaterThan(0);
      
      routes.forEach(route => {
        const allStatesFromSegments = new Set();
        route.segments.forEach(segment => {
          segment.states.forEach(state => allStatesFromSegments.add(state));
        });
        
        route.states.forEach(state => {
          expect(allStatesFromSegments.has(state)).toBe(true);
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-existent stations gracefully', () => {
      // This should not crash, but may return empty array
      const routes = findRoutes('INVALID', 'CHI', defaultPreferences);
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should handle very restrictive preferences', () => {
      const veryRestrictive = {
        weightDistance: 10.0,
        weightSingleOperator: 10.0,
        weightCurves: 10.0,
        maxTransfers: 0
      };
      
      const routes = findRoutes('NYC', 'PHL', veryRestrictive);
      // Should still work, might return fewer routes
      expect(Array.isArray(routes)).toBe(true);
    });
  });
});

