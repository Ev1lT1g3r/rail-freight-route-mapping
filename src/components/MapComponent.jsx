import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { generateSegmentRailPath } from '../utils/railLinePath';

// Operator colors and branding
const OPERATOR_COLORS = {
  'BNSF': { color: '#FFD700', name: 'BNSF Railway', logo: '🚂' },
  'UP': { color: '#FF6B35', name: 'Union Pacific', logo: '🚂' },
  'CSX': { color: '#4ECDC4', name: 'CSX Transportation', logo: '🚂' },
  'NS': { color: '#45B7D1', name: 'Norfolk Southern', logo: '🚂' },
  'CN': { color: '#96CEB4', name: 'Canadian National', logo: '🚂' },
  'CP': { color: '#FFEAA7', name: 'Canadian Pacific', logo: '🚂' },
  'Multiple': { color: '#A0A0A0', name: 'Multiple Operators', logo: '🚂' },
  'Default': { color: '#FF0000', name: 'Unknown', logo: '🚂' }
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
    console.warn('Leaflet icon setup warning:', e);
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
  const operatorInfoPanelsRef = useRef([]);
  const operatorLegendRef = useRef(null);
  const polylineRef = useRef(null);
  const tileLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);
  const layerControlRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mapView, setMapView] = useState('map'); // 'map' or 'satellite'

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isMounted || !mapRef.current || !stations || Object.keys(stations).length === 0) {
      return;
    }

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [39.8283, -98.5795],
        zoom: 4,
        scrollWheelZoom: true,
        zoomControl: true
      });

      // Add standard map tile layer
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });

      // Add satellite/imagery tile layer (Esri World Imagery)
      satelliteLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19
      });

      // Add default map layer
      tileLayerRef.current.addTo(mapInstanceRef.current);

      // Add layer control
      const baseMaps = {
        'Map View': tileLayerRef.current,
        'Satellite View': satelliteLayerRef.current
      };
      layerControlRef.current = L.control.layers(baseMaps).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for all stations with different styles for origin/destination
    Object.entries(stations).forEach(([code, station]) => {
      const isOrigin = code === origin;
      const isDestination = code === destination;
      
      // Create custom icon based on whether it's origin or destination
      let icon;
      if (isOrigin) {
        icon = L.divIcon({
          className: 'origin-marker',
          html: `<div style="
            width: 24px;
            height: 24px;
            background-color: #00ff00;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 14px;
          ">O</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
      } else if (isDestination) {
        icon = L.divIcon({
          className: 'destination-marker',
          html: `<div style="
            width: 24px;
            height: 24px;
            background-color: #ff0000;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 14px;
          ">D</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
      } else {
        // Default marker for other stations
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
          <div>
            <strong>${station.name}</strong><br />
            ${station.state}<br />
            ${station.operator}${isOrigin ? '<br /><strong style="color: green;">ORIGIN</strong>' : ''}${isDestination ? '<br /><strong style="color: red;">DESTINATION</strong>' : ''}
          </div>
        `);

      // Add click handler
      marker.on('click', () => {
        if (!origin) {
          onOriginSelect(code);
        } else if (!destination && code !== origin) {
          onDestinationSelect(code);
        }
      });

      markersRef.current.push(marker);
    });

    // Cleanup function
    return () => {
      // Don't destroy map on cleanup, just remove markers
    };
  }, [isMounted, stations, origin, destination, onOriginSelect, onDestinationSelect]);

  // Update map bounds when origin/destination changes
  useEffect(() => {
    if (!mapInstanceRef.current || (!origin && !destination)) return;

    const bounds = [];
    if (origin && stations[origin]) {
      bounds.push([stations[origin].lat, stations[origin].lng]);
    }
    if (destination && stations[destination]) {
      bounds.push([stations[destination].lat, stations[destination].lng]);
    }

    if (bounds.length > 0) {
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.warn('Error fitting bounds:', e);
      }
    }
  }, [origin, destination, stations]);

  // Update route polyline - draw through all intermediate stations
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing route markers and polylines
    routeMarkersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    routeMarkersRef.current = [];

    routePolylinesRef.current.forEach(polyline => {
      mapInstanceRef.current.removeLayer(polyline);
    });
    routePolylinesRef.current = [];

    // Remove operator info panels
    operatorInfoPanelsRef.current.forEach(panel => {
      mapInstanceRef.current.removeLayer(panel);
    });
    operatorInfoPanelsRef.current = [];

    // Remove operator legend
    if (operatorLegendRef.current) {
      mapInstanceRef.current.removeControl(operatorLegendRef.current);
      operatorLegendRef.current = null;
    }

    // Remove existing polyline
    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // Add new polyline if route is selected - draw through all stations in path
    if (selectedRoute && selectedRoute.path && selectedRoute.path.length > 1) {
      // Switch to satellite view when route is shown
      if (satelliteLayerRef.current && tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
        satelliteLayerRef.current.addTo(mapInstanceRef.current);
        setMapView('satellite');
      }

      // Create polyline through all stations in the route path (follows actual route)
      const positions = selectedRoute.path.map(station => [station.lat, station.lng]);
      
      // Calculate operator statistics
      const operatorStats = {};
      if (selectedRoute.segments) {
        selectedRoute.segments.forEach(segment => {
          if (!operatorStats[segment.operator]) {
            operatorStats[segment.operator] = {
              distance: 0,
              segments: 0,
              stations: new Set()
            };
          }
          operatorStats[segment.operator].segments++;
          // Estimate segment distance
          const fromStation = selectedRoute.path.find(s => s.code === segment.from.code);
          const toStation = selectedRoute.path.find(s => s.code === segment.to.code);
          if (fromStation && toStation) {
            const distance = mapInstanceRef.current.distance([fromStation.lat, fromStation.lng], [toStation.lat, toStation.lng]) * 0.000621371; // Convert to miles
            operatorStats[segment.operator].distance += distance;
            operatorStats[segment.operator].stations.add(segment.from.code);
            operatorStats[segment.operator].stations.add(segment.to.code);
          }
        });
      }

      // Draw route line with operator-specific colors for each segment
      if (selectedRoute.segments && selectedRoute.segments.length > 0) {
        // Draw each segment with operator-specific styling along actual rail lines
        selectedRoute.segments.forEach((segment, segIndex) => {
          const segmentStart = selectedRoute.path[segIndex];
          const segmentEnd = selectedRoute.path[segIndex + 1];
          
          if (segmentStart && segmentEnd) {
            // Generate realistic rail line path with intermediate waypoints
            const segmentData = {
              from: { lat: segmentStart.lat, lng: segmentStart.lng },
              to: { lat: segmentEnd.lat, lng: segmentEnd.lng },
              curveScore: segment.curveScore || 5,
              states: segment.states || []
            };
            
            // Generate rail line path with intermediate waypoints
            const railLinePath = generateSegmentRailPath(segmentData);
            
            const operatorInfo = OPERATOR_COLORS[segment.operator] || OPERATOR_COLORS.Default;
            const segmentColor = operatorInfo.color;
            
            // Enhanced polyline following rail lines with smooth curves
            const segmentPolyline = L.polyline(railLinePath, {
              color: segmentColor,
              weight: 10,
              opacity: 0.9,
              smoothFactor: 1.0, // Smooth the curves
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(mapInstanceRef.current);
            
            // Add shadow/glow effect with a slightly offset polyline
            const shadowPolyline = L.polyline(railLinePath, {
              color: segmentColor,
              weight: 14,
              opacity: 0.3,
              smoothFactor: 1.0,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(mapInstanceRef.current);
            routePolylinesRef.current.push(shadowPolyline);
            
            // Add operator label at midpoint of the rail line path
            const midPointIndex = Math.floor(railLinePath.length / 2);
            const midPoint = railLinePath[midPointIndex] || railLinePath[Math.floor(railLinePath.length / 2)];
            const midLat = midPoint[0];
            const midLng = midPoint[1];
            
            const label = L.marker([midLat, midLng], {
              icon: L.divIcon({
                className: 'operator-label',
                html: `<div style="
                  background: linear-gradient(135deg, ${segmentColor} 0%, ${segmentColor}dd 100%);
                  color: white;
                  padding: 6px 12px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: bold;
                  white-space: nowrap;
                  box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                  border: 2px solid white;
                  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                ">${operatorInfo.logo} ${segment.operator}</div>`,
                iconSize: [80, 28],
                iconAnchor: [40, 14]
              })
            }).addTo(mapInstanceRef.current);
            
            // Add info popup on hover
            label.bindTooltip(`
              <div style="font-size: 12px; line-height: 1.4;">
                <strong>${operatorInfo.name}</strong><br/>
                Segment: ${segmentStart.name} → ${segmentEnd.name}<br/>
                Distance: ~${operatorStats[segment.operator]?.distance.toFixed(0) || 'N/A'} miles
              </div>
            `, { permanent: false, direction: 'top' });
            
            routePolylinesRef.current.push(segmentPolyline);
            routeMarkersRef.current.push(label);
          }
        });

        // Add operator legend panel
        const legendHtml = `
          <div style="
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 12px;
            min-width: 200px;
          ">
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px; border-bottom: 2px solid #ddd; padding-bottom: 6px;">
              Route Operators
            </div>
            ${Object.entries(operatorStats).map(([op, stats]) => {
              const opInfo = OPERATOR_COLORS[op] || OPERATOR_COLORS.Default;
              return `
                <div style="margin-bottom: 8px; padding: 6px; background: #f8f9fa; border-radius: 4px; border-left: 4px solid ${opInfo.color};">
                  <div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 16px; margin-right: 6px;">${opInfo.logo}</span>
                    <strong style="color: ${opInfo.color};">${op}</strong>
                  </div>
                  <div style="font-size: 11px; color: #666; margin-left: 22px;">
                    ${stats.segments} segment${stats.segments !== 1 ? 's' : ''} • 
                    ~${stats.distance.toFixed(0)} miles<br/>
                    ${stats.stations.size} station${stats.stations.size !== 1 ? 's' : ''}
                  </div>
                </div>
              `;
            }).join('')}
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
              Total: ${selectedRoute.totalDistance.toFixed(0)} miles<br/>
              ${selectedRoute.operatorCount} operator${selectedRoute.operatorCount !== 1 ? 's' : ''}
            </div>
          </div>
        `;

        operatorLegendRef.current = L.control({ position: 'topright' });
        operatorLegendRef.current.onAdd = function() {
          const div = L.DomUtil.create('div', 'operator-legend');
          div.innerHTML = legendHtml;
          L.DomEvent.disableClickPropagation(div);
          return div;
        };
        operatorLegendRef.current.addTo(mapInstanceRef.current);
      } else {
        // Fallback: single polyline if segments not available
        polylineRef.current = L.polyline(positions, {
          color: '#FF0000',
          weight: 8,
          opacity: 0.95,
          smoothFactor: 0.5
        }).addTo(mapInstanceRef.current);
      }

      // Add waypoint markers at each intermediate station in the route
      selectedRoute.path.forEach((station, index) => {
        if (index > 0 && index < selectedRoute.path.length - 1) {
          // Intermediate waypoint marker (orange)
          const marker = L.marker([station.lat, station.lng], {
            icon: L.divIcon({
              className: 'route-intermediate-marker',
              html: `<div style="
                width: 16px;
                height: 16px;
                background-color: #ff8800;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.5);
              "></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })
          }).addTo(mapInstanceRef.current);
          
          marker.bindPopup(`
            <div>
              <strong>${station.name}</strong><br />
              ${station.state}<br />
              <em>Route waypoint</em>
            </div>
          `);
          
          routeMarkersRef.current.push(marker);
        }
      });

      // Fit bounds to route with tighter padding for closer view
      if (positions.length > 0) {
        try {
          // Calculate tighter bounds for closer zoom
          const bounds = L.latLngBounds(positions);
          mapInstanceRef.current.fitBounds(bounds, { 
            padding: [20, 20], // Reduced padding for closer view
            maxZoom: 12 // Limit max zoom for better track visibility
          });
          
          // If route is short, zoom in even closer
          const boundsSize = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
          if (boundsSize < 500000) { // Less than ~500km
            setTimeout(() => {
              mapInstanceRef.current.setZoom(Math.min(mapInstanceRef.current.getZoom() + 2, 14));
            }, 500);
          }
        } catch (e) {
          console.warn('Error fitting route bounds:', e);
        }
      }
    } else {
      // No route selected - switch back to map view
      if (satelliteLayerRef.current && tileLayerRef.current && mapView === 'satellite') {
        mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
        tileLayerRef.current.addTo(mapInstanceRef.current);
        setMapView('map');
      }
    }
  }, [selectedRoute, mapView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <div style={{ height: '600px', width: '100%', borderRadius: '8px', padding: '20px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (!stations || Object.keys(stations).length === 0) {
    return (
      <div style={{ height: '600px', width: '100%', borderRadius: '8px', padding: '20px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Stations data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      style={{ height: '600px', width: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative', zIndex: 0 }}
    />
  );
}

export default MapComponent;
