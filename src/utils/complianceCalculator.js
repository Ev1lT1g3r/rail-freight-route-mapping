// Compliance probability calculator for freight shipments
import { calculateCenterOfGravity } from './freightCalculations';

/**
 * Calculate compliance probability for freight shipment
 * @param {Object} freight - Freight specifications
 * @param {Object} car - Car specifications
 * @param {Object} placement - Placement position
 * @param {Object} route - Route information
 * @param {string} operator - Operator name
 * @returns {Object} Compliance analysis with probability score
 */
export function calculateComplianceProbability(freight, car, placement, route, operator) {
  let baseScore = 100;
  const factors = [];
  const warnings = [];
  const criticalIssues = [];

  // Dimension compliance (40% weight)
  const dimensionScore = calculateDimensionCompliance(freight, car);
  factors.push({
    name: 'Dimension Compliance',
    score: dimensionScore.score,
    weight: 0.4,
    details: dimensionScore.details
  });
  if (dimensionScore.issues.length > 0) {
    criticalIssues.push(...dimensionScore.issues);
  }

  // Weight compliance (25% weight)
  const weightScore = calculateWeightCompliance(freight, car);
  factors.push({
    name: 'Weight Compliance',
    score: weightScore.score,
    weight: 0.25,
    details: weightScore.details
  });
  if (weightScore.issues.length > 0) {
    criticalIssues.push(...weightScore.issues);
  }

  // Center of gravity compliance (20% weight)
  const cgScore = calculateCGCompliance(freight, car, placement);
  factors.push({
    name: 'Center of Gravity',
    score: cgScore.score,
    weight: 0.2,
    details: cgScore.details
  });
  if (cgScore.warnings.length > 0) {
    warnings.push(...cgScore.warnings);
  }

  // Operator-specific rules (10% weight)
  const operatorScore = calculateOperatorCompliance(freight, car, operator);
  factors.push({
    name: 'Operator Rules',
    score: operatorScore.score,
    weight: 0.1,
    details: operatorScore.details
  });
  if (operatorScore.warnings.length > 0) {
    warnings.push(...operatorScore.warnings);
  }

  // Route compatibility (5% weight)
  const routeScore = calculateRouteCompliance(freight, route, operator);
  factors.push({
    name: 'Route Compatibility',
    score: routeScore.score,
    weight: 0.05,
    details: routeScore.details
  });

  // Calculate weighted score
  const weightedScore = factors.reduce((total, factor) => {
    return total + (factor.score * factor.weight);
  }, 0);

  // Determine probability category
  let probability = weightedScore;
  let category = 'High';
  let color = '#10B981'; // Green

  if (criticalIssues.length > 0) {
    probability = Math.max(0, probability - (criticalIssues.length * 20));
  }

  if (probability >= 85) {
    category = 'High';
    color = '#10B981';
  } else if (probability >= 70) {
    category = 'Medium';
    color = '#F59E0B';
  } else if (probability >= 50) {
    category = 'Low';
    color = '#EF4444';
  } else {
    category = 'Very Low';
    color = '#DC2626';
  }

  return {
    probability: Math.round(probability),
    category,
    color,
    factors,
    warnings,
    criticalIssues,
    recommendations: generateRecommendations(factors, criticalIssues, warnings)
  };
}

