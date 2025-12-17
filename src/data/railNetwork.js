// North American Freight Rail Network Data
// Comprehensive coverage of major freight rail yards and intermodal facilities across US, Canada, and Mexico

export const stations = {
  // Major US Hubs - Midwest
  'CHI': { name: 'Chicago', lat: 41.8781, lng: -87.6298, state: 'IL', operator: 'Multiple' },
  'KC': { name: 'Kansas City', lat: 39.0997, lng: -94.5786, state: 'MO', operator: 'Multiple' },
  'STL': { name: 'St. Louis', lat: 38.6270, lng: -90.1994, state: 'MO', operator: 'Multiple' },
  'MIN': { name: 'Minneapolis', lat: 44.9778, lng: -93.2650, state: 'MN', operator: 'BNSF' },
  'MIL': { name: 'Milwaukee', lat: 43.0389, lng: -87.9065, state: 'WI', operator: 'CP' },
  'IND': { name: 'Indianapolis', lat: 39.7684, lng: -86.1581, state: 'IN', operator: 'CSX' },
  'COL': { name: 'Columbus', lat: 39.9612, lng: -82.9988, state: 'OH', operator: 'NS' },
  'CIN': { name: 'Cincinnati', lat: 39.1031, lng: -84.5120, state: 'OH', operator: 'NS' },
  'DET': { name: 'Detroit', lat: 42.3314, lng: -83.0458, state: 'MI', operator: 'CN' },
  'CLE': { name: 'Cleveland', lat: 41.4993, lng: -81.6944, state: 'OH', operator: 'NS' },
  'OMA': { name: 'Omaha', lat: 41.2565, lng: -95.9345, state: 'NE', operator: 'UP' },
  'DES': { name: 'Des Moines', lat: 41.5868, lng: -93.6250, state: 'IA', operator: 'UP' },
  'FAR': { name: 'Fargo', lat: 46.8772, lng: -96.7898, state: 'ND', operator: 'BNSF' },
  'SIO': { name: 'Sioux Falls', lat: 43.5446, lng: -96.7311, state: 'SD', operator: 'BNSF' },
  'LIN': { name: 'Lincoln', lat: 40.8136, lng: -96.7026, state: 'NE', operator: 'BNSF' },
  'WIC': { name: 'Wichita', lat: 37.6872, lng: -97.3301, state: 'KS', operator: 'BNSF' },
  'TUL': { name: 'Tulsa', lat: 36.1540, lng: -95.9928, state: 'OK', operator: 'BNSF' },
  'OKC': { name: 'Oklahoma City', lat: 35.4676, lng: -97.5164, state: 'OK', operator: 'BNSF' },
  
  // Major US Hubs - Northeast
  'NYC': { name: 'New York', lat: 40.7128, lng: -74.0060, state: 'NY', operator: 'CSX' },
  'PHI': { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, state: 'PA', operator: 'NS' },
  'BAL': { name: 'Baltimore', lat: 39.2904, lng: -76.6122, state: 'MD', operator: 'CSX' },
  'WAS': { name: 'Washington', lat: 38.9072, lng: -77.0369, state: 'DC', operator: 'CSX' },
  'BOS': { name: 'Boston', lat: 42.3601, lng: -71.0589, state: 'MA', operator: 'CSX' },
  'BUF': { name: 'Buffalo', lat: 42.8864, lng: -78.8784, state: 'NY', operator: 'NS' },
  'ALY': { name: 'Albany', lat: 42.6526, lng: -73.7562, state: 'NY', operator: 'CSX' },
  'PIT': { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959, state: 'PA', operator: 'NS' },
  'NOR': { name: 'Norfolk', lat: 36.8468, lng: -76.2852, state: 'VA', operator: 'NS' },
  'RIC': { name: 'Richmond', lat: 37.5407, lng: -77.4360, state: 'VA', operator: 'CSX' },
  'CHA': { name: 'Charleston', lat: 38.3498, lng: -81.6326, state: 'WV', operator: 'CSX' },
  
  // Major US Hubs - Southeast
  'ATL': { name: 'Atlanta', lat: 33.7490, lng: -84.3880, state: 'GA', operator: 'CSX' },
  'MEM': { name: 'Memphis', lat: 35.1495, lng: -90.0490, state: 'TN', operator: 'Multiple' },
  'NO': { name: 'New Orleans', lat: 29.9511, lng: -90.0715, state: 'LA', operator: 'NS' },
  'JAX': { name: 'Jacksonville', lat: 30.3322, lng: -81.6557, state: 'FL', operator: 'CSX' },
  'MIA': { name: 'Miami', lat: 25.7617, lng: -80.1918, state: 'FL', operator: 'CSX' },
  'TAM': { name: 'Tampa', lat: 27.9506, lng: -82.4572, state: 'FL', operator: 'CSX' },
  'ORL': { name: 'Orlando', lat: 28.5383, lng: -81.3792, state: 'FL', operator: 'CSX' },
  'CLT': { name: 'Charlotte', lat: 35.2271, lng: -80.8431, state: 'NC', operator: 'NS' },
  'RAL': { name: 'Raleigh', lat: 35.7796, lng: -78.6382, state: 'NC', operator: 'CSX' },
  'NAS': { name: 'Nashville', lat: 36.1627, lng: -86.7816, state: 'TN', operator: 'CSX' },
  'BIR': { name: 'Birmingham', lat: 33.5207, lng: -86.8025, state: 'AL', operator: 'NS' },
  'MOB': { name: 'Mobile', lat: 30.6954, lng: -88.0399, state: 'AL', operator: 'CSX' },
  'SAV': { name: 'Savannah', lat: 32.0809, lng: -81.0912, state: 'GA', operator: 'CSX' },
  
  // Major US Hubs - Southwest
  'DAL': { name: 'Dallas', lat: 32.7767, lng: -96.7970, state: 'TX', operator: 'UP' },
  'HOU': { name: 'Houston', lat: 29.7604, lng: -95.3698, state: 'TX', operator: 'UP' },
  'SA': { name: 'San Antonio', lat: 29.4241, lng: -98.4936, state: 'TX', operator: 'UP' },
  'AUS': { name: 'Austin', lat: 30.2672, lng: -97.7431, state: 'TX', operator: 'UP' },
  'FTW': { name: 'Fort Worth', lat: 32.7555, lng: -97.3308, state: 'TX', operator: 'BNSF' },
  'ELP': { name: 'El Paso', lat: 31.7619, lng: -106.4850, state: 'TX', operator: 'UP' },
  'PHX': { name: 'Phoenix', lat: 33.4484, lng: -112.0740, state: 'AZ', operator: 'UP' },
  'TUC': { name: 'Tucson', lat: 32.2226, lng: -110.9747, state: 'AZ', operator: 'UP' },
  'ABQ': { name: 'Albuquerque', lat: 35.0844, lng: -106.6504, state: 'NM', operator: 'BNSF' },
  'LUB': { name: 'Lubbock', lat: 33.5779, lng: -101.8552, state: 'TX', operator: 'BNSF' },
  'AMA': { name: 'Amarillo', lat: 35.2220, lng: -101.8313, state: 'TX', operator: 'BNSF' },
  
  // Major US Hubs - West
  'LAX': { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, state: 'CA', operator: 'BNSF' },
  'SAN': { name: 'San Diego', lat: 32.7157, lng: -117.1611, state: 'CA', operator: 'BNSF' },
  'SF': { name: 'San Francisco', lat: 37.7749, lng: -122.4194, state: 'CA', operator: 'UP' },
  'OAK': { name: 'Oakland', lat: 37.8044, lng: -122.2712, state: 'CA', operator: 'UP' },
  'SAC': { name: 'Sacramento', lat: 38.5816, lng: -121.4944, state: 'CA', operator: 'UP' },
  'FRES': { name: 'Fresno', lat: 36.7378, lng: -119.7871, state: 'CA', operator: 'BNSF' },
  'SEA': { name: 'Seattle', lat: 47.6062, lng: -122.3321, state: 'WA', operator: 'BNSF' },
  'POR': { name: 'Portland', lat: 45.5152, lng: -122.6784, state: 'OR', operator: 'BNSF' },
  'SPO': { name: 'Spokane', lat: 47.6588, lng: -117.4260, state: 'WA', operator: 'BNSF' },
  'DEN': { name: 'Denver', lat: 39.7392, lng: -104.9903, state: 'CO', operator: 'UP' },
  'SLC': { name: 'Salt Lake City', lat: 40.7608, lng: -111.8910, state: 'UT', operator: 'UP' },
  'REN': { name: 'Reno', lat: 39.5296, lng: -119.8138, state: 'NV', operator: 'UP' },
  'LAS': { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, state: 'NV', operator: 'UP' },
  'BIL': { name: 'Billings', lat: 45.7833, lng: -108.5007, state: 'MT', operator: 'BNSF' },
  'BOI': { name: 'Boise', lat: 43.6150, lng: -116.2023, state: 'ID', operator: 'UP' },
  'CHE': { name: 'Cheyenne', lat: 41.1400, lng: -104.8197, state: 'WY', operator: 'UP' },
  'CAS': { name: 'Casper', lat: 42.8666, lng: -106.3131, state: 'WY', operator: 'BNSF' },
  
  // Major Canadian Hubs
  'TOR': { name: 'Toronto', lat: 43.6532, lng: -79.3832, state: 'ON', operator: 'CN' },
  'MON': { name: 'Montreal', lat: 45.5017, lng: -73.5673, state: 'QC', operator: 'CN' },
  'VAN': { name: 'Vancouver', lat: 49.2827, lng: -123.1207, state: 'BC', operator: 'CP' },
  'CAL': { name: 'Calgary', lat: 51.0447, lng: -114.0719, state: 'AB', operator: 'CP' },
  'WIN': { name: 'Winnipeg', lat: 49.8951, lng: -97.1384, state: 'MB', operator: 'CN' },
  'EDM': { name: 'Edmonton', lat: 53.5461, lng: -113.4938, state: 'AB', operator: 'CN' },
  'OTT': { name: 'Ottawa', lat: 45.4215, lng: -75.6972, state: 'ON', operator: 'CN' },
  'QUE': { name: 'Quebec City', lat: 46.8139, lng: -71.2080, state: 'QC', operator: 'CN' },
  'HAL': { name: 'Halifax', lat: 44.6488, lng: -63.5752, state: 'NS', operator: 'CN' },
  'SAS': { name: 'Saskatoon', lat: 52.1332, lng: -106.6700, state: 'SK', operator: 'CN' },
  'REG': { name: 'Regina', lat: 50.4452, lng: -104.6189, state: 'SK', operator: 'CP' },
  'THU': { name: 'Thunder Bay', lat: 48.3809, lng: -89.2477, state: 'ON', operator: 'CN' },
  'SUD': { name: 'Sudbury', lat: 46.4920, lng: -80.9940, state: 'ON', operator: 'CN' },
  
  // Major Mexican Hubs
  'MEX': { name: 'Mexico City', lat: 19.4326, lng: -99.1332, state: 'CDMX', operator: 'KCSM' },
  'TIJ': { name: 'Tijuana', lat: 32.5149, lng: -117.0382, state: 'BC', operator: 'KCSM' },
  'MTY': { name: 'Monterrey', lat: 25.6866, lng: -100.3161, state: 'NL', operator: 'KCSM' },
  'GUA': { name: 'Guadalajara', lat: 20.6597, lng: -103.3496, state: 'JAL', operator: 'KCSM' },
  'VER': { name: 'Veracruz', lat: 19.1738, lng: -96.1342, state: 'VER', operator: 'KCSM' },
  'MER': { name: 'Merida', lat: 20.9674, lng: -89.5926, state: 'YUC', operator: 'KCSM' },
  'HER': { name: 'Hermosillo', lat: 29.0892, lng: -110.9619, state: 'SON', operator: 'KCSM' },
  'CHH': { name: 'Chihuahua', lat: 28.6329, lng: -106.0691, state: 'CHI', operator: 'KCSM' },
  'LAR': { name: 'Laredo', lat: 27.5306, lng: -99.4803, state: 'TX', operator: 'KCSM' },
};

