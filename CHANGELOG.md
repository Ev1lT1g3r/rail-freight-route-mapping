# Changelog

All notable changes to this project will be documented in this file.

## [1.7.0] - 2024-01-XX

### Added
- **F-001: Submission Templates** - Create, save, and reuse submission templates for common freight types and routes
  - Save current submission as template with custom name
  - Template library accessible from submission creation flow
  - Load templates to pre-fill submission form (origin, destination, preferences, freight, tags, notes)
  - Delete templates
  - Template management UI with collapsible panel
  - Empty state for templates
- **F-009: Route Comparison Tool** - Enhanced side-by-side route comparison
  - Compare up to 3 routes simultaneously
  - Side-by-side comparison view with detailed metrics
  - Table comparison view with best route highlighting
  - Route selection interface with visual indicators
  - Comparison metrics (distance, operators, transfers, curves, states)
  - Summary panel showing best routes for each metric
  - Select route directly from comparison tool
  - Toggle between side-by-side and table views
  - Modal overlay interface
  - Help tooltips for guidance
- **F-014: Freight Library/Catalog** - Maintain a library of common freight items
  - Save freight items to library with name, category, description, tags
  - Search and filter freight items by name, description, category, tags
  - Load freight items from library to pre-fill form
  - Edit/delete library items
  - Quick add from library to submission
  - Freight categories/tags organization
  - Save current freight to library
  - Modal interface for library management
  - Empty state for library
  - Usage tracking (usageCount field)
  - Compare up to 3 routes simultaneously
  - Side-by-side comparison view with detailed metrics
  - Table comparison view with best route highlighting
  - Route selection interface with visual indicators
  - Comparison metrics (distance, operators, transfers, curves, states)
  - Summary panel showing best routes for each metric
  - Select route directly from comparison tool
  - Toggle between side-by-side and table views
  - Modal overlay interface
  - Help tooltips for guidance
  - Save current submission as template with custom name
  - Template library accessible from submission creation flow
  - Load templates to pre-fill submission form (origin, destination, preferences, freight, tags, notes)
  - Delete templates
  - Template management UI with collapsible panel
  - Empty state for templates
- **F-004: Advanced Search and Filtering** - Enhanced search and filtering capabilities
  - Full-text search across all submission fields
  - Multi-criteria filtering (date range, operators, states, origin, destination, created by, tags, distance range)
  - Saved search presets with load/delete functionality
  - Search history (last 20 searches)
  - Filter combinations (AND logic)
  - Advanced filters panel with collapsible UI
  - Search history quick access
- **F-017: Submission Archiving** - Archive and unarchive submissions
  - Archive submissions to remove from active view
  - Unarchive to restore submissions
  - Toggle between Active and Archived views
  - Bulk archive/unarchive operations
  - Archive button in submission cards
- **F-030: Export Capabilities** - Export submissions in multiple formats
  - Export single submission to JSON, CSV, or Text
  - Export multiple submissions to CSV (filtered or all)
  - Export dropdown menu in SubmissionDetail
  - Export button in SubmissionsList
  - Comprehensive export data including route, freight, workflow info

### Fixed
- Fixed submitted submissions not being saved to localStorage
- Fixed submissions not appearing in list after save
- Added event-based refresh mechanism for submissions list
- Fixed filter logic to prevent over-filtering
- Fixed sortedSubmissions initialization error
- Enhanced save verification and error handling
- Improved timing for localStorage writes before navigation

### Improved
- Enhanced debug logging for submission loading and filtering
- Better error messages and user feedback
- Improved filter application logic
- Added localStorage inspection for debugging

## [Unreleased]

### Planned
- Backend API integration
- Authentication system
- Real-time collaboration
- Advanced analytics dashboard
- Export capabilities (PDF, Excel)
- Mobile app version

## [1.6.0] - 2024-12-16

### Added
- **Submission Duplication/Cloning (F-002)**
  - Duplicate button in SubmissionsList and SubmissionDetail
  - Creates new Draft submission with copied data
  - Auto-navigates to edit mode after duplication
  - Toast notification on successful duplication
  - All submission data preserved (route, freight, notes)

- **Freight Dimension Presets (F-015)**
  - 10 common freight type presets (containers, pallets, steel, machinery, etc.)
  - Preset dropdown in FreightSpecification component
  - Organized by category (Containers, Pallets, Steel, Machinery, etc.)
  - Auto-fills dimensions and weight when preset selected
  - Help tooltip for preset selection

- **Approval Comments (F-006)**
  - Optional approval comment field
  - Approval comments displayed in submission details
  - Replaced alert() with toast notifications
  - Enhanced approval/rejection UI with help tooltips
  - Approval comments stored in submission data

- **Saved Routes/Favorites (F-021)**
  - Save frequently used routes to favorites
  - Load saved routes with one click
  - Delete saved routes
  - Show/hide saved routes panel
  - Route storage utility (routeStorage.js)
  - Visual indicators for saved routes
  - Route count display

- **Unit Conversion (F-029)**
  - Unit system toggle (Imperial/Metric)
  - Automatic conversion when switching systems
  - Length conversion (feet ↔ meters)
  - Weight conversion (pounds ↔ kilograms)
  - Unit labels update based on selected system
  - Help tooltips for unit conversion
  - Preserves values when switching systems

### Changed
- **SubmissionDetail**
  - Enhanced approval workflow with optional comments
  - Improved visual feedback for approval actions
  - Better error handling with toast notifications

- **FreightSpecification**
  - Added unit system selector
  - Dynamic unit labels based on selected system
  - Automatic value conversion on system change

- **SubmissionForm**
  - Added saved routes management
  - Route favorites functionality
  - Improved route finding workflow

