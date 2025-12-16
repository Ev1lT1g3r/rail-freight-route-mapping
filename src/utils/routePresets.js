/**
 * Route preference presets for common use cases
 */

export const ROUTE_PRESETS = {
  FASTEST: {
    name: 'Fastest Route',
    description: 'Prioritize shortest distance and fewest transfers',
    preferences: {
      weightDistance: 2.0,
      weightSingleOperator: 1.5,
      weightCurves: 0.5,
      maxTransfers: 3
    }
  },
  SIMPLEST: {
    name: 'Simplest Route',
    description: 'Prefer single operator with minimal transfers',
    preferences: {
      weightDistance: 0.8,
      weightSingleOperator: 2.0,
      weightCurves: 0.3,
      maxTransfers: 2
    }
  },
  STRAIGHTEST: {
    name: 'Straightest Route',
    description: 'Minimize curves and turns for stability',
    preferences: {
      weightDistance: 1.0,
      weightSingleOperator: 0.5,
      weightCurves: 2.0,
      maxTransfers: 5
    }
  },
  BALANCED: {
    name: 'Balanced',
    description: 'Balance all factors equally',
    preferences: {
      weightDistance: 1.0,
      weightSingleOperator: 0.5,
      weightCurves: 0.3,
      maxTransfers: 5
    }
  },
  CUSTOM: {
    name: 'Custom',
    description: 'Manually adjust preferences',
    preferences: null // Will use current preferences
  }
};

export function getPresetByName(name) {
  return ROUTE_PRESETS[name] || ROUTE_PRESETS.BALANCED;
}

export function findMatchingPreset(preferences) {
  // Find the preset that most closely matches the current preferences
  const tolerance = 0.1;
  
  for (const [key, preset] of Object.entries(ROUTE_PRESETS)) {
    if (key === 'CUSTOM') continue;
    
    const presetPrefs = preset.preferences;
    const matches = 
      Math.abs(preferences.weightDistance - presetPrefs.weightDistance) < tolerance &&
      Math.abs(preferences.weightSingleOperator - presetPrefs.weightSingleOperator) < tolerance &&
      Math.abs(preferences.weightCurves - presetPrefs.weightCurves) < tolerance &&
      preferences.maxTransfers === presetPrefs.maxTransfers;
    
    if (matches) {
      return key;
    }
  }
  
  return 'CUSTOM';
}

