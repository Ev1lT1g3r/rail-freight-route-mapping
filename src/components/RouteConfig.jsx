import { useState, useEffect } from 'react';
import { ROUTE_PRESETS, findMatchingPreset } from '../utils/routePresets';
import HelpTooltip from './HelpTooltip';

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
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Distance Weight: {preferences.weightDistance.toFixed(1)}
          <HelpTooltip content="Controls how much the algorithm prioritizes shorter routes. Higher values (up to 2.0) will favor routes with fewer total miles, while lower values allow longer routes if they have other advantages like fewer transfers or operators.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
          </HelpTooltip>
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
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Single Operator Preference: {preferences.weightSingleOperator.toFixed(1)}
          <HelpTooltip content="Penalizes routes that require transfers between different railroad operators. Higher values strongly favor routes that use a single operator throughout, which can reduce complexity and potential delays from interline transfers.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
          </HelpTooltip>
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
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Straight Route Preference: {preferences.weightCurves.toFixed(1)}
          <HelpTooltip content="Penalizes routes with many curves and turns. Higher values favor straighter routes, which can be important for freight that is sensitive to lateral forces or requires more stable transport conditions.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
          </HelpTooltip>
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
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Max Transfers: {preferences.maxTransfers}
          <HelpTooltip content="Sets the maximum number of interline transfer points allowed in a route. Lower values (1-2) will only show routes with minimal transfers, while higher values (5-10) allow more complex routes with multiple operator changes.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
          </HelpTooltip>
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

      {/* Route Constraints */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginTop: '20px'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Route Constraints</h4>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold' }}>
            Require Operators:
            <HelpTooltip content="Select operators that must be included in the route. Routes will only be shown if they use at least one of these operators.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['BNSF', 'UP', 'CSX', 'NS', 'CP', 'CN', 'KCS'].map(op => (
              <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(preferences.requireOperators || []).includes(op)}
                  onChange={(e) => {
                    const current = preferences.requireOperators || [];
                    const updated = e.target.checked
                      ? [...current, op]
                      : current.filter(o => o !== op);
                    onPreferencesChange({ ...preferences, requireOperators: updated });
                  }}
                />
                <span style={{ fontSize: '14px' }}>{op}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold' }}>
            Avoid Operators:
            <HelpTooltip content="Select operators to exclude from routes. Routes using any of these operators will be filtered out.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['BNSF', 'UP', 'CSX', 'NS', 'CP', 'CN', 'KCS'].map(op => (
              <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(preferences.avoidOperators || []).includes(op)}
                  onChange={(e) => {
                    const current = preferences.avoidOperators || [];
                    const updated = e.target.checked
                      ? [...current, op]
                      : current.filter(o => o !== op);
                    onPreferencesChange({ ...preferences, avoidOperators: updated });
                  }}
                />
                <span style={{ fontSize: '14px' }}>{op}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteConfig;

