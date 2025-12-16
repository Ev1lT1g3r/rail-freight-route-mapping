/**
 * Generate realistic rail line paths between two points
 * Creates intermediate waypoints to simulate actual rail routes
 */

/**
 * Generate intermediate waypoints for a rail route segment
 * @param {Object} from - Starting station {lat, lng}
 * @param {Object} to - Ending station {lat, lng}
 * @param {number} curveScore - Curve score (1-10, higher = more curves)
 * @param {Array} states - States/provinces the route passes through
 * @returns {Array} Array of [lat, lng] coordinates including intermediate points
 */
export function generateRailLinePath(from, to, curveScore = 5, states = []) {
  const points = [];
  
  // Always include start point
  points.push([from.lat, from.lng]);
  
  // Calculate distance and bearing
  const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
  const bearing = calculateBearing(from.lat, from.lng, to.lat, to.lng);
  
  // Determine number of intermediate points based on distance and curve score
  // Longer routes and higher curve scores get more intermediate points
  const basePoints = Math.max(3, Math.floor(distance / 100)); // At least 3 points per 100km
  const curveMultiplier = 1 + (curveScore / 10); // Higher curve score = more points
  const numIntermediatePoints = Math.floor(basePoints * curveMultiplier);
  
  // Generate intermediate waypoints
  for (let i = 1; i < numIntermediatePoints; i++) {
    const fraction = i / numIntermediatePoints;
    
    // Add some randomness based on curve score to simulate rail line curves
    const curveOffset = (curveScore / 10) * 0.1; // Max 10% offset for high curve scores
    const randomOffset = (Math.random() - 0.5) * curveOffset;
    
    // Calculate intermediate point
    const intermediatePoint = calculateIntermediatePoint(
      from.lat,
      from.lng,
      to.lat,
      to.lng,
      fraction,
      randomOffset,
      bearing
    );
    
    points.push(intermediatePoint);
  }
  
  // Always include end point
  points.push([to.lat, to.lng]);
  
  return points;
}

/**
 * Calculate distance between two points in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate bearing between two points
 */
function calculateBearing(lat1, lng1, lat2, lng2) {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return Math.atan2(y, x);
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate intermediate point along a route with optional offset
 */
function calculateIntermediatePoint(lat1, lng1, lat2, lng2, fraction, offset, bearing) {
  // Linear interpolation
  const lat = lat1 + (lat2 - lat1) * fraction;
  const lng = lng1 + (lng2 - lng1) * fraction;
  
  // Apply perpendicular offset based on curve score
  // Offset perpendicular to the bearing direction
  const perpendicularBearing = bearing + (Math.PI / 2);
  const offsetDistance = offset * calculateDistance(lat1, lng1, lat2, lng2);
  
  // Calculate offset point
  const offsetLat = lat + (offsetDistance / 111) * Math.cos(perpendicularBearing);
  const offsetLng = lng + (offsetDistance / (111 * Math.cos(toRad(lat)))) * Math.sin(perpendicularBearing);
  
  return [offsetLat, offsetLng];
}

/**
 * Generate a smooth curved path using Bezier-like interpolation
 * @param {Array} waypoints - Array of [lat, lng] points
 * @returns {Array} Smoothed array of [lat, lng] points
 */
export function smoothRailPath(waypoints) {
  if (waypoints.length <= 2) {
    return waypoints;
  }
  
  const smoothed = [];
  smoothed.push(waypoints[0]);
  
  // Use Catmull-Rom spline for smooth curves
  for (let i = 1; i < waypoints.length - 1; i++) {
    const p0 = waypoints[Math.max(0, i - 1)];
    const p1 = waypoints[i];
    const p2 = waypoints[Math.min(waypoints.length - 1, i + 1)];
    
    // Add intermediate points for smooth curve
    for (let t = 0.25; t < 1; t += 0.25) {
      const point = catmullRomSpline(p0, p1, p2, waypoints[Math.min(waypoints.length - 1, i + 2)] || p2, t);
      smoothed.push(point);
    }
  }
  
  smoothed.push(waypoints[waypoints.length - 1]);
  
  return smoothed;
}

/**
 * Catmull-Rom spline interpolation
 */
function catmullRomSpline(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  
  const lat = 0.5 * (
    (2 * p1[0]) +
    (-p0[0] + p2[0]) * t +
    (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
    (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
  );
  
  const lng = 0.5 * (
    (2 * p1[1]) +
    (-p0[1] + p2[1]) * t +
    (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
    (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
  );
  
  return [lat, lng];
}

/**
 * Generate complete rail line path for a route segment
 * @param {Object} segment - Route segment with from, to, curveScore, states
 * @returns {Array} Array of [lat, lng] coordinates for the rail line
 */
export function generateSegmentRailPath(segment) {
  const from = { lat: segment.from.lat, lng: segment.from.lng };
  const to = { lat: segment.to.lat, lng: segment.to.lng };
  const curveScore = segment.curveScore || 5;
  const states = segment.states || [];
  
  // Generate waypoints
  let waypoints = generateRailLinePath(from, to, curveScore, states);
  
  // Smooth the path if we have enough points
  if (waypoints.length > 3) {
    waypoints = smoothRailPath(waypoints);
  }
  
  return waypoints;
}

