import { useState } from 'react';

function FreightSpecification({ freight, onFreightChange }) {
  const [localFreight, setLocalFreight] = useState(freight || {
    description: '',
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    diagram: null
  });

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

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, color: '#0F172A' }}>Freight Specifications</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Freight Description:
        </label>
        <input
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Length (feet):
          </label>
          <input
            type="number"
            value={localFreight.length || ''}
            onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Width (feet):
          </label>
          <input
            type="number"
            value={localFreight.width || ''}
            onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Height (feet):
          </label>
          <input
            type="number"
            value={localFreight.height || ''}
            onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Weight (pounds):
          </label>
          <input
            type="number"
            value={localFreight.weight || ''}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
            min="0"
            step="100"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Freight Diagram/Image (optional):
        </label>
        <input
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

