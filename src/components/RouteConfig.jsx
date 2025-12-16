import { useState, useEffect } from 'react';
import { ROUTE_PRESETS, findMatchingPreset } from '../utils/routePresets';

function RouteConfig({ preferences, onPreferencesChange }) {
  const [selectedPreset, setSelectedPreset] = useState(findMatchingPreset(preferences));

  useEffect(() => {
    setSelectedPreset(findMatchingPreset(preferences));
  }, [preferences]);

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    if (presetKey !== 'CUSTOM' && ROUTE_PRESETS[presetKey]) {
      onPreferencesChange(ROUTE_PRESETS[presetKey].preferences);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0 }}>Route Preferences</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Quick Presets:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {Object.entries(ROUTE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedPreset === key ? '#3B82F6' : '#fff',
                color: selectedPreset === key ? '#fff' : '#333',
                border: `2px solid ${selectedPreset === key ? '#3B82F6' : '#ddd'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedPreset === key ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              title={preset.description}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{preset.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Custom Preferences</h4>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Distance Weight: {preferences.weightDistance.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={preferences.weightDistance}
          onChange={(e) => onPreferencesChange({ 
            ...preferences, 
            weightDistance: parseFloat(e.target.value) 
          })}
          style={{ width: '100%' }}
        />
        <small>Higher values prioritize shorter routes</small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Single Operator Preference: {preferences.weightSingleOperator.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={preferences.weightSingleOperator}
          onChange={(e) => onPreferencesChange({ 
            ...preferences, 
            weightSingleOperator: parseFloat(e.target.value) 
          })}
          style={{ width: '100%' }}
        />
        <small>Higher values prefer routes with fewer railroad operator changes</small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Straight Route Preference: {preferences.weightCurves.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={preferences.weightCurves}
          onChange={(e) => onPreferencesChange({ 
            ...preferences, 
            weightCurves: parseFloat(e.target.value) 
          })}
          style={{ width: '100%' }}
        />
        <small>Higher values prefer straighter routes with fewer curves</small>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Max Transfers: {preferences.maxTransfers}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={preferences.maxTransfers}
          onChange={(e) => onPreferencesChange({ 
            ...preferences, 
            maxTransfers: parseInt(e.target.value) 
          })}
          style={{ width: '100%' }}
        />
        <small>Maximum number of interline transfers allowed</small>
      </div>
      </div>
    </div>
  );
}

export default RouteConfig;

