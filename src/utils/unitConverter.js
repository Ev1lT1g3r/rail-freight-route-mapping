// Unit conversion utilities for freight dimensions

const CONVERSION_FACTORS = {
  // Length conversions (feet <-> meters)
  FEET_TO_METERS: 0.3048,
  METERS_TO_FEET: 3.28084,
  
  // Weight conversions (pounds <-> kilograms)
  POUNDS_TO_KILOGRAMS: 0.453592,
  KILOGRAMS_TO_POUNDS: 2.20462
};

export const UNIT_SYSTEMS = {
  IMPERIAL: 'imperial',
  METRIC: 'metric'
};

export function convertLength(value, fromSystem, toSystem) {
  if (fromSystem === toSystem) return value;
  
  if (fromSystem === UNIT_SYSTEMS.IMPERIAL && toSystem === UNIT_SYSTEMS.METRIC) {
    return value * CONVERSION_FACTORS.FEET_TO_METERS;
  }
  
  if (fromSystem === UNIT_SYSTEMS.METRIC && toSystem === UNIT_SYSTEMS.IMPERIAL) {
    return value * CONVERSION_FACTORS.METERS_TO_FEET;
  }
  
  return value;
}

export function convertWeight(value, fromSystem, toSystem) {
  if (fromSystem === toSystem) return value;
  
  if (fromSystem === UNIT_SYSTEMS.IMPERIAL && toSystem === UNIT_SYSTEMS.METRIC) {
    return value * CONVERSION_FACTORS.POUNDS_TO_KILOGRAMS;
  }
  
  if (fromSystem === UNIT_SYSTEMS.METRIC && toSystem === UNIT_SYSTEMS.IMPERIAL) {
    return value * CONVERSION_FACTORS.KILOGRAMS_TO_POUNDS;
  }
  
  return value;
}

export function formatLength(value, system) {
  if (system === UNIT_SYSTEMS.METRIC) {
    return `${value.toFixed(2)} m`;
  }
  return `${value.toFixed(2)} ft`;
}

export function formatWeight(value, system) {
  if (system === UNIT_SYSTEMS.METRIC) {
    return `${value.toFixed(2)} kg`;
  }
  return `${value.toFixed(2)} lbs`;
}

export function getLengthUnitLabel(system) {
  return system === UNIT_SYSTEMS.METRIC ? 'meters' : 'feet';
}

export function getWeightUnitLabel(system) {
  return system === UNIT_SYSTEMS.METRIC ? 'kilograms' : 'pounds';
}

