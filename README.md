# Rail Freight Route Mapping

A comprehensive web application for managing freight rail route submissions with approval workflow, freight placement visualization, and center of gravity calculations. Built with React and Leaflet, featuring Sigma IQ branding.

## Overview

This application provides a complete solution for freight rail route planning and submission management. Users can find optimal routes, specify freight details, visualize freight placement on rail cars, and manage submissions through an approval workflow.

## Key Features

### 🗺️ Interactive Route Finding
- **Interactive Map**: Visualize freight rail terminals across North America using Leaflet maps
- **Satellite View**: Automatic satellite/imagery view when routes are selected for detailed track visualization
- **Route Finding**: Calculate optimal routes using Dijkstra's algorithm with configurable preferences
- **Operator-Specific Visualization**: Color-coded route segments by operator (BNSF, UP, CSX, NS, CN, CP)
- **Zoom Optimization**: Automatic closer zoom for route visualization

### 📋 Submission Workflow System
- **Multi-Step Submission Process**: 
  - Step 1: Route Selection
  - Step 2: Freight Specification
  - Step 3: Review & Submit
- **Draft Management**: Save drafts and resume editing later
- **Status Tracking**: Draft, Submitted, Pending Approval, Approved, Rejected
- **Comprehensive Metadata**: Track submission dates, users, approval history, and notes
- **Edit Capability**: Edit draft and rejected submissions

### 📦 Freight Specification & Visualization
- **Freight Details**: Enter dimensions (length, width, height), weight, and description
- **Diagram Upload**: Upload freight diagrams/images
- **Auto-Calculations**: Automatic volume and density calculations
- **Car Type Auto-Selection**: Automatically recommends best car type based on freight dimensions and route operators
- **Placement Visualization**: 
  - Top view (deck) showing freight placement
  - Side view (profile) showing vertical placement
  - Interactive placement controls (forward/backward, left/right offset)
- **Center of Gravity Analysis**:
  - Longitudinal (X-axis), Lateral (Y-axis), and Vertical (Z-axis) calculations
  - Real-time validation and warnings
  - Combined car + freight center of gravity

### 🚂 Operator-Specific Car Types
- **BNSF**: Boxcar, Flatcar, Hopper Car, Tank Car
- **Union Pacific (UP)**: Boxcar, Flatcar, Auto Rack
- **CSX**: Boxcar, Flatcar, Covered Hopper
- **Norfolk Southern (NS)**: Boxcar, Flatcar, Gondola
- **Canadian National (CN)**: Boxcar, Flatcar
- **Canadian Pacific (CP)**: Boxcar, Flatcar

### ✅ Approval Workflow
- **Approver Actions**: Approve or reject submissions with reason
- **Audit Trail**: Complete history of submission lifecycle
- **Status Filtering**: Filter submissions by status
- **Sorting Options**: Sort by date, status, or origin

