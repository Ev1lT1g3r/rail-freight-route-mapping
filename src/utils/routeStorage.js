// Local storage utility for saved routes/favorites
const STORAGE_KEY = 'rail_freight_saved_routes';

export function getAllSavedRoutes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading saved routes:', e);
    return [];
  }
}

export function saveRoute(route) {
  try {
    const routes = getAllSavedRoutes();
    const existingIndex = routes.findIndex(r => 
      r.origin === route.origin && 
      r.destination === route.destination &&
      JSON.stringify(r.preferences) === JSON.stringify(route.preferences)
    );
    
    if (existingIndex >= 0) {
      routes[existingIndex] = { ...route, savedDate: new Date().toISOString() };
    } else {
      routes.push({ ...route, savedDate: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    return true;
  } catch (e) {
    console.error('Error saving route:', e);
    return false;
  }
}

export function deleteSavedRoute(origin, destination, preferences) {
  try {
    const routes = getAllSavedRoutes();
    const filtered = routes.filter(r => 
      !(r.origin === origin && 
        r.destination === destination &&
        JSON.stringify(r.preferences) === JSON.stringify(preferences))
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting saved route:', e);
    return false;
  }
}

export function isRouteSaved(origin, destination, preferences) {
  const routes = getAllSavedRoutes();
  return routes.some(r => 
    r.origin === origin && 
    r.destination === destination &&
    JSON.stringify(r.preferences) === JSON.stringify(preferences)
  );
}

