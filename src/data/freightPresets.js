// Freight dimension presets for common freight types
export const FREIGHT_PRESETS = {
  '20FT_CONTAINER': {
    name: '20ft Shipping Container',
    description: 'Standard 20-foot ISO shipping container',
    length: 20,
    width: 8,
    height: 8.5,
    weight: 5000, // Average weight in pounds
    category: 'Containers'
  },
  '40FT_CONTAINER': {
    name: '40ft Shipping Container',
    description: 'Standard 40-foot ISO shipping container',
    length: 40,
    width: 8,
    height: 8.5,
    weight: 8500,
    category: 'Containers'
  },
  'PALLET_STANDARD': {
    name: 'Standard Pallet',
    description: 'Standard 48" x 40" pallet',
    length: 4,
    width: 3.33,
    height: 5,
    weight: 1500,
    category: 'Pallets'
  },
  'PALLET_EURO': {
    name: 'Euro Pallet',
    description: 'Standard 1200mm x 800mm Euro pallet',
    length: 3.94,
    width: 2.62,
    height: 5,
    weight: 1200,
    category: 'Pallets'
  },
  'STEEL_COIL': {
    name: 'Steel Coil (Standard)',
    description: 'Standard steel coil',
    length: 6,
    width: 6,
    height: 5,
    weight: 40000,
    category: 'Steel'
  },
  'MACHINERY_SMALL': {
    name: 'Small Machinery',
    description: 'Small industrial machinery',
    length: 10,
    width: 6,
    height: 8,
    weight: 15000,
    category: 'Machinery'
  },
  'MACHINERY_LARGE': {
    name: 'Large Machinery',
    description: 'Large industrial machinery',
    length: 20,
    width: 10,
    height: 12,
    weight: 80000,
    category: 'Machinery'
  },
  'AUTOMOTIVE': {
    name: 'Automotive Parts',
    description: 'Standard automotive parts shipment',
    length: 12,
    width: 8,
    height: 6,
    weight: 10000,
    category: 'Automotive'
  },
  'LUMBER_STANDARD': {
    name: 'Standard Lumber Bundle',
    description: 'Standard lumber bundle',
    length: 16,
    width: 4,
    height: 4,
    weight: 20000,
    category: 'Lumber'
  },
  'GRAIN_HOPPER': {
    name: 'Grain (Hopper)',
    description: 'Grain shipment for hopper car',
    length: 10,
    width: 10,
    height: 8,
    weight: 100000,
    category: 'Bulk'
  }
};

export function getPresetsByCategory() {
  const categories = {};
  Object.values(FREIGHT_PRESETS).forEach(preset => {
    if (!categories[preset.category]) {
      categories[preset.category] = [];
    }
    categories[preset.category].push(preset);
  });
  return categories;
}

export function getPreset(key) {
  return FREIGHT_PRESETS[key];
}

