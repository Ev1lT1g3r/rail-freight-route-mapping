import { useState, useMemo, useEffect } from 'react';
import { getCarTypesForOperator, carTypes } from '../data/carTypes';
import { calculateCenterOfGravity, getBestCarTypeForFreight, getRecommendedCarTypes } from '../utils/freightCalculations';
import { calculateComplianceProbability } from '../utils/complianceCalculator';

function FreightPlacementVisualization({ freight, operators, selectedRoute, onFreightChange }) {
  const [selectedOperator, setSelectedOperator] = useState(operators?.[0] || 'BNSF');
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [placement, setPlacement] = useState({ x: 0, y: 0 });
  const [autoSelectedCar, setAutoSelectedCar] = useState(null);
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [localFreight, setLocalFreight] = useState(freight || {
    description: '',
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    diagram: null
  });

  const availableCarTypes = useMemo(() => {
    return getCarTypesForOperator(selectedOperator);
  }, [selectedOperator]);

  // Auto-select best car type when freight dimensions are provided
  useEffect(() => {
    if (localFreight && localFreight.length > 0 && localFreight.width > 0 && localFreight.height > 0 && localFreight.weight > 0 && operators && operators.length > 0) {
      const recommendations = getRecommendedCarTypes(localFreight, operators, carTypes);
      setAllRecommendations(recommendations);
      
      const bestCar = getBestCarTypeForFreight(localFreight, operators, carTypes);
      if (bestCar) {
        setAutoSelectedCar(bestCar);
        setSelectedOperator(bestCar.operator);
        const operatorCars = getCarTypesForOperator(bestCar.operator);
        const matchingCar = operatorCars.find(c => c.id === bestCar.car.id);
        if (matchingCar) {
          setSelectedCarType(matchingCar);
        }
      }
    } else {
      setAllRecommendations([]);
      setAutoSelectedCar(null);
    }
  }, [localFreight, operators]);

  // Update parent when freight changes
  useEffect(() => {
    if (onFreightChange) {
      onFreightChange(localFreight);
    }
  }, [localFreight, onFreightChange]);

  // Sync with parent freight prop
  useEffect(() => {
    if (freight) {
      setLocalFreight(freight);
    }
  }, [freight]);

  const currentCar = selectedCarType || availableCarTypes[0];

  const cgResult = useMemo(() => {
    if (!localFreight || !currentCar) return null;
    return calculateCenterOfGravity(localFreight, currentCar, placement);
  }, [localFreight, currentCar, placement]);

  const complianceResult = useMemo(() => {
    if (!localFreight || !currentCar || !selectedRoute) return null;
    try {
      return calculateComplianceProbability(localFreight, currentCar, placement, selectedRoute, selectedOperator);
    } catch (err) {
      console.error('Error calculating compliance:', err);
      return null;
    }
  }, [localFreight, currentCar, placement, selectedRoute, selectedOperator]);

  const handleFreightGeometryChange = (field, value) => {
    const updated = { ...localFreight, [field]: parseFloat(value) || 0 };
    setLocalFreight(updated);
  };

  if (!localFreight || !localFreight.length || !localFreight.width || !localFreight.height) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        color: '#666'
      }}>
        <p>Please specify freight dimensions to view placement visualization.</p>
      </div>
    );
  }

  // Scale for visualization (1 foot = 10 pixels)
  const scale = 10;
  const carLengthPx = (currentCar.length * scale);
  const carWidthPx = (currentCar.width * scale);
  const freightLengthPx = (localFreight.length * scale);
  const freightWidthPx = (localFreight.width * scale);

  // Calculate freight position on car
  const carCenterX = carLengthPx / 2;
  const carCenterY = carWidthPx / 2;
  const freightX = carCenterX + (placement.x * scale) - (freightLengthPx / 2);
  const freightY = carCenterY + (placement.y * scale) - (freightWidthPx / 2);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '320px 1fr 320px', 
      gap: '20px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      minHeight: '800px'
    }}>
      {/* Left Panel: Compliance Probability */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        overflowY: 'auto',
        maxHeight: '800px'
      }}>
        <h3 style={{ marginTop: 0, color: '#0F172A', fontSize: '18px', marginBottom: '20px' }}>
          Compliance Probability
        </h3>

        {complianceResult ? (
          <>
            {/* Probability Score */}
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              marginBottom: '20px',
              border: `3px solid ${complianceResult.color}`
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: complianceResult.color,
                marginBottom: '10px'
              }}>
                {complianceResult.probability}%
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase'
              }}>
                {complianceResult.category} Probability
              </div>
            </div>

            {/* Compliance Factors */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#0F172A' }}>
                Compliance Factors
              </h4>
              {complianceResult.factors.map((factor, idx) => (
                <div key={idx} style={{
                  marginBottom: '12px',
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{factor.name}</span>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: '600',
                      color: factor.score >= 80 ? '#10B981' : factor.score >= 60 ? '#F59E0B' : '#EF4444'
                    }}>
                      {factor.score}%
                    </span>
                  </div>
                  <div style={{ 
                    height: '6px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${factor.score}%`,
                      backgroundColor: factor.score >= 80 ? '#10B981' : factor.score >= 60 ? '#F59E0B' : '#EF4444',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {factor.details.join(' • ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Issues */}
            {complianceResult.criticalIssues.length > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee2e2',
                borderRadius: '6px',
                marginBottom: '15px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginTop: 0, marginBottom: '8px', color: '#991b1b' }}>
                  Critical Issues
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#991b1b' }}>
                  {complianceResult.criticalIssues.map((issue, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {complianceResult.warnings.length > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                marginBottom: '15px',
                border: '1px solid #fde68a'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginTop: 0, marginBottom: '8px', color: '#92400e' }}>
                  Warnings
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#92400e' }}>
                  {complianceResult.warnings.map((warning, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {complianceResult.recommendations.length > 0 && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#0F172A' }}>
                  Recommendations
                </h4>
                {complianceResult.recommendations.map((rec, idx) => (
                  <div key={idx} style={{
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', color: rec.priority === 'Critical' ? '#EF4444' : rec.priority === 'High' ? '#F59E0B' : '#3B82F6' }}>
                      {rec.priority} Priority
                    </div>
                    <div style={{ color: '#666', marginBottom: '4px' }}>{rec.action}</div>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '11px', color: '#666' }}>
                      {rec.items.slice(0, 3).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Select a route to view compliance probability
          </div>
        )}
      </div>

      {/* Center Panel: Visualization */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginTop: 0, color: '#0F172A' }}>Freight Placement Visualization</h3>
          {autoSelectedCar && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: autoSelectedCar.recommendation.isPerfectFit ? '#d4edda' : '#fff3cd',
              borderRadius: '4px',
              fontSize: '12px',
              color: autoSelectedCar.recommendation.isPerfectFit ? '#155724' : '#856404',
              fontWeight: '500'
            }}>
              {autoSelectedCar.recommendation.isPerfectFit ? '✓' : '⚠'} 
              {' '}Auto-selected: {autoSelectedCar.car.name} ({autoSelectedCar.operator})
            </div>
          )}
        </div>

        {/* Operator and Car Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
              Operator:
            </label>
            <select
              value={selectedOperator}
              onChange={(e) => {
                setSelectedOperator(e.target.value);
                setSelectedCarType(null);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              {operators?.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
              Car Type:
            </label>
            <select
              value={selectedCarType?.id || availableCarTypes[0]?.id}
              onChange={(e) => {
                const car = availableCarTypes.find(c => c.id === e.target.value);
                setSelectedCarType(car);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              {availableCarTypes.map(car => (
                <option key={car.id} value={car.id}>
                  {car.name}
                  {autoSelectedCar && autoSelectedCar.car.id === car.id ? ' (Recommended)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top View */}
        <div>
          <h4 style={{ marginBottom: '10px', color: '#0F172A', fontSize: '15px' }}>Top View (Deck)</h4>
          <div style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#f5f5f5',
            border: '2px solid #333',
            borderRadius: '4px',
            padding: '20px'
          }}>
            <svg
              width="100%"
              height={Math.max(carWidthPx + 40, 200)}
              viewBox={`0 0 ${carLengthPx + 40} ${carWidthPx + 40}`}
              style={{ display: 'block' }}
            >
              <rect
                x="20"
                y="20"
                width={carLengthPx}
                height={carWidthPx}
                fill="#ddd"
                stroke="#333"
                strokeWidth="2"
              />
              <line
                x1={20 + carLengthPx / 2}
                y1="20"
                x2={20 + carLengthPx / 2}
                y2={20 + carWidthPx}
                stroke="#999"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <line
                x1="20"
                y1={20 + carWidthPx / 2}
                x2={20 + carLengthPx}
                y2={20 + carWidthPx / 2}
                stroke="#999"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <rect
                x={20 + freightX}
                y={20 + freightY}
                width={freightLengthPx}
                height={freightWidthPx}
                fill="#3B82F6"
                fillOpacity="0.7"
                stroke="#1E3A8A"
                strokeWidth="2"
              />
              {cgResult && (
                <>
                  <circle
                    cx={20 + carCenterX + (cgResult.combinedCG.x * scale)}
                    cy={20 + carCenterY + (cgResult.combinedCG.y * scale)}
                    r="5"
                    fill="#EF4444"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={20 + carCenterX + (cgResult.combinedCG.x * scale) + 8}
                    y={20 + carCenterY + (cgResult.combinedCG.y * scale)}
                    fontSize="12"
                    fill="#EF4444"
                    fontWeight="bold"
                  >
                    CG
                  </text>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Side View */}
        <div>
          <h4 style={{ marginBottom: '10px', color: '#0F172A', fontSize: '15px' }}>Side View (Profile)</h4>
          <div style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#f5f5f5',
            border: '2px solid #333',
            borderRadius: '4px',
            padding: '20px'
          }}>
            <svg
              width="100%"
              height={Math.max((currentCar.height + currentCar.deckHeight) * scale + 60, 200)}
              viewBox={`0 0 ${carLengthPx + 40} ${(currentCar.height + currentCar.deckHeight) * scale + 60}`}
              style={{ display: 'block' }}
            >
              <line
                x1="20"
                y1={20 + (currentCar.height + currentCar.deckHeight) * scale}
                x2={20 + carLengthPx}
                y2={20 + (currentCar.height + currentCar.deckHeight) * scale}
                stroke="#333"
                strokeWidth="3"
              />
              <rect
                x="20"
                y={20 + (currentCar.height + currentCar.deckHeight) * scale - currentCar.deckHeight * scale}
                width={carLengthPx}
                height={currentCar.deckHeight * scale}
                fill="#888"
                stroke="#333"
                strokeWidth="2"
              />
              <rect
                x="20"
                y={20 + (currentCar.height + currentCar.deckHeight) * scale - (currentCar.height + currentCar.deckHeight) * scale}
                width={carLengthPx}
                height={currentCar.height * scale}
                fill="#ddd"
                stroke="#333"
                strokeWidth="2"
              />
              <rect
                x={20 + freightX}
                y={20 + (currentCar.height + currentCar.deckHeight) * scale - (currentCar.deckHeight + localFreight.height) * scale}
                width={freightLengthPx}
                height={localFreight.height * scale}
                fill="#3B82F6"
                fillOpacity="0.7"
                stroke="#1E3A8A"
                strokeWidth="2"
              />
              {cgResult && (
                <>
                  <circle
                    cx={20 + carCenterX + (cgResult.combinedCG.x * scale)}
                    cy={20 + (currentCar.height + currentCar.deckHeight) * scale - cgResult.combinedCG.z * scale}
                    r="5"
                    fill="#EF4444"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <line
                    x1={20 + carCenterX + (cgResult.combinedCG.x * scale)}
                    y1={20 + (currentCar.height + currentCar.deckHeight) * scale - cgResult.combinedCG.z * scale}
                    x2={20 + carCenterX + (cgResult.combinedCG.x * scale)}
                    y2={20 + (currentCar.height + currentCar.deckHeight) * scale}
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Placement Controls */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#0F172A', fontSize: '15px' }}>
            Placement Controls
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '500' }}>
                Forward/Backward Offset (ft):
              </label>
              <input
                type="range"
                min={-(currentCar.length / 2 - localFreight.length / 2)}
                max={currentCar.length / 2 - localFreight.length / 2}
                step="0.5"
                value={placement.x}
                onChange={(e) => setPlacement({ ...placement, x: parseFloat(e.target.value) })}
                style={{ width: '100%', marginBottom: '5px' }}
              />
              <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                {placement.x.toFixed(1)} ft
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '500' }}>
                Left/Right Offset (ft):
              </label>
              <input
                type="range"
                min={-(currentCar.width / 2 - localFreight.width / 2)}
                max={currentCar.width / 2 - localFreight.width / 2}
                step="0.5"
                value={placement.y}
                onChange={(e) => setPlacement({ ...placement, y: parseFloat(e.target.value) })}
                style={{ width: '100%', marginBottom: '5px' }}
              />
              <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                {placement.y.toFixed(1)} ft
              </div>
            </div>
          </div>
        </div>

        {/* CG Results */}
        {cgResult && (
          <div style={{
            padding: '15px',
            backgroundColor: cgResult.validations.isValid ? '#d4edda' : '#f8d7da',
            borderRadius: '6px',
            fontSize: '13px'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#0F172A', fontSize: '15px' }}>
              Center of Gravity Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <div>
                <strong>Longitudinal (X):</strong> {cgResult.combinedCG.x.toFixed(2)} ft
              </div>
              <div>
                <strong>Lateral (Y):</strong> {cgResult.combinedCG.y.toFixed(2)} ft
              </div>
              <div>
                <strong>Vertical (Z):</strong> {cgResult.combinedCG.z.toFixed(2)} ft
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Total Weight: {cgResult.totalWeight.toLocaleString()} lbs
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Interactive Freight Geometry Controls */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e0e0e0',
        overflowY: 'auto',
        maxHeight: '800px'
      }}>
        <h3 style={{ marginTop: 0, color: '#0F172A', fontSize: '18px', marginBottom: '20px' }}>
          Freight Geometry
        </h3>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
            Description:
          </label>
          <input
            type="text"
            value={localFreight.description || ''}
            onChange={(e) => setLocalFreight({ ...localFreight, description: e.target.value })}
            placeholder="e.g., Steel coils, Machinery"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Dimension Controls */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#0F172A' }}>
            Dimensions (feet)
          </h4>
          
          {/* Length */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Length:</label>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                {localFreight.length.toFixed(1)} ft
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={localFreight.length || 0}
              onChange={(e) => handleFreightGeometryChange('length', e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginTop: '2px' }}>
              <span>1 ft</span>
              <span>100 ft</span>
            </div>
          </div>

          {/* Width */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Width:</label>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                {localFreight.width.toFixed(1)} ft
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={localFreight.width || 0}
              onChange={(e) => handleFreightGeometryChange('width', e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginTop: '2px' }}>
              <span>1 ft</span>
              <span>20 ft</span>
            </div>
          </div>

          {/* Height */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Height:</label>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                {localFreight.height.toFixed(1)} ft
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={localFreight.height || 0}
              onChange={(e) => handleFreightGeometryChange('height', e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginTop: '2px' }}>
              <span>1 ft</span>
              <span>20 ft</span>
            </div>
          </div>
        </div>

        {/* Weight Control */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#0F172A' }}>
            Weight (pounds)
          </h4>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Weight:</label>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                {localFreight.weight.toLocaleString()} lbs
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="300000"
              step="1000"
              value={localFreight.weight || 0}
              onChange={(e) => handleFreightGeometryChange('weight', e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginTop: '2px' }}>
              <span>1K lbs</span>
              <span>300K lbs</span>
            </div>
          </div>
        </div>

        {/* Calculated Values */}
        {localFreight.length > 0 && localFreight.width > 0 && localFreight.height > 0 && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginTop: 0, marginBottom: '10px', color: '#0F172A' }}>
              Calculated Values
            </h4>
            <div style={{ fontSize: '13px' }}>
              <div style={{ marginBottom: '5px' }}>
                <strong>Volume:</strong> {(localFreight.length * localFreight.width * localFreight.height).toFixed(1)} ft³
              </div>
              {localFreight.weight > 0 && (
                <div>
                  <strong>Density:</strong> {(localFreight.weight / (localFreight.length * localFreight.width * localFreight.height)).toFixed(2)} lbs/ft³
                </div>
              )}
            </div>
          </div>
        )}

        {/* Car Comparison */}
        {currentCar && (
          <div style={{
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginTop: 0, marginBottom: '10px', color: '#0F172A' }}>
              Car: {currentCar.name}
            </h4>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <div>Length: {currentCar.length} ft</div>
              <div>Width: {currentCar.width} ft</div>
              <div>Height: {currentCar.height} ft</div>
              <div>Max Weight: {currentCar.maxWeight.toLocaleString()} lbs</div>
            </div>
          </div>
        )}

        {/* Recommendations Summary */}
        {allRecommendations.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#0F172A' }}>
              Top Recommendations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allRecommendations.slice(0, 3).map((rec, idx) => (
                <div
                  key={`${rec.operator}-${rec.car.id}`}
                  style={{
                    padding: '10px',
                    backgroundColor: idx === 0 ? '#d4edda' : '#fff',
                    borderRadius: '6px',
                    border: idx === 0 ? '2px solid #10B981' : '1px solid #e0e0e0',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => {
                    setSelectedOperator(rec.operator);
                    const operatorCars = getCarTypesForOperator(rec.operator);
                    const matchingCar = operatorCars.find(c => c.id === rec.car.id);
                    if (matchingCar) {
                      setSelectedCarType(matchingCar);
                    }
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {rec.car.name} ({rec.operator})
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    Score: {rec.score} {rec.isPerfectFit && '✓ Perfect Fit'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FreightPlacementVisualization;
