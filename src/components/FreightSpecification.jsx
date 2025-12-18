import { useState } from 'react';
import HelpTooltip from './HelpTooltip';
import FreightLibrary from './FreightLibrary';
import { FREIGHT_PRESETS, getPresetsByCategory } from '../data/freightPresets';
import { 
  UNIT_SYSTEMS, 
  convertLength, 
  convertWeight, 
  getLengthUnitLabel, 
  getWeightUnitLabel 
} from '../utils/unitConverter';

function FreightSpecification({ freight, onFreightChange, validationErrors = {} }) {
  const [unitSystem, setUnitSystem] = useState(UNIT_SYSTEMS.IMPERIAL);
  
  // Convert freight to current unit system if needed
  const getInitialFreight = () => {
    if (!freight) {
      return {
        description: '',
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        diagram: null,
        unitSystem: UNIT_SYSTEMS.IMPERIAL
      };
    }
    
    // If freight has a different unit system, convert it
    if (freight.unitSystem && freight.unitSystem !== unitSystem) {
      return {
        ...freight,
        length: convertLength(freight.length, freight.unitSystem, unitSystem),
        width: convertLength(freight.width, freight.unitSystem, unitSystem),
        height: convertLength(freight.height, freight.unitSystem, unitSystem),
        weight: convertWeight(freight.weight, freight.unitSystem, unitSystem),
        unitSystem
      };
    }
    
    return { ...freight, unitSystem: freight.unitSystem || UNIT_SYSTEMS.IMPERIAL };
  };
  
  const [localFreight, setLocalFreight] = useState(getInitialFreight());
  
  // Update local freight when unit system changes
  const handleUnitSystemChange = (newSystem) => {
    if (newSystem === unitSystem) return;
    
    const converted = {
      ...localFreight,
      length: convertLength(localFreight.length, unitSystem, newSystem),
      width: convertLength(localFreight.width, unitSystem, newSystem),
      height: convertLength(localFreight.height, unitSystem, newSystem),
      weight: convertWeight(localFreight.weight, unitSystem, newSystem),
      unitSystem: newSystem
    };
    
    setLocalFreight(converted);
    setUnitSystem(newSystem);
    if (onFreightChange) {
      onFreightChange(converted);
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...localFreight, [field]: value };
    setLocalFreight(updated);
    if (onFreightChange) {
      onFreightChange(updated);
    }
  };

  const handleDiagramUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('diagram', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetKey) => {
    const preset = FREIGHT_PRESETS[presetKey];
    if (preset) {
      const presetFreight = {
        ...localFreight,
        description: preset.name,
        length: preset.length,
        width: preset.width,
        height: preset.height,
        weight: preset.weight
      };
      setLocalFreight(presetFreight);
      if (onFreightChange) {
        onFreightChange(presetFreight);
      }
    }
  };

  const presetsByCategory = getPresetsByCategory();
  const [showFreightLibrary, setShowFreightLibrary] = useState(false);

  const handleLoadFromLibrary = (libraryFreight) => {
    const converted = {
      ...libraryFreight,
      unitSystem: unitSystem
    };
    setLocalFreight(converted);
    if (onFreightChange) {
      onFreightChange(converted);
    }
    setShowFreightLibrary(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#0F172A' }}>Freight Specifications</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowFreightLibrary(true)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📚 Freight Library
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px' }}>
            Unit System:
            <HelpTooltip content="Switch between Imperial (feet, pounds) and Metric (meters, kilograms) units. Values will be automatically converted when you switch.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
          <select
            value={unitSystem}
            onChange={(e) => handleUnitSystemChange(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <option value={UNIT_SYSTEMS.IMPERIAL}>Imperial (ft, lbs)</option>
            <option value={UNIT_SYSTEMS.METRIC}>Metric (m, kg)</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Quick Presets:
          <HelpTooltip content="Select a common freight type preset to quickly fill in dimensions and weight. You can modify the values after selecting a preset.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
          </HelpTooltip>
        </label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handlePresetSelect(e.target.value);
              e.target.value = ''; // Reset select
            }
          }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            backgroundColor: '#fff'
          }}
        >
          <option value="">Select a freight preset...</option>
          {Object.entries(presetsByCategory).map(([category, presets]) => (
            <optgroup key={category} label={category}>
              {presets.map(preset => (
                <option key={preset.name} value={Object.keys(FREIGHT_PRESETS).find(k => FREIGHT_PRESETS[k].name === preset.name)}>
                  {preset.name} - {preset.description}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="freight-description" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontWeight: 'bold' }}>
          Freight Description:
          <HelpTooltip content="Describe the type of freight being shipped (e.g., 'Steel coils', 'Machinery', 'Containers'). This helps with documentation and compliance tracking.">
            <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
          </HelpTooltip>
        </label>
        <input
          id="freight-description"
          type="text"
          value={localFreight.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="e.g., Steel coils, Machinery, Containers"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label htmlFor="freight-length" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontWeight: 'bold' }}>
                  Length ({getLengthUnitLabel(unitSystem)}):
                  <HelpTooltip content={`The length of the freight in ${getLengthUnitLabel(unitSystem)}, measured along the longest dimension. This is used to determine if the freight fits on the selected rail car.`}>
                    <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
                  </HelpTooltip>
                </label>
          <input
            id="freight-length"
            type="number"
            value={localFreight.length || ''}
            onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: validationErrors.length ? '2px solid #EF4444' : '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          {validationErrors.length && (
            <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {validationErrors.length}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="freight-width" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Width ({getLengthUnitLabel(unitSystem)}):
          </label>
          <input
            id="freight-width"
            type="number"
            value={localFreight.width || ''}
            onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: validationErrors.width ? '2px solid #EF4444' : '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          {validationErrors.width && (
            <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {validationErrors.width}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="freight-height" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Height ({getLengthUnitLabel(unitSystem)}):
          </label>
          <input
            id="freight-height"
            type="number"
            value={localFreight.height || ''}
            onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: validationErrors.height ? '2px solid #EF4444' : '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          {validationErrors.height && (
            <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {validationErrors.height}
            </div>
          )}
        </div>

              <div>
                <label htmlFor="freight-weight" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontWeight: 'bold' }}>
                  Weight ({getWeightUnitLabel(unitSystem)}):
                  <HelpTooltip content="The total weight of the freight in pounds. This is critical for ensuring the freight doesn't exceed the rail car's weight capacity and for calculating center of gravity.">
                    <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
                  </HelpTooltip>
                </label>
          <input
            id="freight-weight"
            type="number"
            value={localFreight.weight || ''}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
            min="0"
            step="100"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: validationErrors.weight ? '2px solid #EF4444' : '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          {validationErrors.weight && (
            <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
              {validationErrors.weight}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="freight-diagram" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Freight Diagram/Image (optional):
        </label>
        <input
          id="freight-diagram"
          type="file"
          accept="image/*"
          onChange={handleDiagramUpload}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
        {localFreight.diagram && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={localFreight.diagram} 
              alt="Freight diagram" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }} 
            />
          </div>
        )}
      </div>

      {localFreight.length > 0 && localFreight.width > 0 && localFreight.height > 0 && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Volume:</strong> {(localFreight.length * localFreight.width * localFreight.height).toFixed(1)} cubic feet
          {localFreight.weight > 0 && (
            <>
              <br />
              <strong>Density:</strong> {(localFreight.weight / (localFreight.length * localFreight.width * localFreight.height)).toFixed(2)} lbs/ft³
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FreightSpecification;