### 🎨 Sigma IQ Branding
- Professional color scheme and styling
- Consistent UI/UX throughout the application
- Modern, clean interface

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps with satellite imagery support
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **LocalStorage** - Client-side data persistence (can be replaced with backend API)

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
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── components/
│   ├── MapComponent.jsx              # Interactive map with Leaflet (satellite view support)
│   ├── RouteConfig.jsx               # Route preference controls
│   ├── RouteResults.jsx              # Route display and details
│   ├── SubmissionsList.jsx           # Main landing page with all submissions
│   ├── SubmissionForm.jsx             # Multi-step submission form
│   ├── SubmissionDetail.jsx          # Submission detail view with approval actions
│   ├── FreightSpecification.jsx      # Freight input form
│   ├── FreightPlacementVisualization.jsx  # Freight placement visualization
│   ├── ErrorBoundary.jsx            # Error handling
│   └── *.test.jsx                   # Component tests
├── data/
│   ├── railNetwork.js               # Freight rail network data
│   ├── carTypes.js                  # Car type specifications by operator
│   └── *.test.js                    # Data tests
├── utils/
│   ├── routeFinder.js               # Route finding algorithm (Dijkstra)
│   ├── freightCalculations.js       # Center of gravity and placement calculations
│   ├── submissionStorage.js         # LocalStorage utilities for submissions
│   └── *.test.js                    # Utility tests
└── App.jsx                          # Main application component with routing
```

## Usage Guide

### Creating a New Submission

1. **Navigate to Submissions**: Click "New Submission" from the main page
2. **Step 1 - Route Selection**:
   - Select origin and destination terminals
   - Configure route preferences (distance, operator, curves, transfers)
   - Click "Find Routes" to calculate top 3 routes
   - Select a route from the results
3. **Step 2 - Freight Specification**:
   - Enter freight description
   - Specify dimensions (length, width, height in feet)
   - Enter weight (in pounds)
   - Optionally upload a freight diagram/image
   - View automatic car type recommendations
   - Adjust freight placement on car (if needed)
   - Review center of gravity analysis
4. **Step 3 - Review & Submit**:
   - Review route summary
   - Review freight summary
   - Add notes (optional)
   - Click "Submit for Approval" or "Save as Draft"

### Managing Submissions

- **View All Submissions**: Main page shows all submissions with status badges
- **Filter**: Filter by status (Draft, Submitted, Pending, Approved, Rejected)
- **Sort**: Sort by date, status, or origin
- **Edit Drafts**: Click "Edit" on draft submissions to resume editing
- **View Details**: Click any submission to view full details
- **Approve/Reject**: Approvers can approve or reject submissions (with reason for rejection)

### Freight Placement Visualization

- **Auto-Selection**: System automatically selects best car type when freight dimensions are entered
- **Recommendations**: View top 5 car type recommendations with scores
- **Placement Controls**: Adjust forward/backward and left/right placement
- **Real-Time Validation**: See immediate feedback on placement validity
- **Center of Gravity**: View calculated CG with warnings for stability issues

## Route Finding Algorithm

The route finder uses a modified Dijkstra's algorithm that considers:
- **Distance**: Total route distance in miles
- **Operator Count**: Number of different railroad operators
- **Curve Score**: Measure of route straightness (lower is better)
- **Transfers**: Number of interline transfer points

Routes are scored using weighted preferences and the top 3 routes are returned.

## Center of Gravity Calculations

The system calculates center of gravity for freight placement:
- **Longitudinal (X-axis)**: Forward/backward position along car length
- **Lateral (Y-axis)**: Left/right position across car width
- **Vertical (Z-axis)**: Height above ground level

Validations include:
- Dimension checks (fits on car)
- Weight capacity limits
- Placement bounds
- Stability warnings for CG offsets

## Car Type Auto-Selection

The system automatically recommends car types based on:
- **Dimension Fit**: Length, width, height compatibility
- **Weight Capacity**: Freight weight vs. car max weight
- **Space Utilization**: Optimal use of car space (70-95% ideal)
- **Freight Characteristics**: Tall/heavy freight preferences
- **Operator Availability**: Only considers operators in selected route

## Freight Rail Network

The application includes data for major Class I freight railroads:
- **BNSF Railway**
- **Union Pacific (UP)**
- **CSX Transportation**
- **Norfolk Southern (NS)**
- **Canadian National (CN)**
- **Canadian Pacific (CP)**

## Testing

The project includes comprehensive test coverage:
- **Component Tests**: All major components have test files
- **Utility Tests**: Route finding, freight calculations, storage
- **Data Tests**: Network data and car type validation
- **90+ Tests**: All passing

Run tests with:
```bash
npm test
```

## Data Persistence

Currently uses browser LocalStorage for data persistence. In a production environment, this should be replaced with a backend API. The `submissionStorage.js` utility can be easily modified to use API calls instead of LocalStorage.

## Workflow States

- **Draft**: Saved but not submitted (can be edited)
- **Submitted**: Submitted for approval (awaiting review)
- **Pending Approval**: In review process
- **Approved**: Approved by approver
- **Rejected**: Rejected with reason (can be edited and resubmitted)

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the GitHub repository.
