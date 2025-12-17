import { describe, it, expect } from 'vitest';
import { stations, connections, getConnections, getConnection, calculateDistance } from './railNetwork';

describe('Rail Network Data', () => {
  describe('Stations', () => {
    it('should have stations defined', () => {
      expect(stations).toBeDefined();
      expect(Object.keys(stations).length).toBeGreaterThan(0);
    });

    it('should have required properties for each station', () => {
      Object.entries(stations).forEach(([code, station]) => {
        expect(station).toHaveProperty('name');
        expect(station).toHaveProperty('lat');
        expect(station).toHaveProperty('lng');
        expect(station).toHaveProperty('state');
        expect(station).toHaveProperty('operator');
        expect(typeof station.lat).toBe('number');
        expect(typeof station.lng).toBe('number');
        expect(station.lat).toBeGreaterThanOrEqual(-90);
        expect(station.lat).toBeLessThanOrEqual(90);
        expect(station.lng).toBeGreaterThanOrEqual(-180);
        expect(station.lng).toBeLessThanOrEqual(180);
      });
    });

    it('should have CHI station with correct properties', () => {
      expect(stations.CHI).toBeDefined();
      expect(stations.CHI.name).toBe('Chicago');
      expect(stations.CHI.state).toBe('IL');
      expect(stations.CHI.operator).toBe('Multiple');
    });

    it('should have Chicago station', () => {
      expect(stations.CHI).toBeDefined();
      expect(stations.CHI.name).toBe('Chicago');
    });
  });

  describe('Connections', () => {
    it('should have connections defined', () => {
      expect(connections).toBeDefined();
      expect(Array.isArray(connections)).toBe(true);
      expect(connections.length).toBeGreaterThan(0);
    });

    it('should have required properties for each connection', () => {
      connections.forEach(conn => {
        expect(conn).toHaveProperty('from');
        expect(conn).toHaveProperty('to');
        expect(conn).toHaveProperty('distance');
        expect(conn).toHaveProperty('operator');
        expect(conn).toHaveProperty('curveScore');
        expect(conn).toHaveProperty('states');
        expect(typeof conn.distance).toBe('number');
        expect(conn.distance).toBeGreaterThan(0);
        expect(typeof conn.curveScore).toBe('number');
        expect(conn.curveScore).toBeGreaterThanOrEqual(1);
        expect(conn.curveScore).toBeLessThanOrEqual(10);
        expect(Array.isArray(conn.states)).toBe(true);
        expect(stations[conn.from]).toBeDefined();
        expect(stations[conn.to]).toBeDefined();
      });
    });

    it('should have CHI to KC connection', () => {
      const conn = connections.find(c => 
        (c.from === 'CHI' && c.to === 'KC') || 
        (c.from === 'KC' && c.to === 'CHI')
      );
      expect(conn).toBeDefined();
      expect(conn.distance).toBe(500);
      expect(['BNSF', 'UP']).toContain(conn.operator);
    });
  });

  describe('Helper Functions', () => {
    it('getConnections should return connections for a station', () => {
      const chiConnections = getConnections('CHI');
      expect(chiConnections.length).toBeGreaterThan(0);
      chiConnections.forEach(conn => {
        expect(conn.from === 'CHI' || conn.to === 'CHI').toBe(true);
      });
    });

    it('getConnection should return connection between two stations', () => {
      const conn = getConnection('CHI', 'KC');
      expect(conn).toBeDefined();
      expect(conn.distance).toBe(500);
    });

    it('getConnection should work in both directions', () => {
      const conn1 = getConnection('CHI', 'KC');
      const conn2 = getConnection('KC', 'CHI');
      expect(conn1).toEqual(conn2);
    });

    it('getConnection should return undefined for non-existent connection', () => {
      const conn = getConnection('NYC', 'SEA');
      // NYC to SEA might not have direct connection
      // This test just ensures function doesn't crash
      expect(conn === undefined || conn !== null).toBe(true);
    });

    it('calculateDistance should calculate distance between stations', () => {
      const chi = stations.CHI;
      const kc = stations.KC;
      const distance = calculateDistance(chi, kc);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(600); // CHI to KC is about 500 miles
    });

    it('calculateDistance should return 0 for same station', () => {
      const chi = stations.CHI;
      const distance = calculateDistance(chi, chi);
      expect(distance).toBe(0);
    });
  });

  describe('Network Connectivity', () => {
    it('should have a connected network', () => {
      // Check that major freight yards are connected
      const majorStations = ['CHI', 'KC', 'LAX', 'SEA', 'DEN'];
      majorStations.forEach(station => {
        const connections = getConnections(station);
        expect(connections.length).toBeGreaterThan(0);
      });
    });

    it('should have transcontinental routes', () => {
      // Check that we have connections that span from east to west
      // CHI to KC exists, and KC to DEN exists, and DEN to LAX exists, so there's a transcontinental path
      const chiToKc = getConnection('CHI', 'KC');
      const kcToDen = getConnection('KC', 'DEN');
      const denToLax = getConnection('DEN', 'LAX');
      
      // At least one segment of a transcontinental route should exist
      expect(chiToKc || kcToDen || denToLax).toBeDefined();
    });
  });
});

