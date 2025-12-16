import { useState, useMemo, useEffect } from 'react';
import { getCarTypesForOperator, carTypes } from '../data/carTypes';
import { calculateCenterOfGravity, getBestCarTypeForFreight } from '../utils/freightCalculations';

function FreightPlacementVisualization({ freight, operators, selectedRoute }) {
  const [selectedOperator, setSelectedOperator] = useState(operators?.[0] || 'BNSF');
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [placement, setPlacement] = useState({ x: 0, y: 0 });
  const [autoSelectedCar, setAutoSelectedCar] = useState(null);

  const availableCarTypes = useMemo(() => {
    return getCarTypesForOperator(selectedOperator);
  }, [selectedOperator]);

  // Auto-select best car type when freight dimensions are provided
  useEffect(() => {
    if (freight && freight.length > 0 && freight.width > 0 && freight.height > 0 && freight.weight > 0 && operators && operators.length > 0) {
      const bestCar = getBestCarTypeForFreight(freight, operators, carTypes);
      if (bestCar) {
        setAutoSelectedCar(bestCar);
        setSelectedOperator(bestCar.operator);
        // Find the car in the available types
        const operatorCars = getCarTypesForOperator(bestCar.operator);
        const matchingCar = operatorCars.find(c => c.id === bestCar.car.id);
        if (matchingCar) {
          setSelectedCarType(matchingCar);
        }
      }
    }
  }, [freight, operators]);

  const currentCar = selectedCarType || availableCarTypes[0];

  const cgResult = useMemo(() => {
    if (!freight || !currentCar) return null;
    return calculateCenterOfGravity(freight, currentCar, placement);
  }, [freight, currentCar, placement]);

  if (!freight || !freight.length || !freight.width || !freight.height) {
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
  const freightLengthPx = (freight.length * scale);
  const freightWidthPx = (freight.width * scale);

  // Calculate freight position on car (centered by default, adjusted by placement)
  const carCenterX = carLengthPx / 2;
  const carCenterY = carWidthPx / 2;
  const freightX = carCenterX + (placement.x * scale) - (freightLengthPx / 2);
  const freightY = carCenterY + (placement.y * scale) - (freightWidthPx / 2);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ marginTop: 0, color: '#0F172A' }}>Freight Placement Visualization</h3>
        {autoSelectedCar && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#d4edda',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#155724'
          }}>
            ✓ Auto-selected: {autoSelectedCar.car.name} ({autoSelectedCar.operator})
          </div>
        )}
      </div>

      {/* Operator and Car Type Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
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

      {/* Top View Visualization */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '10px', color: '#0F172A' }}>Top View (Deck)</h4>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#f5f5f5',
          border: '2px solid #333',
          borderRadius: '4px',
          padding: '20px'
        }}>
          <svg
            width="100%"
            height={carWidthPx + 40}
            viewBox={`0 0 ${carLengthPx + 40} ${carWidthPx + 40}`}
            style={{ display: 'block' }}
          >
            {/* Car outline */}
            <rect
              x="20"
              y="20"
              width={carLengthPx}
              height={carWidthPx}
              fill="#ddd"
              stroke="#333"
              strokeWidth="2"
            />
            
            {/* Car center line (longitudinal) */}
            <line
              x1={20 + carLengthPx / 2}
              y1="20"
              x2={20 + carLengthPx / 2}
              y2={20 + carWidthPx}
              stroke="#999"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            
            {/* Car center line (lateral) */}
            <line
              x1="20"
              y1={20 + carWidthPx / 2}
              x2={20 + carLengthPx}
              y2={20 + carWidthPx / 2}
              stroke="#999"
              strokeWidth="1"
              strokeDasharray="5,5"
            />

            {/* Freight */}
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

            {/* Center of Gravity marker */}
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

            {/* Dimensions labels */}
            <text x="25" y="15" fontSize="10" fill="#666">0ft</text>
            <text x={20 + carLengthPx - 30} y="15" fontSize="10" fill="#666">{currentCar.length}ft</text>
            <text x="5" y={20 + carWidthPx / 2} fontSize="10" fill="#666">{currentCar.width}ft</text>
          </svg>

          {/* Placement controls */}
          <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                Forward/Backward Offset (ft):
              </label>
              <input
                type="range"
                min={-(currentCar.length / 2 - freight.length / 2)}
                max={currentCar.length / 2 - freight.length / 2}
                step="0.5"
                value={placement.x}
                onChange={(e) => setPlacement({ ...placement, x: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                {placement.x.toFixed(1)} ft
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                Left/Right Offset (ft):
              </label>
              <input
                type="range"
                min={-(currentCar.width / 2 - freight.width / 2)}
                max={currentCar.width / 2 - freight.width / 2}
                step="0.5"
                value={placement.y}
                onChange={(e) => setPlacement({ ...placement, y: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                {placement.y.toFixed(1)} ft
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side View Visualization */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '10px', color: '#0F172A' }}>Side View (Profile)</h4>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#f5f5f5',
          border: '2px solid #333',
          borderRadius: '4px',
          padding: '20px'
        }}>
          <svg
            width="100%"
            height={(currentCar.height + currentCar.deckHeight) * scale + 60}
            viewBox={`0 0 ${carLengthPx + 40} ${(currentCar.height + currentCar.deckHeight) * scale + 60}`}
            style={{ display: 'block' }}
          >
            {/* Ground line */}
            <line
              x1="20"
              y1={20 + (currentCar.height + currentCar.deckHeight) * scale}
              x2={20 + carLengthPx}
              y2={20 + (currentCar.height + currentCar.deckHeight) * scale}
              stroke="#333"
              strokeWidth="3"
            />

            {/* Car deck */}
            <rect
              x="20"
              y={20 + (currentCar.height + currentCar.deckHeight) * scale - currentCar.deckHeight * scale}
              width={carLengthPx}
              height={currentCar.deckHeight * scale}
              fill="#888"
              stroke="#333"
              strokeWidth="2"
            />

            {/* Car body */}
            <rect
              x="20"
              y={20 + (currentCar.height + currentCar.deckHeight) * scale - (currentCar.height + currentCar.deckHeight) * scale}
              width={carLengthPx}
              height={currentCar.height * scale}
              fill="#ddd"
              stroke="#333"
              strokeWidth="2"
            />

            {/* Freight */}
            <rect
              x={20 + freightX}
              y={20 + (currentCar.height + currentCar.deckHeight) * scale - (currentCar.deckHeight + freight.height) * scale}
              width={freightLengthPx}
              height={freight.height * scale}
              fill="#3B82F6"
              fillOpacity="0.7"
              stroke="#1E3A8A"
              strokeWidth="2"
            />

            {/* Center of Gravity marker */}
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

      {/* Center of Gravity Results */}
      {cgResult && (
        <div style={{
          padding: '15px',
          backgroundColor: cgResult.validations.isValid ? '#d4edda' : '#f8d7da',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h4 style={{ marginTop: 0, color: '#0F172A' }}>Center of Gravity Analysis</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '15px' }}>
            <div>
              <strong>Longitudinal (X):</strong> {cgResult.combinedCG.x.toFixed(2)} ft
              <br />
              <small style={{ color: '#666' }}>Forward: +, Backward: -</small>
            </div>
            <div>
              <strong>Lateral (Y):</strong> {cgResult.combinedCG.y.toFixed(2)} ft
              <br />
              <small style={{ color: '#666' }}>Right: +, Left: -</small>
            </div>
            <div>
              <strong>Vertical (Z):</strong> {cgResult.combinedCG.z.toFixed(2)} ft
              <br />
              <small style={{ color: '#666' }}>Above ground</small>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Total Weight:</strong> {cgResult.totalWeight.toLocaleString()} lbs
            <br />
            <small style={{ color: '#666' }}>
              Car: {cgResult.carWeight.toLocaleString()} lbs | 
              Freight: {cgResult.freightWeight.toLocaleString()} lbs
            </small>
          </div>

          {cgResult.validations.issues.length > 0 && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
              <strong style={{ color: '#dc3545' }}>Issues:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {cgResult.validations.issues.map((issue, idx) => (
                  <li key={idx} style={{ color: '#dc3545' }}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {cgResult.validations.warnings.length > 0 && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
              <strong style={{ color: '#856404' }}>Warnings:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {cgResult.validations.warnings.map((warning, idx) => (
                  <li key={idx} style={{ color: '#856404' }}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {cgResult.validations.isValid && cgResult.validations.warnings.length === 0 && (
            <div style={{ color: '#155724', fontWeight: 'bold', marginTop: '10px' }}>
              ✓ Placement is valid and safe
            </div>
          )}
        </div>
      )}

      {/* Car Specifications */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4 style={{ marginTop: 0, color: '#0F172A' }}>Car Specifications ({currentCar.name})</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div><strong>Length:</strong> {currentCar.length} ft</div>
          <div><strong>Width:</strong> {currentCar.width} ft</div>
          <div><strong>Height:</strong> {currentCar.height} ft</div>
          <div><strong>Deck Height:</strong> {currentCar.deckHeight} ft</div>
          <div><strong>Max Weight:</strong> {currentCar.maxWeight.toLocaleString()} lbs</div>
          <div><strong>Available:</strong> {(currentCar.maxWeight - (cgResult?.carWeight || 60000)).toLocaleString()} lbs</div>
        </div>
      </div>
    </div>
  );
}

export default FreightPlacementVisualization;

