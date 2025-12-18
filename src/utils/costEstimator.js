// Route cost estimation utility

// Base rates per mile by operator (in dollars per mile per ton)
const OPERATOR_BASE_RATES = {
  'BNSF': 0.045,
  'UP': 0.042,
  'CSX': 0.040,
  'NS': 0.041,
  'CN': 0.043,
  'CP': 0.044,
  'KCS': 0.039,
  'KCSM': 0.039
};

// Transfer costs (in dollars per transfer)
const TRANSFER_COST = 500;

// Curve penalty (additional cost per curve, in dollars)
const CURVE_PENALTY = 10;

// Distance-based discounts (percentage reduction)
const DISTANCE_DISCOUNTS = {
  0: 0,      // 0-100 miles: no discount
  100: 0.05, // 100-500 miles: 5% discount
  500: 0.10, // 500-1000 miles: 10% discount
  1000: 0.15 // 1000+ miles: 15% discount
};

// Operator-specific surcharges (percentage)
const OPERATOR_SURCHARGES = {
  'BNSF': 0,
  'UP': 0.02,
  'CSX': 0,
  'NS': 0.01,
  'CN': 0.03,
  'CP': 0.02,
  'KCS': 0,
  'KCSM': 0
};

/**
 * Calculate base shipping cost for a route
 * @param {Object} route - Route object with segments, distance, operators, etc.
 * @param {number} weight - Freight weight in pounds
 * @returns {Object} Cost breakdown
 */
export function estimateRouteCost(route, weight = 0) {
  if (!route || !route.segments || route.segments.length === 0) {
    return {
      totalCost: 0,
      baseCost: 0,
      transferCost: 0,
      curvePenalty: 0,
      discount: 0,
      surcharge: 0,
      costPerMile: 0,
      costPerTon: 0,
      breakdown: []
    };
  }

  const weightInTons = weight / 2000; // Convert pounds to tons
  const totalDistance = route.totalDistance || 0;
  const transferPoints = route.transferPoints?.length || (route.segments.length > 1 ? route.segments.length - 1 : 0);
  const totalCurves = route.totalCurves || 0;
  const operators = route.operators || [];

  // Calculate base cost per segment
  let baseCost = 0;
  const breakdown = [];

  route.segments.forEach((segment, index) => {
    const segmentDistance = segment.distance || 0;
    const segmentOperator = segment.operator || 'Unknown';
    const operatorRate = OPERATOR_BASE_RATES[segmentOperator] || 0.040;
    
    const segmentBaseCost = segmentDistance * operatorRate * weightInTons;
    baseCost += segmentBaseCost;
    
    breakdown.push({
      segment: index + 1,
      operator: segmentOperator,
      distance: segmentDistance,
      rate: operatorRate,
      cost: segmentBaseCost
    });
  });

  // Calculate transfer costs
  const transferCost = transferPoints * TRANSFER_COST;

  // Calculate curve penalty
  const curvePenalty = totalCurves * CURVE_PENALTY;

  // Calculate distance discount
  let discountPercent = 0;
  if (totalDistance >= 1000) {
    discountPercent = DISTANCE_DISCOUNTS[1000];
  } else if (totalDistance >= 500) {
    discountPercent = DISTANCE_DISCOUNTS[500];
  } else if (totalDistance >= 100) {
    discountPercent = DISTANCE_DISCOUNTS[100];
  }
  const discount = baseCost * discountPercent;

  // Calculate operator surcharges
  let surcharge = 0;
  operators.forEach(operator => {
    const surchargePercent = OPERATOR_SURCHARGES[operator] || 0;
    const operatorCost = breakdown
      .filter(b => b.operator === operator)
      .reduce((sum, b) => sum + b.cost, 0);
    surcharge += operatorCost * surchargePercent;
  });

  // Calculate total cost
  const totalCost = baseCost + transferCost + curvePenalty - discount + surcharge;

  // Calculate cost per mile and per ton
  const costPerMile = totalDistance > 0 ? totalCost / totalDistance : 0;
  const costPerTon = weightInTons > 0 ? totalCost / weightInTons : 0;

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    baseCost: Math.round(baseCost * 100) / 100,
    transferCost: Math.round(transferCost * 100) / 100,
    curvePenalty: Math.round(curvePenalty * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    surcharge: Math.round(surcharge * 100) / 100,
    costPerMile: Math.round(costPerMile * 100) / 100,
    costPerTon: Math.round(costPerTon * 100) / 100,
    breakdown,
    weightInTons: Math.round(weightInTons * 100) / 100,
    totalDistance,
    transferPoints,
    totalCurves
  };
}

/**
 * Compare costs for multiple routes
 * @param {Array} routes - Array of route objects
 * @param {number} weight - Freight weight in pounds
 * @returns {Array} Routes with cost estimates, sorted by total cost
 */
export function compareRouteCosts(routes, weight = 0) {
  if (!routes || routes.length === 0) {
    return [];
  }

  return routes.map(route => ({
    ...route,
    costEstimate: estimateRouteCost(route, weight)
  })).sort((a, b) => a.costEstimate.totalCost - b.costEstimate.totalCost);
}

/**
 * Get cost estimate summary for display
 * @param {Object} costEstimate - Cost estimate object from estimateRouteCost
 * @returns {Object} Formatted summary
 */
export function formatCostEstimate(costEstimate) {
  return {
    total: `$${costEstimate.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    base: `$${costEstimate.baseCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    transfer: `$${costEstimate.transferCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    curve: `$${costEstimate.curvePenalty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    discount: `-$${costEstimate.discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    surcharge: `+$${costEstimate.surcharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    perMile: `$${costEstimate.costPerMile.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    perTon: `$${costEstimate.costPerTon.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  };
}

