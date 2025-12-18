// Freight Library/Catalog storage and management

const LIBRARY_KEY = 'rail_freight_library';

export function getAllFreightItems() {
  try {
    const stored = localStorage.getItem(LIBRARY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading freight library:', e);
    return [];
  }
}

export function getFreightItemById(id) {
  const items = getAllFreightItems();
  return items.find(item => item.id === id);
}

export function saveFreightItem(freightItem) {
  try {
    if (!freightItem.name || !freightItem.name.trim()) {
      console.error('Freight item must have a name');
      return false;
    }

    const items = getAllFreightItems();
    const existingIndex = items.findIndex(item => item.id === freightItem.id);
    
    const itemToSave = {
      ...freightItem,
      id: freightItem.id || `freight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      updatedDate: new Date().toISOString(),
      createdDate: freightItem.createdDate || new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      items[existingIndex] = itemToSave;
    } else {
      items.push(itemToSave);
    }
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
    return itemToSave.id;
  } catch (e) {
    console.error('Error saving freight item:', e);
    return false;
  }
}

export function deleteFreightItem(id) {
  try {
    const items = getAllFreightItems();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting freight item:', e);
    return false;
  }
}

export function searchFreightItems(query) {
  const items = getAllFreightItems();
  if (!query || !query.trim()) {
    return items;
  }
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => {
    const nameMatch = item.name?.toLowerCase().includes(lowerQuery);
    const descMatch = item.description?.toLowerCase().includes(lowerQuery);
    const categoryMatch = item.category?.toLowerCase().includes(lowerQuery);
    const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    return nameMatch || descMatch || categoryMatch || tagMatch;
  });
}

export function getFreightItemsByCategory(category) {
  const items = getAllFreightItems();
  return items.filter(item => item.category === category);
}

export function getFreightCategories() {
  const items = getAllFreightItems();
  const categories = new Set(items.map(item => item.category).filter(Boolean));
  return Array.from(categories).sort();
}

export function createFreightItemFromSpec(freightSpec, name, category, description, tags = []) {
  try {
    return {
      name: name || `Freight Item ${new Date().toLocaleDateString()}`,
      category: category || 'General',
      description: description || '',
      tags: tags,
      length: freightSpec.length,
      width: freightSpec.width,
      height: freightSpec.height,
      weight: freightSpec.weight,
      description: freightSpec.description || description,
      diagram: freightSpec.diagram || null,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: freightSpec.createdBy || 'System',
      usageCount: 0
    };
  } catch (e) {
    console.error('Error creating freight item from spec:', e);
    return null;
  }
}

