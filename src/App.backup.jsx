import { useState, useMemo } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import RouteConfig from './components/RouteConfig';
import RouteResults from './components/RouteResults';
import { stations } from './data/railNetwork';
import { findRoutes } from './utils/routeFinder';

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [preferences, setPreferences] = useState({
    weightDistance: 1.0,
    weightSingleOperator: 0.5,
    weightCurves: 0.3,
    maxTransfers: 5
  });
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  const routes = useMemo(() => {
    if (!origin || !destination) return [];
    return findRoutes(origin, destination, preferences);
  }, [origin, destination, preferences]);

  const selectedRoute = selectedRouteIndex !== null ? routes[selectedRouteIndex] : null;

  const handleOriginSelect = (code) => {
    setOrigin(code);
    if (code === destination) {
      setDestination(null);
    }
    setSelectedRouteIndex(null);
  };

  const handleDestinationSelect = (code) => {
    setDestination(code);
    setSelectedRouteIndex(null);
  };

  const handleFindRoutes = () => {
    if (origin && destination) {
      setSelectedRouteIndex(0);
    }
  };

  const stationOptions = Object.entries(stations).map(([code, station]) => (
    <option key={code} value={code}>
      {station.name}, {station.state} ({station.operator})
    </option>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <h1>North American Rail Network Route Finder</h1>
        <p className="subtitle">Select origin and destination to find the best rail routes</p>
      </header>
      
      {!stations && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          Error: Stations data not loaded
        </div>
      )}

      <div className="main-container">
        <div className="controls-panel">
          <div className="station-selectors">
            <div className="selector-group">
              <label htmlFor="origin-select">
                <strong>Origin Station:</strong>
              </label>
              <select
                id="origin-select"
                value={origin || ''}
                onChange={(e) => handleOriginSelect(e.target.value || null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select origin...</option>
                {stationOptions}
              </select>
              {origin && (
                <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                  Selected: {stations[origin].name}
                </div>
              )}
            </div>

            <div className="selector-group">
              <label htmlFor="destination-select">
                <strong>Destination Station:</strong>
              </label>
              <select
                id="destination-select"
                value={destination || ''}
                onChange={(e) => handleDestinationSelect(e.target.value || null)}
                disabled={!origin}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  opacity: origin ? 1 : 0.6
                }}
              >
                <option value="">Select destination...</option>
                {stationOptions.filter(opt => opt.props.value !== origin)}
              </select>
              {destination && (
                <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                  Selected: {stations[destination].name}
                </div>
              )}
            </div>

            {origin && destination && (
              <button 
                onClick={handleFindRoutes}
                className="find-routes-btn"
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#646cff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Find Routes
              </button>
            )}
          </div>

          <RouteConfig 
            preferences={preferences} 
            onPreferencesChange={setPreferences} 
          />
        </div>

        <div className="map-panel">
          <MapComponent
            stations={stations}
            origin={origin}
            destination={destination}
            onOriginSelect={handleOriginSelect}
            onDestinationSelect={handleDestinationSelect}
            selectedRoute={selectedRoute}
          />
        </div>
      </div>

      {routes.length > 0 && (
        <div className="results-panel">
          <RouteResults
            routes={routes}
            onRouteSelect={setSelectedRouteIndex}
            selectedRouteIndex={selectedRouteIndex}
          />
        </div>
      )}

      {origin && destination && routes.length === 0 && (
        <div className="no-routes">
          <p>No routes found. Try adjusting your preferences or selecting different stations.</p>
        </div>
      )}
    </div>
  );
}

export default App;