// Freight rail connections with distance (miles), operator, and curve score (1-10, lower = straighter)
export const connections = [
  // BNSF Routes - Transcontinental
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
  { from: 'KC', to: 'TUL', distance: 250, operator: 'BNSF', curveScore: 4, states: ['MO', 'KS', 'OK'] },
  { from: 'TUL', to: 'OKC', distance: 110, operator: 'BNSF', curveScore: 3, states: ['OK'] },
  { from: 'OKC', to: 'AMA', distance: 260, operator: 'BNSF', curveScore: 4, states: ['OK', 'TX'] },
  { from: 'AMA', to: 'ABQ', distance: 290, operator: 'BNSF', curveScore: 4, states: ['TX', 'NM'] },
  { from: 'AMA', to: 'LUB', distance: 110, operator: 'BNSF', curveScore: 3, states: ['TX'] },
  { from: 'LUB', to: 'FTW', distance: 320, operator: 'BNSF', curveScore: 4, states: ['TX'] },
  { from: 'LUB', to: 'DAL', distance: 310, operator: 'BNSF', curveScore: 4, states: ['TX'] },
  { from: 'ALB', to: 'PHX', distance: 420, operator: 'BNSF', curveScore: 5, states: ['NM', 'AZ'] },
  { from: 'PHX', to: 'LAX', distance: 370, operator: 'BNSF', curveScore: 4, states: ['AZ', 'CA'] },
  { from: 'LAX', to: 'SAN', distance: 120, operator: 'BNSF', curveScore: 3, states: ['CA'] },
  { from: 'LAX', to: 'FRES', distance: 220, operator: 'BNSF', curveScore: 4, states: ['CA'] },
  { from: 'FRES', to: 'SAC', distance: 180, operator: 'BNSF', curveScore: 4, states: ['CA'] },
  { from: 'SAC', to: 'SF', distance: 90, operator: 'BNSF', curveScore: 3, states: ['CA'] },
  { from: 'MIN', to: 'SIO', distance: 230, operator: 'BNSF', curveScore: 4, states: ['MN', 'SD'] },
  { from: 'SIO', to: 'OMA', distance: 250, operator: 'BNSF', curveScore: 4, states: ['SD', 'NE', 'IA'] },
  { from: 'OMA', to: 'LIN', distance: 60, operator: 'BNSF', curveScore: 2, states: ['NE'] },
  { from: 'LIN', to: 'DEN', distance: 480, operator: 'BNSF', curveScore: 5, states: ['NE', 'CO'] },
  { from: 'KC', to: 'WIC', distance: 200, operator: 'BNSF', curveScore: 4, states: ['MO', 'KS'] },
  { from: 'WIC', to: 'DEN', distance: 520, operator: 'BNSF', curveScore: 6, states: ['KS', 'CO'] },
  { from: 'POR', to: 'BOI', distance: 430, operator: 'BNSF', curveScore: 5, states: ['OR', 'ID'] },
  { from: 'BOI', to: 'SLC', distance: 340, operator: 'BNSF', curveScore: 5, states: ['ID', 'UT'] },
  { from: 'BIL', to: 'CAS', distance: 280, operator: 'BNSF', curveScore: 4, states: ['MT', 'WY'] },
  { from: 'CAS', to: 'DEN', distance: 280, operator: 'BNSF', curveScore: 5, states: ['WY', 'CO'] },
  
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
  { from: 'SLC', to: 'REN', distance: 520, operator: 'UP', curveScore: 5, states: ['UT', 'NV'] },
  { from: 'REN', to: 'SF', distance: 220, operator: 'UP', curveScore: 4, states: ['NV', 'CA'] },
  { from: 'SF', to: 'OAK', distance: 10, operator: 'UP', curveScore: 1, states: ['CA'] },
  { from: 'SLC', to: 'LAS', distance: 420, operator: 'UP', curveScore: 5, states: ['UT', 'NV'] },
  { from: 'LAS', to: 'LAX', distance: 270, operator: 'UP', curveScore: 4, states: ['NV', 'CA'] },
  { from: 'OMA', to: 'DES', distance: 130, operator: 'UP', curveScore: 3, states: ['NE', 'IA'] },
  { from: 'DES', to: 'CHI', distance: 330, operator: 'UP', curveScore: 4, states: ['IA', 'IL'] },
  { from: 'DEN', to: 'CHE', distance: 100, operator: 'UP', curveScore: 3, states: ['CO', 'WY'] },
  { from: 'CHE', to: 'OMA', distance: 530, operator: 'UP', curveScore: 5, states: ['WY', 'NE'] },
  { from: 'HOU', to: 'SA', distance: 200, operator: 'UP', curveScore: 3, states: ['TX'] },
  { from: 'SA', to: 'AUS', distance: 80, operator: 'UP', curveScore: 2, states: ['TX'] },
  { from: 'AUS', to: 'DAL', distance: 200, operator: 'UP', curveScore: 3, states: ['TX'] },
  { from: 'DAL', to: 'FTW', distance: 30, operator: 'UP', curveScore: 1, states: ['TX'] },
  { from: 'ELP', to: 'PHX', distance: 360, operator: 'UP', curveScore: 5, states: ['TX', 'NM', 'AZ'] },
  { from: 'ELP', to: 'ABQ', distance: 260, operator: 'UP', curveScore: 4, states: ['TX', 'NM'] },
  { from: 'PHX', to: 'TUC', distance: 110, operator: 'UP', curveScore: 3, states: ['AZ'] },
  { from: 'TUC', to: 'ELP', distance: 260, operator: 'UP', curveScore: 4, states: ['AZ', 'NM', 'TX'] },
  { from: 'SLC', to: 'BOI', distance: 340, operator: 'UP', curveScore: 5, states: ['UT', 'ID'] },
  { from: 'BOI', to: 'POR', distance: 430, operator: 'UP', curveScore: 5, states: ['ID', 'OR'] },
  
  // CSX Routes - Eastern Seaboard
  { from: 'CHI', to: 'STL', distance: 300, operator: 'CSX', curveScore: 4, states: ['IL', 'MO'] },
  { from: 'STL', to: 'MEM', distance: 280, operator: 'CSX', curveScore: 4, states: ['MO', 'TN'] },
  { from: 'MEM', to: 'ATL', distance: 390, operator: 'CSX', curveScore: 5, states: ['TN', 'GA'] },
  { from: 'ATL', to: 'JAX', distance: 350, operator: 'CSX', curveScore: 4, states: ['GA', 'FL'] },
  { from: 'CHI', to: 'CLE', distance: 340, operator: 'CSX', curveScore: 5, states: ['IL', 'IN', 'OH'] },
  { from: 'CLE', to: 'PIT', distance: 130, operator: 'CSX', curveScore: 3, states: ['OH', 'PA'] },
  { from: 'CHI', to: 'IND', distance: 180, operator: 'CSX', curveScore: 4, states: ['IL', 'IN'] },
  { from: 'IND', to: 'CIN', distance: 110, operator: 'CSX', curveScore: 3, states: ['IN', 'OH'] },
  { from: 'CIN', to: 'COL', distance: 110, operator: 'CSX', curveScore: 3, states: ['OH'] },
  { from: 'COL', to: 'CLE', distance: 140, operator: 'CSX', curveScore: 3, states: ['OH'] },
  { from: 'ATL', to: 'SAV', distance: 250, operator: 'CSX', curveScore: 4, states: ['GA'] },
  { from: 'SAV', to: 'JAX', distance: 140, operator: 'CSX', curveScore: 3, states: ['GA', 'FL'] },
  { from: 'JAX', to: 'ORL', distance: 140, operator: 'CSX', curveScore: 3, states: ['FL'] },
  { from: 'ORL', to: 'TAM', distance: 85, operator: 'CSX', curveScore: 2, states: ['FL'] },
  { from: 'ORL', to: 'MIA', distance: 230, operator: 'CSX', curveScore: 4, states: ['FL'] },
  { from: 'ATL', to: 'CLT', distance: 240, operator: 'CSX', curveScore: 4, states: ['GA', 'NC'] },
  { from: 'CLT', to: 'RAL', distance: 170, operator: 'CSX', curveScore: 3, states: ['NC'] },
  { from: 'ATL', to: 'CHA', distance: 380, operator: 'CSX', curveScore: 5, states: ['GA', 'SC', 'NC', 'WV'] },
  { from: 'CHA', to: 'PIT', distance: 180, operator: 'CSX', curveScore: 4, states: ['WV', 'PA'] },
  { from: 'CHA', to: 'PIT', distance: 220, operator: 'CSX', curveScore: 4, states: ['WV', 'PA'] },
  { from: 'RAL', to: 'NOR', distance: 170, operator: 'CSX', curveScore: 3, states: ['NC', 'VA'] },
  { from: 'NOR', to: 'RIC', distance: 90, operator: 'CSX', curveScore: 2, states: ['VA'] },
  { from: 'RIC', to: 'WAS', distance: 110, operator: 'CSX', curveScore: 3, states: ['VA', 'DC'] },
  { from: 'WAS', to: 'BAL', distance: 40, operator: 'CSX', curveScore: 2, states: ['MD'] },
  { from: 'BAL', to: 'PHI', distance: 100, operator: 'CSX', curveScore: 3, states: ['MD', 'PA'] },
  { from: 'PHI', to: 'NYC', distance: 90, operator: 'CSX', curveScore: 3, states: ['PA', 'NJ', 'NY'] },
  { from: 'NYC', to: 'BOS', distance: 210, operator: 'CSX', curveScore: 4, states: ['NY', 'CT', 'MA'] },
  { from: 'WAS', to: 'ALY', distance: 240, operator: 'CSX', curveScore: 4, states: ['DC', 'MD', 'PA', 'NY'] },
  { from: 'ALY', to: 'BUF', distance: 290, operator: 'CSX', curveScore: 4, states: ['NY'] },
  { from: 'MEM', to: 'NAS', distance: 210, operator: 'CSX', curveScore: 4, states: ['TN'] },
  { from: 'NAS', to: 'ATL', distance: 250, operator: 'CSX', curveScore: 4, states: ['TN', 'GA'] },
  { from: 'MEM', to: 'BIR', distance: 240, operator: 'CSX', curveScore: 4, states: ['TN', 'AL'] },
  { from: 'BIR', to: 'MOB', distance: 250, operator: 'CSX', curveScore: 4, states: ['AL'] },
  
  // Norfolk Southern Routes
  { from: 'CHI', to: 'CLE', distance: 340, operator: 'NS', curveScore: 5, states: ['IL', 'IN', 'OH'] },
  { from: 'CLE', to: 'PIT', distance: 130, operator: 'NS', curveScore: 3, states: ['OH', 'PA'] },
  { from: 'PIT', to: 'NOR', distance: 380, operator: 'NS', curveScore: 5, states: ['PA', 'MD', 'VA'] },
  { from: 'CHI', to: 'STL', distance: 300, operator: 'NS', curveScore: 4, states: ['IL', 'MO'] },
  { from: 'STL', to: 'MEM', distance: 280, operator: 'NS', curveScore: 4, states: ['MO', 'TN'] },
  { from: 'MEM', to: 'NO', distance: 390, operator: 'NS', curveScore: 5, states: ['TN', 'MS', 'LA'] },
  { from: 'MEM', to: 'ATL', distance: 390, operator: 'NS', curveScore: 5, states: ['TN', 'GA'] },
  { from: 'ATL', to: 'CLT', distance: 240, operator: 'NS', curveScore: 4, states: ['GA', 'NC'] },
  { from: 'CLT', to: 'RAL', distance: 170, operator: 'NS', curveScore: 3, states: ['NC'] },
  { from: 'RAL', to: 'NOR', distance: 170, operator: 'NS', curveScore: 3, states: ['NC', 'VA'] },
  { from: 'CLE', to: 'BUF', distance: 190, operator: 'NS', curveScore: 4, states: ['OH', 'PA', 'NY'] },
  { from: 'BUF', to: 'ALY', distance: 290, operator: 'NS', curveScore: 4, states: ['NY'] },
  { from: 'ALY', to: 'BOS', distance: 170, operator: 'NS', curveScore: 3, states: ['NY', 'MA'] },
  { from: 'PIT', to: 'PHI', distance: 310, operator: 'NS', curveScore: 5, states: ['PA'] },
  { from: 'PHI', to: 'NYC', distance: 90, operator: 'NS', curveScore: 3, states: ['PA', 'NJ', 'NY'] },
  { from: 'ATL', to: 'BIR', distance: 150, operator: 'NS', curveScore: 3, states: ['GA', 'AL'] },
  { from: 'BIR', to: 'MOB', distance: 250, operator: 'NS', curveScore: 4, states: ['AL'] },
  { from: 'NO', to: 'MOB', distance: 160, operator: 'NS', curveScore: 3, states: ['LA', 'AL'] },
  
  // Canadian National Routes
  { from: 'CHI', to: 'DET', distance: 280, operator: 'CN', curveScore: 4, states: ['IL', 'IN', 'MI'] },
  { from: 'DET', to: 'TOR', distance: 230, operator: 'CN', curveScore: 4, states: ['MI', 'ON'] },
  { from: 'TOR', to: 'MON', distance: 340, operator: 'CN', curveScore: 4, states: ['ON', 'QC'] },
  { from: 'WIN', to: 'TOR', distance: 1330, operator: 'CN', curveScore: 6, states: ['MB', 'ON'] },
  { from: 'MIN', to: 'WIN', distance: 430, operator: 'CN', curveScore: 4, states: ['MN', 'MB'] },
  { from: 'CHI', to: 'MEM', distance: 530, operator: 'CN', curveScore: 5, states: ['IL', 'KY', 'TN'] },
  { from: 'TOR', to: 'OTT', distance: 260, operator: 'CN', curveScore: 4, states: ['ON'] },
  { from: 'MON', to: 'QUE', distance: 160, operator: 'CN', curveScore: 3, states: ['QC'] },
  { from: 'QUE', to: 'HAL', distance: 520, operator: 'CN', curveScore: 5, states: ['QC', 'NB', 'NS'] },
  { from: 'WIN', to: 'SAS', distance: 410, operator: 'CN', curveScore: 4, states: ['MB', 'SK'] },
  { from: 'SAS', to: 'EDM', distance: 340, operator: 'CN', curveScore: 4, states: ['SK', 'AB'] },
  { from: 'EDM', to: 'CAL', distance: 180, operator: 'CN', curveScore: 3, states: ['AB'] },
  { from: 'TOR', to: 'THU', distance: 870, operator: 'CN', curveScore: 5, states: ['ON'] },
  { from: 'THU', to: 'WIN', distance: 430, operator: 'CN', curveScore: 4, states: ['ON', 'MB'] },
  { from: 'TOR', to: 'SUD', distance: 240, operator: 'CN', curveScore: 4, states: ['ON'] },
  { from: 'SUD', to: 'THU', distance: 630, operator: 'CN', curveScore: 5, states: ['ON'] },
  
  // Canadian Pacific Routes
  { from: 'CHI', to: 'MIN', distance: 410, operator: 'CP', curveScore: 4, states: ['IL', 'WI', 'MN'] },
  { from: 'MIN', to: 'WIN', distance: 430, operator: 'CP', curveScore: 4, states: ['MN', 'MB'] },
  { from: 'WIN', to: 'CAL', distance: 830, operator: 'CP', curveScore: 5, states: ['MB', 'SK', 'AB'] },
  { from: 'CAL', to: 'VAN', distance: 605, operator: 'CP', curveScore: 6, states: ['AB', 'BC'] },
  { from: 'SPO', to: 'VAN', distance: 280, operator: 'CP', curveScore: 4, states: ['WA', 'BC'] },
  { from: 'WIN', to: 'REG', distance: 360, operator: 'CP', curveScore: 4, states: ['MB', 'SK'] },
  { from: 'REG', to: 'CAL', distance: 470, operator: 'CP', curveScore: 4, states: ['SK', 'AB'] },
  { from: 'CAL', to: 'EDM', distance: 180, operator: 'CP', curveScore: 3, states: ['AB'] },
  { from: 'TOR', to: 'MON', distance: 340, operator: 'CP', curveScore: 4, states: ['ON', 'QC'] },
  
  // Kansas City Southern / KCSM Routes (US-Mexico)
  { from: 'KC', to: 'DAL', distance: 500, operator: 'KCS', curveScore: 5, states: ['MO', 'KS', 'OK', 'TX'] },
  { from: 'DAL', to: 'HOU', distance: 240, operator: 'KCS', curveScore: 3, states: ['TX'] },
  { from: 'HOU', to: 'LAR', distance: 320, operator: 'KCSM', curveScore: 4, states: ['TX'] },
  { from: 'LAR', to: 'MTY', distance: 180, operator: 'KCSM', curveScore: 3, states: ['TX', 'MX'] },
  { from: 'MTY', to: 'MEX', distance: 560, operator: 'KCSM', curveScore: 5, states: ['MX'] },
  { from: 'ELP', to: 'CHH', distance: 220, operator: 'KCSM', curveScore: 4, states: ['TX', 'MX'] },
  { from: 'CHH', to: 'MEX', distance: 840, operator: 'KCSM', curveScore: 6, states: ['MX'] },
  { from: 'MEX', to: 'GUA', distance: 330, operator: 'KCSM', curveScore: 4, states: ['MX'] },
  { from: 'MEX', to: 'VER', distance: 260, operator: 'KCSM', curveScore: 4, states: ['MX'] },
  { from: 'VER', to: 'MER', distance: 520, operator: 'KCSM', curveScore: 5, states: ['MX'] },
  { from: 'TIJ', to: 'HER', distance: 280, operator: 'KCSM', curveScore: 4, states: ['MX'] },
  { from: 'HER', to: 'CHH', distance: 400, operator: 'KCSM', curveScore: 5, states: ['MX'] },
  { from: 'CHH', to: 'MTY', distance: 180, operator: 'KCSM', curveScore: 3, states: ['MX'] },
  { from: 'LAX', to: 'TIJ', distance: 120, operator: 'KCSM', curveScore: 3, states: ['CA', 'MX'] },
  
  // Additional interline connections
  { from: 'CHI', to: 'MIL', distance: 90, operator: 'CP', curveScore: 2, states: ['IL', 'WI'] },
  { from: 'MIL', to: 'MIN', distance: 320, operator: 'CP', curveScore: 4, states: ['WI', 'MN'] },
  { from: 'CHI', to: 'IND', distance: 180, operator: 'NS', curveScore: 4, states: ['IL', 'IN'] },
  { from: 'IND', to: 'CIN', distance: 110, operator: 'NS', curveScore: 3, states: ['IN', 'OH'] },
  { from: 'CIN', to: 'COL', distance: 110, operator: 'NS', curveScore: 3, states: ['OH'] },
  { from: 'COL', to: 'CLE', distance: 140, operator: 'NS', curveScore: 3, states: ['OH'] },
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