function calculateDimensionCompliance(freight, car) {
  let score = 100;
  const details = [];
  const issues = [];

  const lengthFit = freight.length <= car.length;
  const widthFit = freight.width <= car.width;
  const heightFit = freight.height <= (car.height - car.deckHeight);

  if (!lengthFit) {
    score -= 40;
    issues.push(`Freight length (${freight.length}ft) exceeds car length (${car.length}ft)`);
    details.push(`Length: ${((car.length / freight.length) * 100).toFixed(1)}% fit`);
  } else {
    const utilization = (freight.length / car.length) * 100;
    details.push(`Length: ${utilization.toFixed(1)}% utilized`);
    if (utilization > 95) {
      score -= 5; // Too tight
    }
  }

  if (!widthFit) {
    score -= 30;
    issues.push(`Freight width (${freight.width}ft) exceeds car width (${car.width}ft)`);
    details.push(`Width: ${((car.width / freight.width) * 100).toFixed(1)}% fit`);
  } else {
    const utilization = (freight.width / car.width) * 100;
    details.push(`Width: ${utilization.toFixed(1)}% utilized`);
  }

  if (!heightFit) {
    score -= 30;
    issues.push(`Freight height (${freight.height}ft) exceeds available height`);
    details.push(`Height: Exceeds limit`);
  } else {
    const utilization = (freight.height / (car.height - car.deckHeight)) * 100;
    details.push(`Height: ${utilization.toFixed(1)}% utilized`);
  }

  return { score: Math.max(0, score), details, issues };
}

function calculateWeightCompliance(freight, car) {
  let score = 100;
  const details = [];
  const issues = [];

  if (freight.weight > car.maxWeight) {
    score = 0;
    issues.push(`Freight weight (${freight.weight.toLocaleString()}lbs) exceeds car max (${car.maxWeight.toLocaleString()}lbs)`);
    details.push(`Weight: Exceeds capacity`);
  } else {
    const utilization = (freight.weight / car.maxWeight) * 100;
    details.push(`Weight: ${utilization.toFixed(1)}% of capacity`);
    
    if (utilization > 90) {
      score -= 10; // Very close to limit
    } else if (utilization < 30) {
      score -= 5; // Underutilized
    }
  }

  return { score: Math.max(0, score), details, issues };
}

function calculateCGCompliance(freight, car, placement) {
  let score = 100;
  const details = [];
  const warnings = [];

  // Use imported calculateCenterOfGravity function
  let cgResult;
  try {
    cgResult = calculateCenterOfGravity(freight, car, placement);
  } catch (e) {
    // Fallback if calculation fails - calculate basic CG manually
    console.warn('Could not calculate center of gravity, using fallback:', e);
    // Simple fallback calculation
    cgResult = {
      combinedCG: {
        x: placement.x || 0,
        y: placement.y || 0,
        z: (car.deckHeight || 0) + (freight.height || 0) / 2
      }
    };
  }

  // Check longitudinal offset
  const maxLongitudinalOffset = car.length * 0.1; // 10% of car length
  const longitudinalOffset = Math.abs(cgResult.combinedCG.x);
  
  if (longitudinalOffset > maxLongitudinalOffset) {
    const penalty = Math.min(30, (longitudinalOffset / maxLongitudinalOffset) * 30);
    score -= penalty;
    warnings.push(`Longitudinal CG offset (${longitudinalOffset.toFixed(1)}ft) may affect stability`);
    details.push(`Longitudinal CG: ${longitudinalOffset.toFixed(1)}ft offset`);
  } else {
    details.push(`Longitudinal CG: ${longitudinalOffset.toFixed(1)}ft (within limits)`);
  }

  // Check lateral offset
  const maxLateralOffset = car.width * 0.05; // 5% of car width
  const lateralOffset = Math.abs(cgResult.combinedCG.y);
  
  if (lateralOffset > maxLateralOffset) {
    const penalty = Math.min(20, (lateralOffset / maxLateralOffset) * 20);
    score -= penalty;
    warnings.push(`Lateral CG offset (${lateralOffset.toFixed(1)}ft) may affect stability`);
    details.push(`Lateral CG: ${lateralOffset.toFixed(1)}ft offset`);
  } else {
    details.push(`Lateral CG: ${lateralOffset.toFixed(1)}ft (within limits)`);
  }

  // Check vertical height
  const maxHeight = car.height + car.deckHeight - 2;
  if (cgResult.combinedCG.z > maxHeight) {
    score -= 15;
    warnings.push(`High center of gravity (${cgResult.combinedCG.z.toFixed(1)}ft) may affect stability`);
    details.push(`Vertical CG: ${cgResult.combinedCG.z.toFixed(1)}ft (high)`);
  } else {
    details.push(`Vertical CG: ${cgResult.combinedCG.z.toFixed(1)}ft (acceptable)`);
  }

  return { score: Math.max(0, score), details, warnings };
}

