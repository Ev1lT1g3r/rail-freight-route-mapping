// Route transit time estimation utility

// Average speeds by operator (miles per hour)
const OPERATOR_SPEEDS = {
  'BNSF': 25,
  'UP': 24,
  'CSX': 23,
  'NS': 24,
  'CN': 26,
  'CP': 25,
  'KCS': 23,
  'KCSM': 23
};

// Base transfer time (hours per transfer)
const TRANSFER_TIME = 12;

// Curve delay factor (additional hours per curve)
const CURVE_DELAY = 0.5;

// Distance-based speed adjustments (percentage)
const DISTANCE_SPEED_ADJUSTMENTS = {
  0: 0,      // 0-100 miles: no adjustment
  100: 0.05, // 100-500 miles: 5% faster
  500: 0.10, // 500-1000 miles: 10% faster
  1000: 0.15 // 1000+ miles: 15% faster
};

// Weather/seasonal delays (percentage of base time)
const SEASONAL_DELAYS = {
  'winter': 0.15,  // 15% delay in winter
  'spring': 0.05,  // 5% delay in spring
  'summer': 0.0,   // No delay in summer
  'fall': 0.05     // 5% delay in fall
};

/**
 * Calculate estimated transit time for a route
 * @param {Object} route - Route object with segments, distance, operators, etc.
 * @param {Object} options - Options for time estimation
 * @param {string} options.season - Season ('winter', 'spring', 'summer', 'fall')
 * @param {boolean} options.includeWeekends - Whether to include weekends in transit time
 * @returns {Object} Transit time breakdown
 */
export function estimateTransitTime(route, options = {}) {
  const {
    season = 'summer',
    includeWeekends = true
  } = options;

  if (!route || !route.segments || route.segments.length === 0) {
    return {
      totalHours: 0,
      totalDays: 0,
      businessDays: 0,
      breakdown: [],
      estimatedArrival: null
    };
  }

  const totalDistance = route.totalDistance || 0;
  const transferPoints = route.transferPoints?.length || (route.segments.length > 1 ? route.segments.length - 1 : 0);
  const totalCurves = route.totalCurves || 0;
  const operators = route.operators || [];

  // Calculate base transit time per segment
  let totalHours = 0;
  const breakdown = [];

  route.segments.forEach((segment, index) => {
    const segmentDistance = segment.distance || 0;
    const segmentOperator = segment.operator || 'Unknown';
    const operatorSpeed = OPERATOR_SPEEDS[segmentOperator] || 24;
    
    // Apply distance-based speed adjustment
    let speedAdjustment = 0;
    if (totalDistance >= 1000) {
      speedAdjustment = DISTANCE_SPEED_ADJUSTMENTS[1000];
    } else if (totalDistance >= 500) {
      speedAdjustment = DISTANCE_SPEED_ADJUSTMENTS[500];
    } else if (totalDistance >= 100) {
      speedAdjustment = DISTANCE_SPEED_ADJUSTMENTS[100];
    }
    
    const adjustedSpeed = operatorSpeed * (1 + speedAdjustment);
    const segmentHours = segmentDistance / adjustedSpeed;
    totalHours += segmentHours;
    
    breakdown.push({
      segment: index + 1,
      operator: segmentOperator,
      distance: segmentDistance,
      speed: adjustedSpeed,
      hours: segmentHours,
      days: segmentHours / 24
    });
  });

  // Add transfer time
  const transferTime = transferPoints * TRANSFER_TIME;
  totalHours += transferTime;

  // Add curve delay
  const curveDelay = totalCurves * CURVE_DELAY;
  totalHours += curveDelay;

  // Apply seasonal delays
  const seasonalDelay = SEASONAL_DELAYS[season] || 0;
  const seasonalDelayHours = totalHours * seasonalDelay;
  totalHours += seasonalDelayHours;

  // Calculate days
  const totalDays = totalHours / 24;
  
  // Calculate business days (excluding weekends if specified)
  let businessDays = totalDays;
  if (!includeWeekends && totalDays > 0) {
    // Rough estimate: subtract weekends (2 days per 7 days)
    const weekendDays = Math.floor(totalDays / 7) * 2;
    businessDays = totalDays - weekendDays;
  }

  // Estimate arrival date (from now)
  const estimatedArrival = new Date();
  estimatedArrival.setHours(estimatedArrival.getHours() + totalHours);

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    totalDays: Math.round(totalDays * 10) / 10,
    businessDays: Math.round(businessDays * 10) / 10,
    transferTime: Math.round(transferTime * 10) / 10,
    curveDelay: Math.round(curveDelay * 10) / 10,
    seasonalDelay: Math.round(seasonalDelayHours * 10) / 10,
    breakdown,
    estimatedArrival,
    season,
    includeWeekends
  };
}

/**
 * Compare transit times for multiple routes
 * @param {Array} routes - Array of route objects
 * @param {Object} options - Options for time estimation
 * @returns {Array} Routes with transit time estimates, sorted by total time
 */
export function compareTransitTimes(routes, options = {}) {
  if (!routes || routes.length === 0) {
    return [];
  }

  return routes.map(route => ({
    ...route,
    transitTime: estimateTransitTime(route, options)
  })).sort((a, b) => a.transitTime.totalHours - b.transitTime.totalHours);
}

/**
 * Get transit time estimate summary for display
 * @param {Object} transitTime - Transit time object from estimateTransitTime
 * @returns {Object} Formatted summary
 */
export function formatTransitTime(transitTime) {
  if (!transitTime || transitTime.totalHours === 0) {
    return {
      hours: 'N/A',
      days: 'N/A',
      businessDays: 'N/A',
      arrival: 'N/A'
    };
  }

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    hours: `${transitTime.totalHours.toFixed(1)} hours`,
    days: `${transitTime.totalDays.toFixed(1)} days`,
    businessDays: `${transitTime.businessDays.toFixed(1)} business days`,
    arrival: formatDate(transitTime.estimatedArrival),
    transferTime: transitTime.transferTime > 0 ? `${transitTime.transferTime.toFixed(1)} hours` : '0 hours',
    curveDelay: transitTime.curveDelay > 0 ? `${transitTime.curveDelay.toFixed(1)} hours` : '0 hours',
    seasonalDelay: transitTime.seasonalDelay > 0 ? `${transitTime.seasonalDelay.toFixed(1)} hours` : '0 hours'
  };
}

/**
 * Get current season based on date
 * @param {Date} date - Date to check (defaults to now)
 * @returns {string} Season name
 */
export function getCurrentSeason(date = new Date()) {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}

