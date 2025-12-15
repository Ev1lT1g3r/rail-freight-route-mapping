// Route finding algorithm with configurable parameters

import { connections, stations, getConnection } from '../data/railNetwork';

export function findRoutes(origin, destination, preferences) {
  const {
    weightDistance = 1.0,
    weightSingleOperator = 0.5,
    weightCurves = 0.3,
    maxTransfers = 5
  } = preferences;

  if (origin === destination) {
    return [];
  }

  // Use Dijkstra's algorithm with custom cost function
  const routes = [];
  const visited = new Set();
  const queue = [{ 
    path: [origin], 
    cost: 0, 
    distance: 0, 
    operators: new Set(),
    totalCurves: 0,
    states: new Set()
  }];

  while (queue.length > 0 && routes.length < 20) {
    // Sort queue by cost (best first)
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();
    const currentStation = current.path[current.path.length - 1];
    const pathKey = current.path.join('-');

    if (visited.has(pathKey)) continue;
    visited.add(pathKey);

    if (currentStation === destination) {
      // Found a route
      const route = buildRouteDetails(current);
      routes.push(route);
      if (routes.length >= 3) break; // Get top 3
      continue;
    }

    if (current.path.length > maxTransfers + 1) continue;

    // Explore neighbors
    const neighbors = connections.filter(conn => 
      conn.from === currentStation || conn.to === currentStation
    );

    for (const conn of neighbors) {
      const nextStation = conn.from === currentStation ? conn.to : conn.from;
      
      if (current.path.includes(nextStation)) continue; // Avoid cycles

      const nextOperator = conn.operator;
      const nextDistance = current.distance + conn.distance;
      const nextOperators = new Set([...current.operators, nextOperator]);
      const nextCurves = current.totalCurves + conn.curveScore;
      const nextStates = new Set([...current.states, ...conn.states]);

      // Calculate cost based on preferences
      let cost = nextDistance * weightDistance;
      
      // Penalty for multiple operators
      if (nextOperators.size > 1) {
        cost += (nextOperators.size - 1) * 100 * weightSingleOperator;
      }
      
      // Penalty for curves
      cost += nextCurves * 10 * weightCurves;

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
    const conn = getConnection(from, to);
    
    if (conn) {
      segments.push({
        from: stations[from],
        to: stations[to],
        distance: conn.distance,
        operator: conn.operator,
        curveScore: conn.curveScore,
        states: conn.states
      });
      
      totalDistance += conn.distance;
      operators.add(conn.operator);
      conn.states.forEach(state => allStates.add(state));
      
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
    }
  }

  return {
    path: path.map(code => stations[code]),
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

