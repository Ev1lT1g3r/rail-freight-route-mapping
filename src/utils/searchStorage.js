// Storage utility for saved searches

const SAVED_SEARCHES_KEY = 'rail_freight_saved_searches';
const SEARCH_HISTORY_KEY = 'rail_freight_search_history';
const MAX_HISTORY_ITEMS = 20;

export function getSavedSearches() {
  try {
    const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading saved searches:', e);
    return [];
  }
}

export function saveSearch(searchConfig) {
  try {
    const searches = getSavedSearches();
    const newSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: searchConfig.name || 'Untitled Search',
      config: searchConfig,
      createdDate: new Date().toISOString()
    };
    searches.push(newSearch);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
    return newSearch.id;
  } catch (e) {
    console.error('Error saving search:', e);
    return null;
  }
}

export function deleteSavedSearch(searchId) {
  try {
    const searches = getSavedSearches();
    const filtered = searches.filter(s => s.id !== searchId);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting saved search:', e);
    return false;
  }
}

export function getSearchHistory() {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading search history:', e);
    return [];
  }
}

export function addToSearchHistory(searchConfig) {
  try {
    const history = getSearchHistory();
    // Remove duplicates (same search config)
    const configString = JSON.stringify(searchConfig);
    const filtered = history.filter(h => JSON.stringify(h.config) !== configString);
    
    // Add to front
    filtered.unshift({
      id: `history_${Date.now()}`,
      config: searchConfig,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last MAX_HISTORY_ITEMS
    const trimmed = filtered.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.error('Error adding to search history:', e);
    return false;
  }
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing search history:', e);
    return false;
  }
}

