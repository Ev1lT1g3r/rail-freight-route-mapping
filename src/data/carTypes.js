// Rail car types by operator with specifications
export const carTypes = {
  'BNSF': [
    {
      id: 'bnsf_boxcar',
      name: 'Boxcar',
      length: 60, // feet
      width: 9.5, // feet
      height: 15, // feet
      maxWeight: 220000, // pounds
      deckHeight: 4, // feet from ground
      image: 'boxcar'
    },
    {
      id: 'bnsf_flatcar',
      name: 'Flatcar',
      length: 89, // feet
      width: 10, // feet
      height: 2, // feet (deck height)
      maxWeight: 286000, // pounds
      deckHeight: 4, // feet from ground
      image: 'flatcar'
    },
    {
      id: 'bnsf_hopper',
      name: 'Hopper Car',
      length: 55, // feet
      width: 10.5, // feet
      height: 15, // feet
      maxWeight: 263000, // pounds
      deckHeight: 4, // feet from ground
      image: 'hopper'
    },
    {
      id: 'bnsf_tank',
      name: 'Tank Car',
      length: 40, // feet
      width: 10.5, // feet
      height: 15, // feet
      maxWeight: 198000, // pounds
      deckHeight: 4, // feet from ground
      image: 'tankcar'
    }
  ],
  'UP': [
    {
      id: 'up_boxcar',
      name: 'Boxcar',
      length: 60,
      width: 9.5,
      height: 15,
      maxWeight: 220000,
      deckHeight: 4,
      image: 'boxcar'
    },
    {
      id: 'up_flatcar',
      name: 'Flatcar',
      length: 89,
      width: 10,
      height: 2,
      maxWeight: 286000,
      deckHeight: 4,
      image: 'flatcar'
    },
    {
      id: 'up_auto',
      name: 'Auto Rack',
      length: 89,
      width: 10.5,
      height: 20,
      maxWeight: 220000,
      deckHeight: 4,
      image: 'autorack'
    }
  ],
  'CSX': [
    {
      id: 'csx_boxcar',
      name: 'Boxcar',
      length: 60,
      width: 9.5,
      height: 15,
      maxWeight: 220000,
      deckHeight: 4,
      image: 'boxcar'
    },
    {
      id: 'csx_flatcar',
      name: 'Flatcar',
      length: 89,
      width: 10,
      height: 2,
      maxWeight: 286000,
      deckHeight: 4,
      image: 'flatcar'
    },
    {
      id: 'csx_covered_hopper',
      name: 'Covered Hopper',
      length: 55,
      width: 10.5,
      height: 15,
      maxWeight: 263000,
      deckHeight: 4,
      image: 'coveredhopper'
    }
  ],
  'NS': [
    {
      id: 'ns_boxcar',
      name: 'Boxcar',
      length: 60,
      width: 9.5,
      height: 15,
      maxWeight: 220000,
      deckHeight: 4,
      image: 'boxcar'
    },
    {
      id: 'ns_flatcar',
      name: 'Flatcar',
      length: 89,
      width: 10,
      height: 2,
      maxWeight: 286000,
      deckHeight: 4,
      image: 'flatcar'
    },
    {
      id: 'ns_gondola',
      name: 'Gondola',
      length: 55,
      width: 10.5,
      height: 5,
      maxWeight: 263000,
      deckHeight: 4,
      image: 'gondola'
    }
  ],
  'CN': [
    {
      id: 'cn_boxcar',
      name: 'Boxcar',
      length: 60,
      width: 9.5,
      height: 15,
      maxWeight: 220000,
      deckHeight: 4,
      image: 'boxcar'
    },
    {
      id: 'cn_flatcar',
      name: 'Flatcar',
      length: 89,
      width: 10,
      height: 2,
      maxWeight: 286000,
      deckHeight: 4,
      image: 'flatcar'
    }
  ],
  'CP': [
    {
      id: 'cp_boxcar',
      name: 'Boxcar',
      length: 60,
      width: 9.5,
      height: 15,
      maxWeight: 220000,
      deckHeight: 4,
      image: 'boxcar'
    },
    {
      id: 'cp_flatcar',
      name: 'Flatcar',
      length: 89,
      width: 10,
      height: 2,
      maxWeight: 286000,
      deckHeight: 4,
      image: 'flatcar'
    }
  ]
};

// Get available car types for an operator
export function getCarTypesForOperator(operator) {
  return carTypes[operator] || carTypes['BNSF']; // Default to BNSF
}

// Get all unique car types across operators
export function getAllCarTypes() {
  const allTypes = new Map();
  Object.values(carTypes).forEach(operatorCars => {
    operatorCars.forEach(car => {
      if (!allTypes.has(car.name)) {
        allTypes.set(car.name, car);
      }
    });
  });
  return Array.from(allTypes.values());
}

