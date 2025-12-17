import EmptyState from './EmptyState';

function RouteResults({ routes, onRouteSelect, selectedRouteIndex }) {
  if (routes.length === 0) {
    return (
      <EmptyState
        icon="🗺️"
        title="No Routes Found"
        message="No routes were found between the selected freight yards with the current preferences. Try adjusting your route preferences or selecting different freight yards."
      />
    );
  }

  return (
    <div>
      <h3>Top {routes.length} Route{routes.length > 1 ? 's' : ''} Found</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {routes.map((route, index) => (
          <div
            key={index}
            onClick={() => onRouteSelect(index)}
            style={{
              padding: '20px',
              border: selectedRouteIndex === index ? '3px solid #646cff' : '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedRouteIndex === index ? '#f0f0ff' : '#fff',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#646cff' }}>
                Route #{index + 1}
              </h4>
              <div style={{ 
                padding: '5px 10px', 
                backgroundColor: '#646cff', 
                color: 'white', 
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {route.totalDistance} miles
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <strong>Path:</strong> {route.path.map(s => s.name).join(' → ')}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '10px',
              fontSize: '14px'
            }}>
              <div>
                <strong>Railroad Operators:</strong> {route.operators.join(', ')}
              </div>
              <div>
                <strong>Operator Count:</strong> {route.operatorCount}
              </div>
              <div>
                <strong>Interline Transfers:</strong> {route.transferPoints.length}
              </div>
              <div>
                <strong>States/Provinces:</strong> {route.states.join(', ')}
              </div>
            </div>

            {route.transferPoints.length > 0 && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>Interline Transfer Points:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  {route.transferPoints.map((transfer, idx) => (
                    <li key={idx}>
                      {transfer.station.name}: {transfer.fromOperator} → {transfer.toOperator}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <strong>Route Details:</strong>
              <div style={{ marginTop: '5px' }}>
                {route.segments.map((segment, idx) => (
                  <div key={idx} style={{ marginBottom: '5px' }}>
                    {segment.from.name} → {segment.to.name}: {segment.distance} miles ({segment.operator})
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteResults;

