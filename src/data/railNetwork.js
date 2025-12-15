// North American Freight Rail Network Data
// This includes major freight rail terminals and connections

export const stations = {
  'CHI': { name: 'Chicago', lat: 41.8781, lng: -87.6298, state: 'IL', operator: 'Multiple' },
  'KC': { name: 'Kansas City', lat: 39.0997, lng: -94.5786, state: 'MO', operator: 'Multiple' },
  'STL': { name: 'St. Louis', lat: 38.6270, lng: -90.1994, state: 'MO', operator: 'Multiple' },
  'MEM': { name: 'Memphis', lat: 35.1495, lng: -90.0490, state: 'TN', operator: 'Multiple' },
  'ATL': { name: 'Atlanta', lat: 33.7490, lng: -84.3880, state: 'GA', operator: 'CSX' },
  'JAX': { name: 'Jacksonville', lat: 30.3322, lng: -81.6557, state: 'FL', operator: 'CSX' },
  'NOR': { name: 'Norfolk', lat: 36.8468, lng: -76.2852, state: 'VA', operator: 'NS' },
  'PIT': { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959, state: 'PA', operator: 'NS' },
  'CLE': { name: 'Cleveland', lat: 41.4993, lng: -81.6944, state: 'OH', operator: 'NS' },
  'DET': { name: 'Detroit', lat: 42.3314, lng: -83.0458, state: 'MI', operator: 'CN' },
  'TOR': { name: 'Toronto', lat: 43.6532, lng: -79.3832, state: 'ON', operator: 'CN' },
  'MON': { name: 'Montreal', lat: 45.5017, lng: -73.5673, state: 'QC', operator: 'CN' },
  'VAN': { name: 'Vancouver', lat: 49.2827, lng: -123.1207, state: 'BC', operator: 'CP' },
  'CAL': { name: 'Calgary', lat: 51.0447, lng: -114.0719, state: 'AB', operator: 'CP' },
  'SEA': { name: 'Seattle', lat: 47.6062, lng: -122.3321, state: 'WA', operator: 'BNSF' },
  'POR': { name: 'Portland', lat: 45.5152, lng: -122.6784, state: 'OR', operator: 'BNSF' },
  'LAX': { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, state: 'CA', operator: 'BNSF' },
  'PHX': { name: 'Phoenix', lat: 33.4484, lng: -112.0740, state: 'AZ', operator: 'UP' },
  'DEN': { name: 'Denver', lat: 39.7392, lng: -104.9903, state: 'CO', operator: 'UP' },
  'SLC': { name: 'Salt Lake City', lat: 40.7608, lng: -111.8910, state: 'UT', operator: 'UP' },
  'HOU': { name: 'Houston', lat: 29.7604, lng: -95.3698, state: 'TX', operator: 'UP' },
  'DAL': { name: 'Dallas', lat: 32.7767, lng: -96.7970, state: 'TX', operator: 'UP' },
  'NO': { name: 'New Orleans', lat: 29.9511, lng: -90.0715, state: 'LA', operator: 'NS' },
  'MIN': { name: 'Minneapolis', lat: 44.9778, lng: -93.2650, state: 'MN', operator: 'BNSF' },
  'OMA': { name: 'Omaha', lat: 41.2565, lng: -95.9345, state: 'NE', operator: 'UP' },
  'SPO': { name: 'Spokane', lat: 47.6588, lng: -117.4260, state: 'WA', operator: 'BNSF' },
  'BIL': { name: 'Billings', lat: 45.7833, lng: -108.5007, state: 'MT', operator: 'BNSF' },
  'FAR': { name: 'Fargo', lat: 46.8772, lng: -96.7898, state: 'ND', operator: 'BNSF' },
  'WIN': { name: 'Winnipeg', lat: 49.8951, lng: -97.1384, state: 'MB', operator: 'CN' },
};

