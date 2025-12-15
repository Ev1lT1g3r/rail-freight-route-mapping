function RouteConfig({ preferences, onPreferencesChange }) {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0 }}>Route Preferences</h3>
      
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
  );
}

export default RouteConfig;

