# Rail Freight Route Mapping

A web application for finding optimal freight rail routes across North America. This interactive map-based tool allows users to select origin and destination terminals, configure route preferences, and visualize the top 3 best routes based on distance, operator preferences, and route characteristics.

## Features

- **Interactive Map**: Visualize freight rail terminals across North America using Leaflet maps
- **Route Finding**: Calculate optimal routes using Dijkstra's algorithm with configurable preferences
- **Route Preferences**:
  - Distance weight (prioritize shorter routes)
  - Single operator preference (minimize interline transfers)
  - Straight route preference (minimize curves and turns)
  - Maximum transfers limit
- **Route Visualization**: 
  - Clear origin (green "O") and destination (red "D") markers
  - Route lines following actual terminal connections
  - Intermediate waypoint markers
- **Detailed Route Information**:
  - Total distance traveled
  - Railroad operators involved
  - Interline transfer points
  - States/provinces traversed
  - Route segments with distances

## Freight Rail Network

The application includes data for major Class I freight railroads:
- **BNSF Railway**
- **Union Pacific (UP)**
- **CSX Transportation**
- **Norfolk Southern (NS)**
- **Canadian National (CN)**
- **Canadian Pacific (CP)**

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Project Structure

```
src/
├── components/
│   ├── MapComponent.jsx      # Interactive map with Leaflet
│   ├── RouteConfig.jsx       # Route preference controls
│   ├── RouteResults.jsx      # Route display and details
│   └── ErrorBoundary.jsx     # Error handling
├── data/
│   └── railNetwork.js        # Freight rail network data
├── utils/
│   └── routeFinder.js        # Route finding algorithm
└── App.jsx                   # Main application component
```

## Usage

1. **Select Origin**: Click on a terminal on the map or use the dropdown to select an origin terminal
2. **Select Destination**: Click on another terminal or use the dropdown to select a destination
3. **Configure Preferences**: Adjust the sliders to prioritize different route characteristics
4. **Find Routes**: Click "Find Routes" to calculate the top 3 routes
5. **View Details**: Click on any route card to see it highlighted on the map and view detailed information

## Route Finding Algorithm

The route finder uses a modified Dijkstra's algorithm that considers:
- **Distance**: Total route distance in miles
- **Operator Count**: Number of different railroad operators
- **Curve Score**: Measure of route straightness (lower is better)
- **Transfers**: Number of interline transfer points

Routes are scored using weighted preferences and the top 3 routes are returned.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
