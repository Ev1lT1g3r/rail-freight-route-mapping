// Freight placement and center of gravity calculations

/**
 * Calculate center of gravity for freight on a rail car
 * @param {Object} freight - Freight specifications
 * @param {Object} car - Car specifications
 * @param {Object} placement - Placement position on car
 * @returns {Object} Center of gravity coordinates and validation
 */
export function calculateCenterOfGravity(freight, car, placement = { x: 0, y: 0 }) {
  // Freight dimensions in feet
  const freightLength = freight.length || 0;
  const freightWidth = freight.width || 0;
  const freightHeight = freight.height || 0;
  const freightWeight = freight.weight || 0;

  // Car dimensions in feet
  const carLength = car.length || 0;
  const carWidth = car.width || 0;
  const carDeckHeight = car.deckHeight || 0;

  // Placement position (x, y from car center, in feet)
  const placementX = placement.x || 0; // Positive = forward, Negative = backward
  const placementY = placement.y || 0; // Positive = right, Negative = left

  // Calculate freight center of gravity relative to car center
  // X-axis: along car length (longitudinal)
  const freightCG_X = placementX;
  
  // Y-axis: along car width (lateral)
  const freightCG_Y = placementY;
  
  // Z-axis: vertical (height above deck)
  const freightCG_Z = carDeckHeight + (freightHeight / 2);

  // Calculate combined center of gravity (car + freight)
  // Assuming car weight is distributed evenly
  const carWeight = 60000; // Average empty car weight in pounds
  const totalWeight = carWeight + freightWeight;

  // Car CG is at center (0, 0, deckHeight + car.height/2)
  const carCG_X = 0;
  const carCG_Y = 0;
  const carCG_Z = carDeckHeight + (car.height / 2);

  // Combined CG calculation
  const combinedCG_X = ((carWeight * carCG_X) + (freightWeight * freightCG_X)) / totalWeight;
  const combinedCG_Y = ((carWeight * carCG_Y) + (freightWeight * freightCG_Y)) / totalWeight;
  const combinedCG_Z = ((carWeight * carCG_Z) + (freightWeight * freightCG_Z)) / totalWeight;

  // Calculate validations separately to avoid circular dependency
  const validations = validatePlacement(freight, car, placement, {
    combinedCG: { x: combinedCG_X, y: combinedCG_Y, z: combinedCG_Z },
    freightCG: { x: freightCG_X, y: freightCG_Y, z: freightCG_Z }
  });

  return {
    freightCG: {
      x: freightCG_X,
      y: freightCG_Y,
      z: freightCG_Z
    },
    carCG: {
      x: carCG_X,
      y: carCG_Y,
      z: carCG_Z
    },
    combinedCG: {
      x: combinedCG_X,
      y: combinedCG_Y,
      z: combinedCG_Z
    },
    validations,
    totalWeight,
    carWeight,
    freightWeight
  };
}

/**
 * Validate freight placement on car
 * @param {Object} cgData - Pre-calculated center of gravity data to avoid circular dependency
 */
function validatePlacement(freight, car, placement, cgData = null) {
  const issues = [];
  const warnings = [];

  // Check dimensions
  if (freight.length > car.length) {
    issues.push(`Freight length (${freight.length}ft) exceeds car length (${car.length}ft)`);
  }
  if (freight.width > car.width) {
    issues.push(`Freight width (${freight.width}ft) exceeds car width (${car.width}ft)`);
  }
  if (freight.height + car.deckHeight > car.height + car.deckHeight) {
    issues.push(`Freight height (${freight.height}ft) exceeds available car height`);
  }

  // Check weight
  if (freight.weight > car.maxWeight) {
    issues.push(`Freight weight (${freight.weight}lbs) exceeds car max weight (${car.maxWeight}lbs)`);
  }

  // Check placement bounds
  const halfFreightLength = freight.length / 2;
  const halfCarLength = car.length / 2;
  const maxX = halfCarLength - halfFreightLength;
  
  if (Math.abs(placement.x) > maxX) {
    issues.push(`Freight placement exceeds car bounds (max offset: ${maxX.toFixed(1)}ft)`);
  }

  const halfFreightWidth = freight.width / 2;
  const halfCarWidth = car.width / 2;
  const maxY = halfCarWidth - halfFreightWidth;
  
  if (Math.abs(placement.y) > maxY) {
    issues.push(`Freight placement exceeds car width bounds (max offset: ${maxY.toFixed(1)}ft)`);
  }

  // Center of gravity warnings (use provided cgData to avoid circular call)
  if (cgData && cgData.combinedCG) {
    const maxCGOffset = car.length * 0.1; // 10% of car length
    
    if (Math.abs(cgData.combinedCG.x) > maxCGOffset) {
      warnings.push(`Center of gravity offset (${cgData.combinedCG.x.toFixed(1)}ft) may affect stability`);
    }

    if (Math.abs(cgData.combinedCG.y) > car.width * 0.05) {
      warnings.push(`Lateral center of gravity offset (${cgData.combinedCG.y.toFixed(1)}ft) may affect stability`);
    }

    // Height warning
    if (cgData.combinedCG.z > car.height + car.deckHeight - 2) {
      warnings.push(`High center of gravity (${cgData.combinedCG.z.toFixed(1)}ft) may affect stability`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * Calculate optimal placement for freight on car
 */
export function calculateOptimalPlacement(freight, car) {
  // Center placement
  return {
    x: 0,
    y: 0
  };
}

/**
 * Get recommended car types for freight
 */
export function getRecommendedCarTypes(freight, operator) {
  // This would analyze freight specs and recommend suitable car types
  // For now, return all available car types for the operator
  return [];
}

