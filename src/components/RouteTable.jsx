import './RouteTable.css';
import HelpTooltip from './HelpTooltip';

function RouteTable({ routes, selectedRouteIndex, onRouteSelect }) {
  if (!routes || routes.length === 0) {
    return null;
  }

  const getOperatorColors = (operators) => {
    const colors = {
      'BNSF': '#FFD700',
      'UP': '#FF6B35',
      'CSX': '#4ECDC4',
      'NS': '#45B7D1',
      'CN': '#96CEB4',
      'CP': '#FFEAA7',
      'KCS': '#A29BFE',
      'KCSM': '#A29BFE'
    };
    return operators.map(op => colors[op] || '#A0A0A0');
  };

  return (
    <div className="route-table-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <h3 className="route-table-title">Available Routes</h3>
        <HelpTooltip content="Compare all available routes side-by-side. Click a row to select that route and see it highlighted on the map. Routes are sorted by total cost score, with the best route at the top.">
          <span style={{ color: '#6B7280', cursor: 'help', fontSize: '18px' }}>ℹ️</span>
        </HelpTooltip>
      </div>
      <div className="route-table-wrapper">
        <table className="route-table">
          <thead>
            <tr>
              <th>Route #</th>
              <th>Distance</th>
              <th>Operators</th>
              <th>Operator Count</th>
              <th>Transfers</th>
              <th>States/Provinces</th>
              <th>Total Curves</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => {
              const isSelected = selectedRouteIndex === index;
              const operatorColors = getOperatorColors(route.operators || []);
              
              return (
                <tr
                  key={index}
                  className={`route-table-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => onRouteSelect(index)}
                >
                  <td className="route-number">
                    <span className="route-number-badge">{index + 1}</span>
                  </td>
                  <td className="route-distance">
                    <strong>{route.totalDistance.toFixed(0)}</strong> miles
                  </td>
                  <td className="route-operators">
                    <div className="operator-chips">
                      {route.operators.map((op, idx) => (
                        <span
                          key={idx}
                          className="operator-chip"
                          style={{ backgroundColor: operatorColors[idx] }}
                          title={op}
                        >
                          {op}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="route-operator-count">
                    {route.operatorCount || route.operators?.length || 0}
                  </td>
                  <td className="route-transfers">
                    {route.transferPoints?.length || 0}
                  </td>
                  <td className="route-states">
                    <div className="states-list">
                      {(route.states || []).slice(0, 5).map((state, idx) => (
                        <span key={idx} className="state-badge">{state}</span>
                      ))}
                      {(route.states || []).length > 5 && (
                        <span className="state-more">+{(route.states || []).length - 5}</span>
                      )}
                    </div>
                  </td>
                  <td className="route-curves">
                    {route.totalCurves?.toFixed(1) || 'N/A'}
                  </td>
                  <td className="route-path">
                    <div className="route-path-text" title={route.path.map(s => s.name).join(' → ')}>
                      {route.path.map(s => s.name).join(' → ')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RouteTable;