### Fixed
- Fixed duplicate imports in SubmissionForm
- Improved error handling in route finding

## [1.5.0] - 2024-12-16

### Added
- **Reusable EmptyState Component**
  - Consistent empty state design throughout application
  - Animated icons with floating effect
  - Support for primary and secondary action buttons
  - Customizable icons, titles, and messages
  - Used in SubmissionsList and RouteResults

- **Bulk Operations for Submissions**
  - Bulk mode toggle to enable multi-selection
  - Checkbox selection for individual submissions
  - Select All / Deselect All functionality
  - Bulk delete selected submissions
  - Bulk status change (mark as Submitted)
  - Visual feedback for selected items
  - Selection counter display

- **Enhanced Contextual Help**
  - Help tooltips in SubmissionsList (filters, sorting, bulk operations)
  - Help tooltips in SubmissionDetail (route map, submission info)
  - Help tooltips in RouteTable (route comparison)
  - Improved user guidance and feature discoverability

### Changed
- **Empty States**
  - Replaced inline empty state code with reusable EmptyState component
  - Consistent styling and animations across all empty states
  - Better user experience with actionable empty states

- **SubmissionsList**
  - Added bulk operations UI with selection checkboxes
  - Enhanced filter and sort labels with help tooltips
  - Improved empty state with EmptyState component
  - Better visual feedback for selected submissions

- **RouteResults**
  - Replaced inline empty state with EmptyState component
  - Consistent empty state design

### Fixed
- Fixed missing CHW station definition (consolidated to CHA)
- Fixed missing ALB station reference (changed to ABQ)
- Removed duplicate CHA-PIT connection
- All network connections now reference valid stations

### Testing
- Added EmptyState component tests (6 tests)
- Updated SubmissionsList tests for bulk operations
- All 129+ tests passing

## [1.4.0] - 2024-12-16

### Added
- **Enhanced Route Finding Algorithm**
  - Improved path exploration with better visited node tracking
  - Supports routes up to 15 stations for long-distance shipping
  - Alternative path discovery for better route options
  - Iteration limits to prevent infinite loops
  - Graceful handling of missing or invalid connections

- **Expanded Freight Yard Network**
  - Added connections for isolated stations (Charleston, Lubbock)
  - All 90+ freight yards now fully connected to the network
  - 155+ connections across North America
  - Improved network connectivity validation

- **Unlimited Freight Yard Selection**
  - Removed 10-item limit when no search term (now shows all 90+ yards)
  - Removed 20-item limit when searching (shows all matching results)
  - Alphabetically sorted results for better usability
  - Increased dropdown max-height to 500px

### Changed
- **Terminology Updates**
  - Updated all references from "terminals" to "freight yards" or "rail yards"
  - Updated labels: "Shipping Origin Yard" and "Delivery Destination Yard"
  - Updated error messages and help text to reflect freight-appropriate terminology
  - Updated map markers and popups to use freight yard terminology

- **Route Finding Improvements**
  - Enhanced algorithm to find routes between any connected freight yards
  - Better error messages when routes cannot be found
  - Improved validation for origin and destination selection

### Fixed
- Fixed isolated stations (Charleston/CHA and Lubbock/LUB) by adding connections
- Fixed route finding algorithm to properly respect maxTransfers limit
- Fixed missing HelpTooltip import in FreightSpecification component
- Fixed dropdown height to accommodate all freight yards
- Fixed route finding errors with invalid station codes or missing connections
- Improved error handling in buildRouteDetails function

### Testing
- Updated all tests to reflect new terminology
- Updated routeFinder tests for improved algorithm
- All 116+ tests passing

## [1.3.0] - 2024-12-16

### Added
- **Route Preference Presets**
  - Fastest Route preset (prioritize distance and transfers)
  - Simplest Route preset (prefer single operator)
  - Straightest Route preset (minimize curves)
  - Balanced preset (equal weight to all factors)
  - Custom preset for manual adjustment
  - Automatic preset matching based on current preferences

- **TerminalSearch Component**
  - Intelligent autocomplete search for terminals
  - Keyboard navigation (Arrow keys, Enter, Escape)
  - Filter by code, name, state, or operator
  - Clear selection button
  - Accessible with proper labels and ARIA attributes

- **Progress Indicator**
  - Visual progress indicator for multi-step forms
  - Step highlighting and completion status
  - Clickable steps for navigation
  - Percentage-based progress display

- **Toast Notification System**
  - Global toast context for application-wide notifications
  - Success, error, warning, and info toast types
  - Auto-dismiss with configurable duration
  - Multiple toast support
  - Positioned at top-right of screen

- **Enhanced Error Handling**
  - Comprehensive validation for route finding
  - Clear error messages for invalid inputs
  - Station code validation before route calculation
  - Better error handling in route building

- **Inline Form Validation**
  - Real-time validation feedback
  - Clear error messages for each field
  - Visual error indicators (red borders)
  - Prevents submission with invalid data

- **Loading States**
  - Loading indicators during route finding
  - Disabled buttons during async operations
  - Better user feedback for long operations

### Changed
- Updated RouteConfig to include preset selection
- Enhanced SubmissionForm with TerminalSearch instead of dropdowns
- Improved error messages throughout application
- Better validation flow in multi-step form

### Fixed
- Route finding errors with invalid station codes
- TerminalSearch value handling and clearing
- Test failures related to TerminalSearch component
- Error handling in routeFinder for missing stations
- BuildRouteDetails validation for invalid paths

### Testing
- Added TerminalSearch component tests
- Added ProgressIndicator component tests
- Added ToastContext tests
- Updated RouteConfig tests for presets
- Updated routeFinder tests for error handling
- All 100+ tests passing

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

