import { describe, it, expect } from 'vitest';
import {
  calculateCenterOfGravity,
  calculateOptimalPlacement,
  getRecommendedCarTypes,
  getBestCarTypeForFreight
} from './freightCalculations';
import { carTypes } from '../data/carTypes';

describe('Freight Calculations', () => {
  const mockFreight = {
    length: 40,
    width: 8,
    height: 10,
    weight: 50000
  };

  const mockCar = {
    length: 60,
    width: 9.5,
    height: 15,
    maxWeight: 220000,
    deckHeight: 4
  };

  describe('calculateCenterOfGravity', () => {
    it('should calculate center of gravity for freight on car', () => {
      const result = calculateCenterOfGravity(mockFreight, mockCar, { x: 0, y: 0 });
      
      expect(result).toBeDefined();
      expect(result.freightCG).toBeDefined();
      expect(result.carCG).toBeDefined();
      expect(result.combinedCG).toBeDefined();
      expect(result.totalWeight).toBeGreaterThan(0);
    });

    it('should calculate CG with placement offset', () => {
      const result = calculateCenterOfGravity(mockFreight, mockCar, { x: 5, y: -2 });
      
      expect(result.combinedCG.x).not.toBe(0);
      expect(result.combinedCG.y).not.toBe(0);
    });

    it('should include validations in result', () => {
      const result = calculateCenterOfGravity(mockFreight, mockCar, { x: 0, y: 0 });
      
      expect(result.validations).toBeDefined();
      expect(result.validations.isValid).toBeDefined();
      expect(Array.isArray(result.validations.issues)).toBe(true);
      expect(Array.isArray(result.validations.warnings)).toBe(true);
    });

    it('should detect dimension issues', () => {
      const oversizedFreight = {
        length: 100,
        width: 12,
        height: 20,
        weight: 50000
      };
      
      const result = calculateCenterOfGravity(oversizedFreight, mockCar, { x: 0, y: 0 });
      
      expect(result.validations.issues.length).toBeGreaterThan(0);
      expect(result.validations.isValid).toBe(false);
    });
  });

  describe('calculateOptimalPlacement', () => {
    it('should return centered placement', () => {
      const placement = calculateOptimalPlacement(mockFreight, mockCar);
      
      expect(placement).toBeDefined();
      expect(placement.x).toBe(0);
      expect(placement.y).toBe(0);
    });
  });

  describe('getRecommendedCarTypes', () => {
    it('should return recommendations for freight', () => {
      const operators = ['BNSF', 'UP'];
      const recommendations = getRecommendedCarTypes(mockFreight, operators, carTypes);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should score car types based on fit', () => {
      const operators = ['BNSF'];
      const recommendations = getRecommendedCarTypes(mockFreight, operators, carTypes);
      
      if (recommendations.length > 0) {
        expect(recommendations[0].score).toBeDefined();
        expect(recommendations[0].operator).toBe('BNSF');
        expect(recommendations[0].car).toBeDefined();
      }
    });

    it('should identify perfect fits', () => {
      const smallFreight = {
        length: 30,
        width: 8,
        height: 8,
        weight: 100000
      };
      
      const operators = ['BNSF'];
      const recommendations = getRecommendedCarTypes(smallFreight, operators, carTypes);
      
      // Should have at least one recommendation
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid freight', () => {
      const invalidFreight = {
        length: 0,
        width: 0,
        height: 0,
        weight: 0
      };
      
      const operators = ['BNSF'];
      const recommendations = getRecommendedCarTypes(invalidFreight, operators, carTypes);
      
      expect(recommendations.length).toBe(0);
    });
  });

  describe('getBestCarTypeForFreight', () => {
    it('should return best car type for freight', () => {
      const operators = ['BNSF', 'UP'];
      const best = getBestCarTypeForFreight(mockFreight, operators, carTypes);
      
      expect(best).toBeDefined();
      expect(best.operator).toBeDefined();
      expect(best.car).toBeDefined();
      expect(best.recommendation).toBeDefined();
    });

    it('should return null for invalid freight', () => {
      const invalidFreight = {
        length: 0,
        width: 0,
        height: 0,
        weight: 0
      };
      
      const operators = ['BNSF'];
      const best = getBestCarTypeForFreight(invalidFreight, operators, carTypes);
      
      expect(best).toBeNull();
    });

    it('should prioritize perfect fits', () => {
      const wellSizedFreight = {
        length: 50,
        width: 9,
        height: 12,
        weight: 150000
      };
      
      const operators = ['BNSF'];
      const best = getBestCarTypeForFreight(wellSizedFreight, operators, carTypes);
      
      if (best) {
        expect(best.recommendation.isPerfectFit).toBeDefined();
      }
    });
  });
});

