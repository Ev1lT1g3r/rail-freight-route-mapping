import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import HelpTooltip from './HelpTooltip';
import { estimateRouteCost, formatCostEstimate } from '../utils/costEstimator';

function RouteComparison({ routes, origin, destination, onClose, onSelectRoute }) {
  const { success } = useToast();
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('side-by-side'); // 'side-by-side' or 'table'

  const handleToggleRoute = (routeIndex) => {
    setSelectedRoutes(prev => {
      if (prev.includes(routeIndex)) {
        return prev.filter(idx => idx !== routeIndex);
      } else if (prev.length < 3) {
        return [...prev, routeIndex];
      } else {
        return prev;
      }
    });
  };

  const handleSelectRoute = (routeIndex) => {
    if (onSelectRoute) {
      onSelectRoute(routeIndex);
      success('Route selected!');
    }
  };

  const getRouteStats = (route) => {
    if (!route || !route.segments) return null;
    
    const totalDistance = route.totalDistance || 0;
    const operators = new Set(route.segments.map(s => s.operator));
    const transferPoints = route.segments.length > 1 ? route.segments.length - 1 : 0;
    const states = new Set(route.segments.flatMap(s => s.states || []));
    const curves = route.totalCurves || 0;
    
    return {
      totalDistance: totalDistance.toFixed(2),
      operatorCount: operators.size,
      operators: Array.from(operators).join(', '),
      transferPoints,
      stateCount: states.size,
      states: Array.from(states).join(', '),
      curves,
      segmentCount: route.segments.length
    };
  };

  const getComparisonMetrics = () => {
    if (selectedRoutes.length < 2) return null;

    const routeStats = selectedRoutes.map(idx => getRouteStats(routes[idx]));
    
    // Find best/worst for each metric
    const metrics = {
      shortest: routeStats.reduce((best, stats, idx) => 
        parseFloat(stats.totalDistance) < parseFloat(best.totalDistance) ? stats : best
      ),
      longest: routeStats.reduce((best, stats) => 
        parseFloat(stats.totalDistance) > parseFloat(best.totalDistance) ? stats : best
      ),
      fewestOperators: routeStats.reduce((best, stats) => 
        stats.operatorCount < best.operatorCount ? stats : best
      ),
      mostOperators: routeStats.reduce((best, stats) => 
        stats.operatorCount > best.operatorCount ? stats : best
      ),
      fewestTransfers: routeStats.reduce((best, stats) => 
        stats.transferPoints < best.transferPoints ? stats : best
      ),
      mostTransfers: routeStats.reduce((best, stats) => 
        stats.transferPoints > best.transferPoints ? stats : best
      ),
      fewestCurves: routeStats.reduce((best, stats) => 
        stats.curves < best.curves ? stats : best
      ),
      mostCurves: routeStats.reduce((best, stats) => 
        stats.curves > best.curves ? stats : best
      )
    };

    return { routeStats, metrics };
  };

  const comparison = getComparisonMetrics();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '1400px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0F172A' }}>
              Route Comparison Tool
            </h2>
            <p style={{ margin: '8px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
              Compare up to 3 routes side-by-side to find the best option
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setComparisonMode(comparisonMode === 'side-by-side' ? 'table' : 'side-by-side')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#64748B',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {comparisonMode === 'side-by-side' ? '📊 Table View' : '📋 Side-by-Side'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Route Selection */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#F8F9FA', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <strong style={{ fontSize: '16px' }}>Select Routes to Compare (up to 3):</strong>
            <HelpTooltip content="Select up to 3 routes from the list below to compare their metrics side-by-side. Click on a route card to toggle its selection.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '16px' }}>ℹ️</span>
            </HelpTooltip>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {routes.map((route, idx) => {
              const isSelected = selectedRoutes.includes(idx);
              const stats = getRouteStats(route);
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleRoute(idx)}
                  style={{
                    padding: '16px',
                    backgroundColor: isSelected ? '#DBEAFE' : 'white',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? '#3B82F6' : '#E5E7EB'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#3B82F6';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#3B82F6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      ✓
                    </div>
                  )}
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '16px', color: '#0F172A' }}>Route {idx + 1}</strong>
                    {stats && (
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                        {stats.totalDistance} miles • {stats.operatorCount} operator{stats.operatorCount !== 1 ? 's' : ''} • {stats.transferPoints} transfer{stats.transferPoints !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  {stats && (
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      Operators: {stats.operators}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selectedRoutes.length === 0 && (
            <div style={{ marginTop: '16px', padding: '16px', textAlign: 'center', color: '#6B7280', backgroundColor: 'white', borderRadius: '8px' }}>
              Select at least 2 routes to compare
            </div>
          )}
        </div>

        {/* Comparison View */}
        {selectedRoutes.length >= 2 && (
          <div style={{ marginTop: '24px' }}>
            {comparisonMode === 'side-by-side' ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedRoutes.length}, 1fr)`, gap: '16px' }}>
                {selectedRoutes.map((routeIdx, colIdx) => {
                  const route = routes[routeIdx];
                  const stats = getRouteStats(route);
                  return (
                    <div key={routeIdx} style={{
                      padding: '20px',
                      backgroundColor: '#F8F9FA',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Route {routeIdx + 1}</h3>
                        <button
                          onClick={() => handleSelectRoute(routeIdx)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Select
                        </button>
                      </div>
                      {stats && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total Distance</div>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
                              {stats.totalDistance} miles
                            </div>
                          </div>
                          {freightWeight > 0 && (() => {
                            const costEst = estimateRouteCost(routes[routeIdx], freightWeight);
                            const formatted = formatCostEstimate(costEst);
                            return (
                              <div style={{ padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '6px', border: '1px solid #10B981' }}>
                                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Est. Cost</div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>
                                  {formatted.total}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                                  {formatted.perMile}/mile • {formatted.perTon}/ton
                                </div>
                              </div>
                            );
                          })()}
                          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Operators</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                              {stats.operatorCount} ({stats.operators})
                            </div>
                          </div>
                          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Transfer Points</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                              {stats.transferPoints}
                            </div>
                          </div>
                          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>States Traversed</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                              {stats.stateCount} ({stats.states})
                            </div>
                          </div>
                          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Curves/Turns</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                              {stats.curves}
                            </div>
                          </div>
                          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Segments</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                              {stats.segmentCount}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0F172A', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Metric</th>
                      {selectedRoutes.map(routeIdx => (
                        <th key={routeIdx} style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                          Route {routeIdx + 1}
                        </th>
                      ))}
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Best</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison && comparison.routeStats.map((stats, idx) => {
                      const routeIdx = selectedRoutes[idx];
                      return (
                        <React.Fragment key={idx}>
                          <tr style={{ backgroundColor: idx % 2 === 0 ? '#F8F9FA' : 'white' }}>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#0F172A' }}>Distance (miles)</td>
                            {selectedRoutes.map((rIdx, colIdx) => {
                              const s = comparison.routeStats[colIdx];
                              const isBest = parseFloat(s.totalDistance) === parseFloat(comparison.metrics.shortest.totalDistance);
                              return (
                                <td key={rIdx} style={{ 
                                  padding: '12px', 
                                  textAlign: 'center',
                                  backgroundColor: isBest ? '#D1FAE5' : 'transparent',
                                  fontWeight: isBest ? '700' : '400'
                                }}>
                                  {s.totalDistance}
                                </td>
                              );
                            })}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>
                              Route {selectedRoutes.findIndex((_, i) => 
                                parseFloat(comparison.routeStats[i].totalDistance) === parseFloat(comparison.metrics.shortest.totalDistance)
                              ) + 1}
                            </td>
                          </tr>
                          <tr style={{ backgroundColor: idx % 2 === 0 ? '#F8F9FA' : 'white' }}>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#0F172A' }}>Operators</td>
                            {selectedRoutes.map((rIdx, colIdx) => {
                              const s = comparison.routeStats[colIdx];
                              const isBest = s.operatorCount === comparison.metrics.fewestOperators.operatorCount;
                              return (
                                <td key={rIdx} style={{ 
                                  padding: '12px', 
                                  textAlign: 'center',
                                  backgroundColor: isBest ? '#D1FAE5' : 'transparent',
                                  fontWeight: isBest ? '700' : '400'
                                }}>
                                  {s.operatorCount}
                                </td>
                              );
                            })}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>
                              Route {selectedRoutes.findIndex((_, i) => 
                                comparison.routeStats[i].operatorCount === comparison.metrics.fewestOperators.operatorCount
                              ) + 1}
                            </td>
                          </tr>
                          <tr style={{ backgroundColor: idx % 2 === 0 ? '#F8F9FA' : 'white' }}>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#0F172A' }}>Transfer Points</td>
                            {selectedRoutes.map((rIdx, colIdx) => {
                              const s = comparison.routeStats[colIdx];
                              const isBest = s.transferPoints === comparison.metrics.fewestTransfers.transferPoints;
                              return (
                                <td key={rIdx} style={{ 
                                  padding: '12px', 
                                  textAlign: 'center',
                                  backgroundColor: isBest ? '#D1FAE5' : 'transparent',
                                  fontWeight: isBest ? '700' : '400'
                                }}>
                                  {s.transferPoints}
                                </td>
                              );
                            })}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>
                              Route {selectedRoutes.findIndex((_, i) => 
                                comparison.routeStats[i].transferPoints === comparison.metrics.fewestTransfers.transferPoints
                              ) + 1}
                            </td>
                          </tr>
                          <tr style={{ backgroundColor: idx % 2 === 0 ? '#F8F9FA' : 'white' }}>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#0F172A' }}>Curves</td>
                            {selectedRoutes.map((rIdx, colIdx) => {
                              const s = comparison.routeStats[colIdx];
                              const isBest = s.curves === comparison.metrics.fewestCurves.curves;
                              return (
                                <td key={rIdx} style={{ 
                                  padding: '12px', 
                                  textAlign: 'center',
                                  backgroundColor: isBest ? '#D1FAE5' : 'transparent',
                                  fontWeight: isBest ? '700' : '400'
                                }}>
                                  {s.curves}
                                </td>
                              );
                            })}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>
                              Route {selectedRoutes.findIndex((_, i) => 
                                comparison.routeStats[i].curves === comparison.metrics.fewestCurves.curves
                              ) + 1}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {comparison && (
              <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #3B82F6' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Comparison Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Shortest Route</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                      {comparison.metrics.shortest.totalDistance} miles
                    </div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Fewest Operators</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                      {comparison.metrics.fewestOperators.operatorCount} operator{comparison.metrics.fewestOperators.operatorCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Fewest Transfers</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                      {comparison.metrics.fewestTransfers.transferPoints} transfer{comparison.metrics.fewestTransfers.transferPoints !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Fewest Curves</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                      {comparison.metrics.fewestCurves.curves}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteComparison;