function calculateOperatorCompliance(freight, car, operator) {
  let score = 100;
  const details = [];
  const warnings = [];

  // Operator-specific rules
  const operatorRules = {
    'BNSF': {
      maxHeight: 17,
      preferredWeightRange: [50000, 200000],
      restrictions: ['No hazardous materials on certain car types']
    },
    'UP': {
      maxHeight: 17,
      preferredWeightRange: [40000, 220000],
      restrictions: ['Auto racks have specific height limits']
    },
    'CSX': {
      maxHeight: 16,
      preferredWeightRange: [30000, 200000],
      restrictions: ['Covered hoppers for bulk materials']
    },
    'NS': {
      maxHeight: 16,
      preferredWeightRange: [35000, 210000],
      restrictions: ['Gondolas for open-top freight']
    },
    'CN': {
      maxHeight: 17,
      preferredWeightRange: [40000, 200000],
      restrictions: ['Cross-border shipments require additional documentation']
    },
    'CP': {
      maxHeight: 17,
      preferredWeightRange: [40000, 200000],
      restrictions: ['Mountain routes have weight restrictions']
    }
  };

  const rules = operatorRules[operator] || operatorRules['BNSF'];

  // Check height restrictions
  if (freight.height > rules.maxHeight) {
    score -= 15;
    warnings.push(`Freight height exceeds ${operator} maximum (${rules.maxHeight}ft)`);
    details.push(`Height: Exceeds ${operator} limit`);
  } else {
    details.push(`Height: Within ${operator} limits`);
  }

  // Check weight preferences
  if (freight.weight < rules.preferredWeightRange[0]) {
    score -= 5;
    warnings.push(`Freight weight below ${operator} preferred range`);
    details.push(`Weight: Below preferred range`);
  } else if (freight.weight > rules.preferredWeightRange[1]) {
    score -= 10;
    warnings.push(`Freight weight above ${operator} preferred range`);
    details.push(`Weight: Above preferred range`);
  } else {
    details.push(`Weight: Within ${operator} preferred range`);
  }

  // Car type compatibility
  if (car.name === 'Flatcar' && freight.height > 12) {
    details.push(`Car type: Suitable for tall freight`);
  } else if (car.name === 'Boxcar' && freight.height < 10) {
    details.push(`Car type: Good fit for standard freight`);
  }

  return { score: Math.max(0, score), details, warnings };
}

function calculateRouteCompliance(freight, route, operator) {
  let score = 100;
  const details = [];

  if (!route || !route.operators) {
    return { score: 100, details: ['Route information not available'] };
  }

  // Check if operator is in route
  if (route.operators.includes(operator)) {
    details.push(`Operator: ${operator} is part of route`);
  } else {
    score -= 20;
    details.push(`Operator: ${operator} not in selected route`);
  }

  // Check route distance vs freight type
  if (route.totalDistance > 2000 && freight.weight > 200000) {
    score -= 5;
    details.push(`Route: Long distance with heavy freight`);
  }

  return { score: Math.max(0, score), details };
}

function generateRecommendations(factors, criticalIssues, warnings) {
  const recommendations = [];

  if (criticalIssues.length > 0) {
    recommendations.push({
      priority: 'Critical',
      action: 'Fix dimension or weight issues before submission',
      items: criticalIssues
    });
  }

  const lowScoringFactors = factors.filter(f => f.score < 70);
  if (lowScoringFactors.length > 0) {
    recommendations.push({
      priority: 'High',
      action: 'Consider adjusting these factors to improve compliance',
      items: lowScoringFactors.map(f => `${f.name}: ${f.score}%`)
    });
  }

  if (warnings.length > 0) {
    recommendations.push({
      priority: 'Medium',
      action: 'Review these warnings',
      items: warnings
    });
  }

  return recommendations;
}