// Freight rail connections with distance (miles), operator, and curve score (1-10, lower = straighter)
export const connections = [
  // Major Class I Railroad Routes
  // BNSF Routes
  { from: 'CHI', to: 'MIN', distance: 410, operator: 'BNSF', curveScore: 4, states: ['IL', 'WI', 'MN'] },
  { from: 'MIN', to: 'FAR', distance: 240, operator: 'BNSF', curveScore: 3, states: ['MN', 'ND'] },
  { from: 'FAR', to: 'BIL', distance: 680, operator: 'BNSF', curveScore: 5, states: ['ND', 'MT'] },
  { from: 'BIL', to: 'SPO', distance: 420, operator: 'BNSF', curveScore: 6, states: ['MT', 'ID', 'WA'] },
  { from: 'SPO', to: 'SEA', distance: 280, operator: 'BNSF', curveScore: 4, states: ['WA'] },
  { from: 'SPO', to: 'POR', distance: 350, operator: 'BNSF', curveScore: 5, states: ['WA', 'OR'] },
  { from: 'CHI', to: 'KC', distance: 500, operator: 'BNSF', curveScore: 5, states: ['IL', 'IA', 'MO'] },
  { from: 'KC', to: 'DEN', distance: 600, operator: 'BNSF', curveScore: 6, states: ['MO', 'KS', 'CO'] },
  { from: 'DEN', to: 'SLC', distance: 520, operator: 'BNSF', curveScore: 5, states: ['CO', 'WY', 'UT'] },
  { from: 'SLC', to: 'LAX', distance: 680, operator: 'BNSF', curveScore: 7, states: ['UT', 'NV', 'CA'] },
  { from: 'KC', to: 'DAL', distance: 500, operator: 'BNSF', curveScore: 6, states: ['MO', 'KS', 'OK', 'TX'] },
  { from: 'DAL', to: 'HOU', distance: 240, operator: 'BNSF', curveScore: 3, states: ['TX'] },
  
  // Union Pacific Routes
  { from: 'CHI', to: 'OMA', distance: 470, operator: 'UP', curveScore: 4, states: ['IL', 'IA', 'NE'] },
  { from: 'OMA', to: 'DEN', distance: 540, operator: 'UP', curveScore: 5, states: ['NE', 'CO'] },
  { from: 'DEN', to: 'SLC', distance: 520, operator: 'UP', curveScore: 4, states: ['CO', 'WY', 'UT'] },
  { from: 'SLC', to: 'LAX', distance: 680, operator: 'UP', curveScore: 7, states: ['UT', 'NV', 'CA'] },
  { from: 'SLC', to: 'POR', distance: 760, operator: 'UP', curveScore: 6, states: ['UT', 'ID', 'OR'] },
  { from: 'KC', to: 'STL', distance: 250, operator: 'UP', curveScore: 4, states: ['MO'] },
  { from: 'STL', to: 'CHI', distance: 300, operator: 'UP', curveScore: 4, states: ['MO', 'IL'] },
  { from: 'KC', to: 'DAL', distance: 500, operator: 'UP', curveScore: 5, states: ['MO', 'KS', 'OK', 'TX'] },
  { from: 'DAL', to: 'HOU', distance: 240, operator: 'UP', curveScore: 3, states: ['TX'] },
  { from: 'DEN', to: 'PHX', distance: 600, operator: 'UP', curveScore: 6, states: ['CO', 'NM', 'AZ'] },
  { from: 'PHX', to: 'LAX', distance: 370, operator: 'UP', curveScore: 4, states: ['AZ', 'CA'] },
  
  // CSX Routes
  { from: 'CHI', to: 'STL', distance: 300, operator: 'CSX', curveScore: 4, states: ['IL', 'MO'] },
  { from: 'STL', to: 'MEM', distance: 280, operator: 'CSX', curveScore: 4, states: ['MO', 'TN'] },
  { from: 'MEM', to: 'ATL', distance: 390, operator: 'CSX', curveScore: 5, states: ['TN', 'GA'] },
  { from: 'ATL', to: 'JAX', distance: 350, operator: 'CSX', curveScore: 4, states: ['GA', 'FL'] },
  { from: 'CHI', to: 'CLE', distance: 340, operator: 'CSX', curveScore: 5, states: ['IL', 'IN', 'OH'] },
  { from: 'CLE', to: 'PIT', distance: 130, operator: 'CSX', curveScore: 3, states: ['OH', 'PA'] },
  
  // Norfolk Southern Routes
  { from: 'CHI', to: 'CLE', distance: 340, operator: 'NS', curveScore: 5, states: ['IL', 'IN', 'OH'] },
  { from: 'CLE', to: 'PIT', distance: 130, operator: 'NS', curveScore: 3, states: ['OH', 'PA'] },
  { from: 'PIT', to: 'NOR', distance: 380, operator: 'NS', curveScore: 5, states: ['PA', 'MD', 'VA'] },
  { from: 'CHI', to: 'STL', distance: 300, operator: 'NS', curveScore: 4, states: ['IL', 'MO'] },
  { from: 'STL', to: 'MEM', distance: 280, operator: 'NS', curveScore: 4, states: ['MO', 'TN'] },
  { from: 'MEM', to: 'NO', distance: 390, operator: 'NS', curveScore: 5, states: ['TN', 'MS', 'LA'] },
  { from: 'MEM', to: 'ATL', distance: 390, operator: 'NS', curveScore: 5, states: ['TN', 'GA'] },
  
  // Canadian National Routes
  { from: 'CHI', to: 'DET', distance: 280, operator: 'CN', curveScore: 4, states: ['IL', 'IN', 'MI'] },
  { from: 'DET', to: 'TOR', distance: 230, operator: 'CN', curveScore: 4, states: ['MI', 'ON'] },
  { from: 'TOR', to: 'MON', distance: 340, operator: 'CN', curveScore: 4, states: ['ON', 'QC'] },
  { from: 'WIN', to: 'TOR', distance: 1330, operator: 'CN', curveScore: 6, states: ['MB', 'ON'] },
  { from: 'MIN', to: 'WIN', distance: 430, operator: 'CN', curveScore: 4, states: ['MN', 'MB'] },
  { from: 'CHI', to: 'MEM', distance: 530, operator: 'CN', curveScore: 5, states: ['IL', 'KY', 'TN'] },
  
  // Canadian Pacific Routes
  { from: 'CHI', to: 'MIN', distance: 410, operator: 'CP', curveScore: 4, states: ['IL', 'WI', 'MN'] },
  { from: 'MIN', to: 'WIN', distance: 430, operator: 'CP', curveScore: 4, states: ['MN', 'MB'] },
  { from: 'WIN', to: 'CAL', distance: 830, operator: 'CP', curveScore: 5, states: ['MB', 'SK', 'AB'] },
  { from: 'CAL', to: 'VAN', distance: 605, operator: 'CP', curveScore: 6, states: ['AB', 'BC'] },
  { from: 'SPO', to: 'VAN', distance: 280, operator: 'CP', curveScore: 4, states: ['WA', 'BC'] },
  
  // Interline connections (transfer points between operators)
  { from: 'CHI', to: 'KC', distance: 500, operator: 'UP', curveScore: 5, states: ['IL', 'IA', 'MO'] },
  { from: 'KC', to: 'DEN', distance: 600, operator: 'UP', curveScore: 6, states: ['MO', 'KS', 'CO'] },
  { from: 'DEN', to: 'SLC', distance: 520, operator: 'UP', curveScore: 4, states: ['CO', 'WY', 'UT'] },
  { from: 'SLC', to: 'SEA', distance: 830, operator: 'UP', curveScore: 7, states: ['UT', 'ID', 'WA'] },
];

// Helper function to get all connections from a station
export function getConnections(stationCode) {
  return connections.filter(conn => conn.from === stationCode || conn.to === stationCode);
}

// Helper function to get connection between two stations
export function getConnection(from, to) {
  return connections.find(conn => 
    (conn.from === from && conn.to === to) || 
    (conn.from === to && conn.to === from)
  );
}

// Helper function to calculate distance between two stations (Haversine formula)
export function calculateDistance(station1, station2) {
  const R = 3959; // Earth's radius in miles
  const lat1 = station1.lat * Math.PI / 180;
  const lat2 = station2.lat * Math.PI / 180;
  const deltaLat = (station2.lat - station1.lat) * Math.PI / 180;
  const deltaLng = (station2.lng - station1.lng) * Math.PI / 180;
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}
