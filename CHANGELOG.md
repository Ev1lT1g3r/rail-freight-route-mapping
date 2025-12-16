# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Planned
- Backend API integration
- Authentication system
- Real-time collaboration
- Advanced analytics dashboard
- Export capabilities (PDF, Excel)
- Mobile app version

## [1.2.0] - 2024-12-16

### Added
- **Interactive Freight Planning Interface**
  - Split-layout design with three panels (Compliance, Visualization, Controls)
  - Real-time freight geometry controls with sliders
  - Interactive dimension adjustment (length, width, height, weight)
  - Live updates to visualization as dimensions change

- **Compliance Probability Calculator**
  - Multi-factor compliance scoring system
  - Real-time probability calculation (0-100%)
  - Category classification (High/Medium/Low/Very Low)
  - Factor breakdown with individual scores:
    - Dimension Compliance (40% weight)
    - Weight Compliance (25% weight)
    - Center of Gravity (20% weight)
    - Operator Rules (10% weight)
    - Route Compatibility (5% weight)
  - Critical issues identification
  - Warnings and recommendations
  - Actionable improvement suggestions

- **Enhanced Route Map Visualization**
  - Operator-specific route segment styling with gradients
  - Shadow/glow effects for better visibility
  - Enhanced operator labels with logos
  - Interactive tooltips with segment details
  - Operator statistics panel showing:
    - Distance per operator
    - Number of segments
    - Station count
    - Total route statistics
  - Improved visual distinction between operators
  - Better contrast on satellite view

### Changed
- Redesigned FreightPlacementVisualization component with split-layout
- Enhanced MapComponent with richer operator-specific visualizations
- Improved user experience with real-time feedback
- Better integration between freight planning and compliance analysis

### Fixed
- Circular dependency issues in compliance calculator
- Import/export consistency across modules

## [1.1.0] - 2024-12-16

### Added
- **Documentation Suite**
  - Comprehensive README.md with all features
  - ARCHITECTURE.md with system design
  - API.md with component and utility documentation
  - CONTRIBUTING.md with contribution guidelines
  - DEPLOYMENT.md with deployment instructions
  - CHANGELOG.md with version history

- **Test Coverage**
  - FreightSpecification component tests
  - Freight calculations utility tests
  - Car types data validation tests
  - 90+ tests total, all passing

### Fixed
- Label associations for accessibility
- Test failures and coverage gaps
- Documentation accuracy and completeness

## [1.0.0] - 2024-12-16

## [1.0.0] - 2024-12-16

### Added
- **Submission Workflow System**
  - Multi-step submission process (Route → Freight → Review)
  - Draft saving and editing capability
  - Approval workflow with status tracking
  - Comprehensive metadata tracking (dates, users, notes)
  - Edit functionality for drafts and rejected submissions

- **Freight Specification & Visualization**
  - Freight dimension input (length, width, height, weight)
  - Freight diagram/image upload
  - Automatic volume and density calculations
  - Car type auto-selection based on freight dimensions
  - Top 5 car type recommendations with scoring
  - Interactive freight placement visualization
  - Top view (deck) and side view (profile) displays
  - Placement controls (forward/backward, left/right offset)

- **Center of Gravity Calculations**
  - Longitudinal (X-axis) center of gravity
  - Lateral (Y-axis) center of gravity
  - Vertical (Z-axis) center of gravity
  - Combined car + freight CG calculations
  - Real-time validation and warnings
  - Placement bounds checking

- **Enhanced Map Features**
  - Satellite/imagery view for route visualization
  - Automatic satellite view when routes are selected
  - Layer control (Map View / Satellite View)
  - Operator-specific route segment coloring
  - Closer zoom for route tracks
  - Operator labels on route segments

- **Operator-Specific Car Types**
  - BNSF: Boxcar, Flatcar, Hopper Car, Tank Car
  - Union Pacific: Boxcar, Flatcar, Auto Rack
  - CSX: Boxcar, Flatcar, Covered Hopper
  - Norfolk Southern: Boxcar, Flatcar, Gondola
  - Canadian National: Boxcar, Flatcar
  - Canadian Pacific: Boxcar, Flatcar

- **Sigma IQ Branding**
  - Professional color scheme
  - Consistent UI/UX
  - Branded headers and styling

- **Comprehensive Testing**
  - 90+ tests across all modules
  - Component tests with React Testing Library
  - Utility function tests
  - Data validation tests
  - Test coverage reporting

### Changed
- Converted from simple route finder to full submission workflow system
- Updated UI to multi-step form process
- Enhanced map visualization with satellite view
- Improved route visualization with operator colors

### Fixed
- Circular dependency in center of gravity calculations
- JSX syntax errors in components
- Label associations for accessibility
- Test failures and coverage gaps

## [0.1.0] - Initial Release

### Added
- Basic route finding functionality
- Interactive map with Leaflet
- Route preference configuration
- Top 3 route recommendations
- Basic route visualization

