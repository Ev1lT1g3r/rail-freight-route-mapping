// Route finding algorithm with configurable parameters

import { connections, stations, getConnection } from '../data/railNetwork';

export function findRoutes(origin, destination, preferences) {
  const {
    weightDistance = 1.0,
    weightSingleOperator = 0.5,
    weightCurves = 0.3,
    maxTransfers = 5
  } = preferences || {};

  // Validate inputs
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  if (!stations[origin]) {
    throw new Error(`Origin station "${origin}" not found`);
  }

  if (!stations[destination]) {
    throw new Error(`Destination station "${destination}" not found`);
  }

  if (origin === destination) {
    return [];
  }

  // Use improved Dijkstra's algorithm with custom cost function
  const routes = [];
  const visited = new Map(); // Track best cost to each station via each path
  const queue = [{ 
    path: [origin], 
    cost: 0, 
    distance: 0, 
    operators: new Set(),
    totalCurves: 0,
    states: new Set()
  }];

  // Calculate max path length based on maxTransfers
  // maxTransfers = number of transfer points, so path length = maxTransfers + 2 (origin + destination)
  // But allow up to 15 stations for very long routes when maxTransfers is high
  const maxPathLength = maxTransfers >= 5 ? 15 : maxTransfers + 2;
  let iterations = 0;
  const maxIterations = 10000; // Prevent infinite loops

  while (queue.length > 0 && routes.length < 10 && iterations < maxIterations) {
    iterations++;
    
    // Sort queue by cost (best first)
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();
    const currentStation = current.path[current.path.length - 1];
    const pathKey = current.path.join('-');

    // Skip if we've already visited this exact path
    if (visited.has(pathKey)) continue;
    
    // Also skip if we've found a better path to this station
    const stationKey = `${currentStation}-${current.path.length}`;
    if (visited.has(stationKey)) {
      const bestCost = visited.get(stationKey);
      if (current.cost > bestCost * 1.5) continue; // Skip if significantly worse
    }
    
    visited.set(pathKey, current.cost);
    visited.set(stationKey, current.cost);

    if (currentStation === destination) {
      // Found a route
      try {
        const route = buildRouteDetails(current);
        if (route && route.segments && route.segments.length > 0) {
          routes.push(route);
          if (routes.length >= 3) break; // Get top 3
        }
      } catch (err) {
        // Skip this route and continue
      }
      continue;
    }

    // Allow longer paths for better route discovery
    if (current.path.length > maxPathLength) continue;

    // Explore neighbors
    const neighbors = connections.filter(conn => 
      conn.from === currentStation || conn.to === currentStation
    );

    // If no neighbors, skip
    if (neighbors.length === 0) continue;

    for (const conn of neighbors) {
      const nextStation = conn.from === currentStation ? conn.to : conn.from;
      
      // Avoid cycles (don't revisit stations in current path)
      if (current.path.includes(nextStation)) continue;

      const nextOperator = conn.operator;
      const nextDistance = current.distance + (conn.distance || 0);
      const nextOperators = new Set([...current.operators, nextOperator]);
      const nextCurves = current.totalCurves + (conn.curveScore || 0);
      const nextStates = new Set([...current.states, ...(conn.states || [])]);

      // Calculate cost based on preferences
      let cost = nextDistance * weightDistance;
      
      // Penalty for multiple operators
      if (nextOperators.size > 1) {
        cost += (nextOperators.size - 1) * 100 * weightSingleOperator;
      }
      
      // Penalty for curves
      cost += nextCurves * 10 * weightCurves;
      
      // Small penalty for path length to prefer shorter paths
      cost += current.path.length * 5;

      queue.push({
        path: [...current.path, nextStation],
        cost,
        distance: nextDistance,
        operators: nextOperators,
        totalCurves: nextCurves,
        states: nextStates
      });
    }
  }

  return routes.sort((a, b) => a.totalCost - b.totalCost).slice(0, 3);
}

function buildRouteDetails(routeData) {
  const path = routeData.path;
  const segments = [];
  const transferPoints = [];
  const allStates = new Set();
  let totalDistance = 0;
  const operators = new Set();

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    
    // Validate station codes exist
    if (!stations[from] || !stations[to]) {
      console.warn(`Invalid station code in path: ${from} or ${to}`);
      continue;
    }
    
    const conn = getConnection(from, to);
    
    if (conn) {
      segments.push({
        from: stations[from],
        to: stations[to],
        distance: conn.distance,
        operator: conn.operator,
        curveScore: conn.curveScore,
        states: conn.states || []
      });
      
      totalDistance += conn.distance;
      operators.add(conn.operator);
      if (conn.states) {
        conn.states.forEach(state => allStates.add(state));
      }
      
      // Check for transfer (operator change)
      if (i > 0) {
        const prevConn = getConnection(path[i - 1], path[i]);
        if (prevConn && prevConn.operator !== conn.operator) {
          transferPoints.push({
            station: stations[from],
            fromOperator: prevConn.operator,
            toOperator: conn.operator
          });
        }
      }
    } else {
      console.warn(`No connection found between ${from} and ${to}`);
    }
  }

  // Validate we have at least one segment
  if (segments.length === 0) {
    // Return null instead of throwing - let caller handle it
    return null;
  }

  // Map path codes to station objects, filtering out any invalid ones
  const pathStations = path
    .map(code => stations[code])
    .filter(station => station !== undefined);

  if (pathStations.length === 0) {
    // Return null instead of throwing - let caller handle it
    return null;
  }

  return {
    path: pathStations,
    segments,
    totalDistance: Math.round(totalDistance),
    operators: Array.from(operators),
    transferPoints,
    states: Array.from(allStates).sort(),
    totalCost: routeData.cost,
    operatorCount: operators.size,
    totalCurves: routeData.totalCurves
  };
}

