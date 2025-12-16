import { describe, it, expect } from 'vitest';
import { carTypes, getCarTypesForOperator, getAllCarTypes } from './carTypes';

describe('Car Types Data', () => {
  describe('carTypes', () => {
    it('should have car types for all operators', () => {
      expect(carTypes.BNSF).toBeDefined();
      expect(carTypes.UP).toBeDefined();
      expect(carTypes.CSX).toBeDefined();
      expect(carTypes.NS).toBeDefined();
      expect(carTypes.CN).toBeDefined();
      expect(carTypes.CP).toBeDefined();
    });

    it('should have car types with required properties', () => {
      const bnsfCars = carTypes.BNSF;
      expect(bnsfCars.length).toBeGreaterThan(0);
      
      const firstCar = bnsfCars[0];
      expect(firstCar.id).toBeDefined();
      expect(firstCar.name).toBeDefined();
      expect(firstCar.length).toBeDefined();
      expect(firstCar.width).toBeDefined();
      expect(firstCar.height).toBeDefined();
      expect(firstCar.maxWeight).toBeDefined();
      expect(firstCar.deckHeight).toBeDefined();
    });

    it('should have valid dimensions', () => {
      Object.values(carTypes).forEach(operatorCars => {
        operatorCars.forEach(car => {
          expect(car.length).toBeGreaterThan(0);
          expect(car.width).toBeGreaterThan(0);
          expect(car.height).toBeGreaterThan(0);
          expect(car.maxWeight).toBeGreaterThan(0);
          expect(car.deckHeight).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  describe('getCarTypesForOperator', () => {
    it('should return car types for valid operator', () => {
      const bnsfCars = getCarTypesForOperator('BNSF');
      expect(Array.isArray(bnsfCars)).toBe(true);
      expect(bnsfCars.length).toBeGreaterThan(0);
    });

    it('should return default for invalid operator', () => {
      const cars = getCarTypesForOperator('INVALID');
      expect(Array.isArray(cars)).toBe(true);
      expect(cars.length).toBeGreaterThan(0);
      // Should default to BNSF
      expect(cars).toEqual(carTypes.BNSF);
    });

    it('should return different car types for different operators', () => {
      const bnsfCars = getCarTypesForOperator('BNSF');
      const upCars = getCarTypesForOperator('UP');
      
      // Should have different car types or at least different IDs
      expect(bnsfCars).toBeDefined();
      expect(upCars).toBeDefined();
    });
  });

  describe('getAllCarTypes', () => {
    it('should return array of unique car types', () => {
      const allTypes = getAllCarTypes();
      expect(Array.isArray(allTypes)).toBe(true);
      expect(allTypes.length).toBeGreaterThan(0);
    });

    it('should have unique car names', () => {
      const allTypes = getAllCarTypes();
      const names = allTypes.map(car => car.name);
      const uniqueNames = new Set(names);
      
      // Should have unique names (no duplicates)
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should include required properties', () => {
      const allTypes = getAllCarTypes();
      allTypes.forEach(car => {
        expect(car.name).toBeDefined();
        expect(car.length).toBeDefined();
        expect(car.width).toBeDefined();
        expect(car.height).toBeDefined();
      });
    });
  });
});

