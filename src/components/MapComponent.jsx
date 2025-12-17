import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { generateSegmentRailPath } from '../utils/railLinePath';
import './MapComponent.css';

// Enhanced operator colors and branding
const OPERATOR_COLORS = {
  'BNSF': { color: '#FFD700', name: 'BNSF Railway', logo: '🚂', darkColor: '#D4AF37' },
  'UP': { color: '#FF6B35', name: 'Union Pacific', logo: '🚂', darkColor: '#E55A2B' },
  'CSX': { color: '#4ECDC4', name: 'CSX Transportation', logo: '🚂', darkColor: '#3BA99F' },
  'NS': { color: '#45B7D1', name: 'Norfolk Southern', logo: '🚂', darkColor: '#2E9FC4' },
  'CN': { color: '#96CEB4', name: 'Canadian National', logo: '🚂', darkColor: '#7AB89A' },
  'CP': { color: '#FFEAA7', name: 'Canadian Pacific', logo: '🚂', darkColor: '#E6D396' },
  'KCS': { color: '#A29BFE', name: 'Kansas City Southern', logo: '🚂', darkColor: '#8B7FE8' },
  'KCSM': { color: '#A29BFE', name: 'KCSM', logo: '🚂', darkColor: '#8B7FE8' },
  'Multiple': { color: '#A0A0A0', name: 'Multiple Operators', logo: '🚂', darkColor: '#808080' },
  'Default': { color: '#FF0000', name: 'Unknown', logo: '🚂', darkColor: '#CC0000' }
};

// Route colors for different routes (when showing all routes)
const ROUTE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

// Fix for default marker icons
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  } catch (e) {
    // Silently handle icon setup errors
  }
}

