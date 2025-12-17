import { useEffect, useRef, useState, useCallback } from 'react';
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
  selectedRoute 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeMarkersRef = useRef([]);
  const routePolylinesRef = useRef([]);
  const segmentPolylinesRef = useRef([]);
  const transferMarkersRef = useRef([]);
  const operatorLegendRef = useRef(null);
  const statsPanelRef = useRef(null);
  const tileLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);
  const layerControlRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);

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

    // Remove controls
    if (operatorLegendRef.current) {
      try {
        map.removeControl(operatorLegendRef.current);
      } catch (e) {
        // Ignore removal errors
      }
      operatorLegendRef.current = null;
    }

    if (statsPanelRef.current) {
      try {
        map.removeControl(statsPanelRef.current);
      } catch (e) {
        // Ignore removal errors
      }
      statsPanelRef.current = null;
    }
  }, []);

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

  // Update map bounds when origin/destination changes
  useEffect(() => {
    if (!mapInstanceRef.current || (!origin && !destination)) return;

    try {
      const bounds = [];
      if (origin && stations[origin]) {
        bounds.push([stations[origin].lat, stations[origin].lng]);
      }
      if (destination && stations[destination]) {
        bounds.push([stations[destination].lat, stations[destination].lng]);
      }

      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Error updating map bounds:', error);
    }
  }, [origin, destination, stations]);

  // Render route with detailed visualization
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    cleanupMapElements();
    setHoveredSegment(null);
    setSelectedSegmentIndex(null);

    if (!selectedRoute || !selectedRoute.path || selectedRoute.path.length < 2) {
      return;
    }

    try {
      const map = mapInstanceRef.current;
      const positions = selectedRoute.path.map(station => [station.lat, station.lng]);

      // Calculate comprehensive statistics
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

      // Draw each segment with enhanced styling
      segmentDetails.forEach((segmentDetail, segIndex) => {
        const { from, to, operator, distance, curveScore, states } = segmentDetail;
        
        if (!from || !to || !from.lat || !from.lng || !to.lat || !to.lng) {
          return;
        }

        const operatorInfo = OPERATOR_COLORS[operator] || OPERATOR_COLORS.Default;
        const segmentColor = operatorInfo.color;
        const darkColor = operatorInfo.darkColor || segmentColor;

        // Generate rail line path
        let railLinePath;
        try {
          const segmentData = {
            from: { lat: from.lat, lng: from.lng },
            to: { lat: to.lat, lng: to.lng },
            curveScore: curveScore,
            states: states
          };
          railLinePath = generateSegmentRailPath(segmentData);
          
          if (!railLinePath || railLinePath.length < 2) {
            railLinePath = [[from.lat, from.lng], [to.lat, to.lng]];
          }
        } catch (error) {
          railLinePath = [[from.lat, from.lng], [to.lat, to.lng]];
        }

        // Create interactive segment polyline
        const segmentPolyline = L.polyline(railLinePath, {
          color: segmentColor,
          weight: 8,
          opacity: 0.9,
          smoothFactor: 1.0,
          lineCap: 'round',
          lineJoin: 'round',
          className: `route-segment segment-${segIndex}`
        }).addTo(map);

        // Add shadow/glow effect
        const shadowPolyline = L.polyline(railLinePath, {
          color: segmentColor,
          weight: 12,
          opacity: 0.3,
          smoothFactor: 1.0,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        routePolylinesRef.current.push(shadowPolyline);
        segmentPolylinesRef.current.push(segmentPolyline);

        // Add hover effects
        segmentPolyline.on('mouseover', () => {
          setHoveredSegment(segIndex);
          segmentPolyline.setStyle({
            weight: 12,
            opacity: 1.0
          });
        });

        segmentPolyline.on('mouseout', () => {
          if (selectedSegmentIndex !== segIndex) {
            setHoveredSegment(null);
            segmentPolyline.setStyle({
              weight: 8,
              opacity: 0.9
            });
          }
        });

        segmentPolyline.on('click', () => {
          setSelectedSegmentIndex(segIndex);
        });

        // Add detailed tooltip
        const fromName = from.name || from.code || 'Unknown';
        const toName = to.name || to.code || 'Unknown';
        const statesStr = states.length > 0 ? states.join(', ') : 'N/A';
        
        segmentPolyline.bindTooltip(`
          <div class="segment-tooltip">
            <div class="tooltip-header">
              <span class="operator-logo">${operatorInfo.logo}</span>
              <strong>${operatorInfo.name}</strong>
            </div>
            <div class="tooltip-content">
              <div class="tooltip-row">
                <span class="tooltip-label">Route:</span>
                <span class="tooltip-value">${fromName} → ${toName}</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">Distance:</span>
                <span class="tooltip-value">${distance.toFixed(0)} miles</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">States:</span>
                <span class="tooltip-value">${statesStr}</span>
              </div>
              <div class="tooltip-row">
                <span class="tooltip-label">Curve Score:</span>
                <span class="tooltip-value">${curveScore}/10</span>
              </div>
            </div>
          </div>
        `, {
          permanent: false,
          direction: 'top',
          className: 'segment-tooltip-container',
          offset: [0, -10]
        });

        // Add operator label at midpoint
        try {
          const midPointIndex = Math.floor(railLinePath.length / 2);
          const midPoint = railLinePath[midPointIndex] || railLinePath[Math.floor(railLinePath.length / 2)];
          const [midLat, midLng] = midPoint;
          
          if (midLat && midLng && !isNaN(midLat) && !isNaN(midLng)) {
            const label = L.marker([midLat, midLng], {
              icon: L.divIcon({
                className: 'operator-label',
                html: `<div class="operator-label-badge" style="background: linear-gradient(135deg, ${segmentColor} 0%, ${darkColor} 100%);">
                  <span class="operator-logo-small">${operatorInfo.logo}</span>
                  <span class="operator-name-small">${operator}</span>
                </div>`,
                iconSize: [100, 30],
                iconAnchor: [50, 15]
              })
            }).addTo(map);
            
            routeMarkersRef.current.push(label);
          }
        } catch (error) {
          // Ignore label creation errors
        }
      });

      // Add transfer point markers
      if (selectedRoute.transferPoints && selectedRoute.transferPoints.length > 0) {
        selectedRoute.transferPoints.forEach((transfer, index) => {
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

      // Add waypoint markers for intermediate stations
      selectedRoute.path.forEach((station, index) => {
        if (index > 0 && index < selectedRoute.path.length - 1) {
          const waypointMarker = L.marker([station.lat, station.lng], {
            icon: L.divIcon({
              className: 'waypoint-marker',
              html: `<div class="waypoint-dot"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).addTo(map);
          
          waypointMarker.bindPopup(`
            <div class="waypoint-popup">
              <strong>${station.name}</strong><br/>
              <span>${station.state}</span><br/>
              <em>Route waypoint</em>
            </div>
          `);
          
          routeMarkersRef.current.push(waypointMarker);
        }
      });

      // Add comprehensive statistics panel
      const statsHtml = `
        <div class="route-stats-panel">
          <div class="stats-header">
            <h3>Route Statistics</h3>
          </div>
          <div class="stats-content">
            <div class="stat-group">
              <div class="stat-item">
                <span class="stat-label">Total Distance</span>
                <span class="stat-value">${totalDistance.toFixed(0)} miles</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Segments</span>
                <span class="stat-value">${segmentDetails.length}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Operators</span>
                <span class="stat-value">${Object.keys(operatorStats).length}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Transfer Points</span>
                <span class="stat-value">${selectedRoute.transferPoints?.length || 0}</span>
              </div>
            </div>
            <div class="operator-breakdown">
              <h4>Operator Breakdown</h4>
              ${Object.entries(operatorStats).map(([op, stats]) => {
                const opInfo = OPERATOR_COLORS[op] || OPERATOR_COLORS.Default;
                const percentage = totalDistance > 0 ? ((stats.distance / totalDistance) * 100).toFixed(1) : 0;
                return `
                  <div class="operator-stat-row">
                    <div class="operator-stat-header">
                      <span class="operator-stat-logo">${opInfo.logo}</span>
                      <strong>${opInfo.name}</strong>
                      <span class="operator-stat-percentage">${percentage}%</span>
                    </div>
                    <div class="operator-stat-details">
                      <span>${stats.distance.toFixed(0)} miles</span>
                      <span>•</span>
                      <span>${stats.segments} segment${stats.segments !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>${stats.stations.size} station${stats.stations.size !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="operator-stat-bar">
                      <div class="operator-stat-bar-fill" style="width: ${percentage}%; background: ${opInfo.color};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            ${segmentDetails.length > 0 ? `
              <div class="segment-list">
                <h4>Segment Details</h4>
                <div class="segment-list-content">
                  ${segmentDetails.map((seg, idx) => {
                    const segOpInfo = OPERATOR_COLORS[seg.operator] || OPERATOR_COLORS.Default;
                    return `
                      <div class="segment-list-item ${selectedSegmentIndex === idx ? 'selected' : ''}" 
                           data-segment-index="${idx}">
                        <div class="segment-list-color" style="background: ${segOpInfo.color};"></div>
                        <div class="segment-list-content">
                          <div class="segment-list-route">
                            ${seg.from.name || seg.from.code} → ${seg.to.name || seg.to.code}
                          </div>
                          <div class="segment-list-details">
                            <span>${seg.operator}</span>
                            <span>•</span>
                            <span>${seg.distance.toFixed(0)} miles</span>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      statsPanelRef.current = L.control({ position: 'topleft' });
      statsPanelRef.current.onAdd = function() {
        const div = L.DomUtil.create('div', 'route-stats-container');
        div.innerHTML = statsHtml;
        L.DomEvent.disableClickPropagation(div);
        
        // Add click handlers for segment list items
        div.querySelectorAll('.segment-list-item').forEach((item, idx) => {
          item.addEventListener('click', () => {
            setSelectedSegmentIndex(idx);
            // Scroll segment into view on map
            const segment = segmentDetails[idx];
            if (segment && segment.from && segment.to) {
              const bounds = L.latLngBounds([
                [segment.from.lat, segment.from.lng],
                [segment.to.lat, segment.to.lng]
              ]);
              map.fitBounds(bounds, { padding: [100, 100] });
            }
          });
        });
        
        return div;
      };
      statsPanelRef.current.addTo(map);

      // Fit bounds to route
      if (positions.length > 0) {
        try {
          const bounds = L.latLngBounds(positions);
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 10
          });
          
          // Zoom in closer for shorter routes
          const boundsSize = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
          if (boundsSize < 500000) {
            setTimeout(() => {
              const currentZoom = map.getZoom();
              map.setZoom(Math.min(currentZoom + 1, 12));
            }, 500);
          }
        } catch (error) {
          console.error('Error fitting route bounds:', error);
        }
      }
    } catch (error) {
      console.error('Error rendering route:', error);
    }
  }, [selectedRoute, cleanupMapElements, hoveredSegment, selectedSegmentIndex]);

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
    <div className="map-container">
      <div ref={mapRef} className="map-wrapper" />
    </div>
  );
}

export default MapComponent;