function MapComponent({ 
  stations, 
  origin, 
  destination, 
  onOriginSelect, 
  onDestinationSelect,
  routes = [],
  selectedRouteIndex = null
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeMarkersRef = useRef([]);
  const routePolylinesRef = useRef([]);
  const segmentPolylinesRef = useRef([]);
  const transferMarkersRef = useRef([]);
  const tileLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);
  const layerControlRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);

  const selectedRoute = selectedRouteIndex !== null && selectedRouteIndex !== undefined 
    ? routes[selectedRouteIndex] 
    : null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cleanup function
  const cleanupMapElements = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove all markers
    [...markersRef.current, ...routeMarkersRef.current, ...transferMarkersRef.current].forEach(marker => {
      try {
        map.removeLayer(marker);
      } catch (e) {
        // Ignore removal errors
      }
    });
    markersRef.current = [];
    routeMarkersRef.current = [];
    transferMarkersRef.current = [];

    // Remove all polylines
    [...routePolylinesRef.current, ...segmentPolylinesRef.current].forEach(polyline => {
      try {
        map.removeLayer(polyline);
      } catch (e) {
        // Ignore removal errors
      }
    });
    routePolylinesRef.current = [];
    segmentPolylinesRef.current = [];
  }, []);

  // Calculate statistics for selected route
  const routeStats = useMemo(() => {
    if (!selectedRoute) return null;

    const operatorStats = {};
    const segmentDetails = [];
    let totalDistance = 0;

    if (selectedRoute.segments && selectedRoute.segments.length > 0) {
      selectedRoute.segments.forEach((segment, index) => {
        const segmentDistance = segment.distance || 0;
        totalDistance += segmentDistance;

        if (!operatorStats[segment.operator]) {
          operatorStats[segment.operator] = {
            distance: 0,
            segments: 0,
            stations: new Set(),
            color: OPERATOR_COLORS[segment.operator]?.color || OPERATOR_COLORS.Default.color
          };
        }
        operatorStats[segment.operator].segments++;
        operatorStats[segment.operator].distance += segmentDistance;

        const segmentStart = segment.from || selectedRoute.path[index];
        const segmentEnd = segment.to || selectedRoute.path[index + 1];

        if (segmentStart && segmentEnd) {
          operatorStats[segment.operator].stations.add(segmentStart.code || segmentStart.name);
          operatorStats[segment.operator].stations.add(segmentEnd.code || segmentEnd.name);
        }

        segmentDetails.push({
          index,
          operator: segment.operator,
          from: segmentStart,
          to: segmentEnd,
          distance: segmentDistance,
          curveScore: segment.curveScore || 0,
          states: segment.states || []
        });
      });
    }

    return {
      totalDistance,
      segmentDetails,
      operatorStats,
      transferPoints: selectedRoute.transferPoints?.length || 0
    };
  }, [selectedRoute]);

  // Initialize map
  useEffect(() => {
    if (!isMounted || !mapRef.current || !stations || Object.keys(stations).length === 0) {
      return;
    }

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      try {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [39.8283, -98.5795],
          zoom: 4,
          scrollWheelZoom: true,
          zoomControl: true,
          attributionControl: true
        });

        // Add standard map tile layer
        tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });

        // Add satellite/imagery tile layer
        satelliteLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
          maxZoom: 19
        });

        // Add default satellite layer
        satelliteLayerRef.current.addTo(mapInstanceRef.current);

        // Add layer control
        const baseMaps = {
          'Satellite View': satelliteLayerRef.current,
          'Map View': tileLayerRef.current
        };
        layerControlRef.current = L.control.layers(baseMaps).addTo(mapInstanceRef.current);
      } catch (error) {
        console.error('Error initializing map:', error);
        return;
      }
    }

    const map = mapInstanceRef.current;
    cleanupMapElements();

    // Add markers for all stations
    try {
      Object.entries(stations).forEach(([code, station]) => {
        const isOrigin = code === origin;
        const isDestination = code === destination;
        
        let icon;
        if (isOrigin) {
          icon = L.divIcon({
            className: 'origin-marker',
            html: `<div class="station-marker origin">
              <span class="marker-label">O</span>
              <div class="marker-pulse"></div>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
        } else if (isDestination) {
          icon = L.divIcon({
            className: 'destination-marker',
            html: `<div class="station-marker destination">
              <span class="marker-label">D</span>
              <div class="marker-pulse"></div>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
        } else {
          icon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        }
        
        const marker = L.marker([station.lat, station.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="station-popup">
              <strong>${station.name}</strong><br />
              <span class="station-state">${station.state}</span><br />
              <span class="station-operator">${station.operator}</span>
              ${isOrigin ? '<br /><strong class="origin-badge">ORIGIN</strong>' : ''}
              ${isDestination ? '<br /><strong class="destination-badge">DESTINATION</strong>' : ''}
            </div>
          `);

        marker.on('click', () => {
          if (!origin) {
            onOriginSelect?.(code);
          } else if (!destination && code !== origin) {
            onDestinationSelect?.(code);
          }
        });

        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error adding station markers:', error);
    }

    return () => {
      cleanupMapElements();
    };
  }, [isMounted, stations, origin, destination, onOriginSelect, onDestinationSelect, cleanupMapElements]);

  // Render all routes
  useEffect(() => {
    if (!mapInstanceRef.current || !routes || routes.length === 0) return;

    cleanupMapElements();
    setHoveredSegment(null);
    setSelectedSegmentIndex(null);

    try {
      const map = mapInstanceRef.current;
      const allBounds = [];

      // Draw all routes
      routes.forEach((route, routeIndex) => {
        if (!route || !route.path || route.path.length < 2) return;

        const isSelected = routeIndex === selectedRouteIndex;
        const routeColor = isSelected ? ROUTE_COLORS[0] : ROUTE_COLORS[routeIndex % ROUTE_COLORS.length];
        const routeOpacity = isSelected ? 0.9 : 0.4;
        const routeWeight = isSelected ? 8 : 4;

        // Draw each segment
        if (route.segments && route.segments.length > 0) {
          route.segments.forEach((segment, segIndex) => {
            const segmentStart = segment.from || route.path[segIndex];
            const segmentEnd = segment.to || route.path[segIndex + 1];
            
            if (!segmentStart || !segmentEnd || !segmentStart.lat || !segmentStart.lng || !segmentEnd.lat || !segmentEnd.lng) {
              return;
            }

            // Generate rail line path
            let railLinePath;
            try {
              const segmentData = {
                from: { lat: segmentStart.lat, lng: segmentStart.lng },
                to: { lat: segmentEnd.lat, lng: segmentEnd.lng },
                curveScore: segment.curveScore || 5,
                states: segment.states || []
              };
              railLinePath = generateSegmentRailPath(segmentData);
              
              if (!railLinePath || railLinePath.length < 2) {
                railLinePath = [[segmentStart.lat, segmentStart.lng], [segmentEnd.lat, segmentEnd.lng]];
              }
            } catch (error) {
              railLinePath = [[segmentStart.lat, segmentStart.lng], [segmentEnd.lat, segmentEnd.lng]];
            }

            // Create polyline
            const segmentPolyline = L.polyline(railLinePath, {
              color: routeColor,
              weight: routeWeight,
              opacity: routeOpacity,
              smoothFactor: 1.0,
              lineCap: 'round',
              lineJoin: 'round',
              className: `route-segment route-${routeIndex} segment-${segIndex}`
            }).addTo(map);

            // Add shadow for selected route
            if (isSelected) {
              const shadowPolyline = L.polyline(railLinePath, {
                color: routeColor,
                weight: routeWeight + 4,
                opacity: 0.3,
                smoothFactor: 1.0,
                lineCap: 'round',
                lineJoin: 'round'
              }).addTo(map);
              routePolylinesRef.current.push(shadowPolyline);
            }

            routePolylinesRef.current.push(segmentPolyline);

            // Add to bounds
            railLinePath.forEach(([lat, lng]) => {
              allBounds.push([lat, lng]);
            });
          });
        }

        // Add transfer points for selected route only
        if (isSelected && route.transferPoints && route.transferPoints.length > 0) {
          route.transferPoints.forEach((transfer) => {
            if (transfer.station && transfer.station.lat && transfer.station.lng) {
              const transferMarker = L.marker([transfer.station.lat, transfer.station.lng], {
                icon: L.divIcon({
                  className: 'transfer-marker',
                  html: `<div class="transfer-point">
                    <div class="transfer-icon">🔄</div>
                    <div class="transfer-label">Transfer</div>
                  </div>`,
                  iconSize: [60, 60],
                  iconAnchor: [30, 30]
                })
              }).addTo(map);

              transferMarker.bindPopup(`
                <div class="transfer-popup">
                  <strong>Transfer Point</strong><br/>
                  <span>${transfer.station.name}</span><br/>
                  <div class="transfer-operators">
                    <span class="operator-badge" style="background: ${OPERATOR_COLORS[transfer.fromOperator]?.color || '#ccc'}">
                      ${transfer.fromOperator}
                    </span>
                    <span class="transfer-arrow">→</span>
                    <span class="operator-badge" style="background: ${OPERATOR_COLORS[transfer.toOperator]?.color || '#ccc'}">
                      ${transfer.toOperator}
                    </span>
                  </div>
                </div>
              `);

              transferMarkersRef.current.push(transferMarker);
            }
          });
        }
      });

      // Fit bounds to all routes
      if (allBounds.length > 0) {
        try {
          const bounds = L.latLngBounds(allBounds);
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 10
          });
        } catch (error) {
          console.error('Error fitting route bounds:', error);
        }
      }
    } catch (error) {
      console.error('Error rendering routes:', error);
    }
  }, [routes, selectedRouteIndex, cleanupMapElements]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="map-container loading">
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (!stations || Object.keys(stations).length === 0) {
    return (
      <div className="map-container error">
        <div className="map-error">
          <p>Stations data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-with-stats-container">
      <div className="map-container">
        <div ref={mapRef} className="map-wrapper" />
      </div>
      {routeStats && (
        <div className="route-stats-panel-fixed">
          <div className="stats-header">
            <h3>Route Statistics</h3>
            {selectedRouteIndex !== null && (
              <span className="route-number-badge-small">Route #{selectedRouteIndex + 1}</span>
            )}
          </div>
          <div className="stats-content">
            <div className="stat-group">
              <div className="stat-item">
                <span className="stat-label">Total Distance</span>
                <span className="stat-value">{routeStats.totalDistance.toFixed(0)} miles</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Segments</span>
                <span className="stat-value">{routeStats.segmentDetails.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Operators</span>
                <span className="stat-value">{Object.keys(routeStats.operatorStats).length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Transfer Points</span>
                <span className="stat-value">{routeStats.transferPoints}</span>
              </div>
            </div>
            <div className="operator-breakdown">
              <h4>Operator Breakdown</h4>
              {Object.entries(routeStats.operatorStats).map(([op, stats]) => {
                const opInfo = OPERATOR_COLORS[op] || OPERATOR_COLORS.Default;
                const percentage = routeStats.totalDistance > 0 ? ((stats.distance / routeStats.totalDistance) * 100).toFixed(1) : 0;
                return (
                  <div key={op} className="operator-stat-row">
                    <div className="operator-stat-header">
                      <span className="operator-stat-logo">{opInfo.logo}</span>
                      <strong>{opInfo.name}</strong>
                      <span className="operator-stat-percentage">{percentage}%</span>
                    </div>
                    <div className="operator-stat-details">
                      <span>{stats.distance.toFixed(0)} miles</span>
                      <span>•</span>
                      <span>{stats.segments} segment{stats.segments !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{stats.stations.size} station{stats.stations.size !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="operator-stat-bar">
                      <div className="operator-stat-bar-fill" style={{ width: `${percentage}%`, background: opInfo.color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {routeStats.segmentDetails.length > 0 && (
              <div className="segment-list">
                <h4>Segment Details</h4>
                <div className="segment-list-content">
                  {routeStats.segmentDetails.map((seg, idx) => {
                    const segOpInfo = OPERATOR_COLORS[seg.operator] || OPERATOR_COLORS.Default;
                    return (
                      <div 
                        key={idx}
                        className={`segment-list-item ${selectedSegmentIndex === idx ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedSegmentIndex(idx);
                          if (mapInstanceRef.current && seg.from && seg.to) {
                            const bounds = L.latLngBounds([
                              [seg.from.lat, seg.from.lng],
                              [seg.to.lat, seg.to.lng]
                            ]);
                            mapInstanceRef.current.fitBounds(bounds, { padding: [100, 100] });
                          }
                        }}
                      >
                        <div className="segment-list-color" style={{ background: segOpInfo.color }}></div>
                        <div className="segment-list-content">
                          <div className="segment-list-route">
                            {seg.from.name || seg.from.code} → {seg.to.name || seg.to.code}
                          </div>
                          <div className="segment-list-details">
                            <span>{seg.operator}</span>
                            <span>•</span>
                            <span>{seg.distance.toFixed(0)} miles</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapComponent;
