# Architecture Documentation

## System Overview

The Rail Freight Route Mapping application is a React-based single-page application that provides route finding, freight specification, and submission workflow management for freight rail operations.

## Architecture Patterns

### Component Structure
- **Functional Components**: All components use React functional components with hooks
- **Component Composition**: Reusable components with clear separation of concerns
- **Error Boundaries**: Graceful error handling with ErrorBoundary component

### State Management
- **Local State**: useState for component-level state
- **Derived State**: useMemo for computed values
- **LocalStorage**: Client-side persistence for submissions
- **No Global State**: No Redux/Context needed for current scope

### Data Flow
1. User interactions trigger state updates
2. State changes trigger re-renders
3. Components fetch data from utilities/storage
4. Updates propagate through props

## Key Components

### App.jsx
- Main application router
- Manages view state (LIST, CREATE, EDIT, VIEW)
- Coordinates between list, form, and detail views

### SubmissionsList.jsx
- Landing page showing all submissions
- Filtering and sorting capabilities
- Navigation to create/edit/view actions

### SubmissionForm.jsx
- Multi-step form (Route → Freight → Review)
- Manages submission state
- Handles draft saving and submission

### SubmissionDetail.jsx
- View-only submission details
- Approval/rejection actions for approvers
- Full metadata display

### FreightSpecification.jsx
- Input form for freight dimensions
- File upload for diagrams
- Volume/density calculations

### FreightPlacementVisualization.jsx
- Visual placement on car types
- Center of gravity calculations
- Auto-selection of best car type
- Interactive placement controls

### MapComponent.jsx
- Leaflet map integration
- Satellite view support
- Route visualization with operator colors
- Marker management

## Data Models

### Submission
```javascript
{
  id: string,
  name: string,
  origin: string,
  destination: string,
  preferences: object,
  routes: array,
  selectedRouteIndex: number,
  selectedRoute: object,
  freight: object,
  notes: string,
  status: string,
  createdDate: ISO string,
  submittedDate: ISO string,
  approvedDate: ISO string,
  rejectedDate: ISO string,
  createdBy: string,
  submittedBy: string,
  approvedBy: string,
  rejectedBy: string,
  rejectionReason: string
}
```

### Freight
```javascript
{
  description: string,
  length: number,  // feet
  width: number,   // feet
  height: number,  // feet
  weight: number,  // pounds
  diagram: string  // base64 image data
}
```

### Car Type
```javascript
{
  id: string,
  name: string,
  length: number,      // feet
  width: number,       // feet
  height: number,      // feet
  maxWeight: number,   // pounds
  deckHeight: number,  // feet
  image: string
}
```

## Utilities

### routeFinder.js
- Dijkstra's algorithm implementation
- Weighted cost function
- Returns top 3 routes

### freightCalculations.js
- Center of gravity calculations
- Placement validation
- Car type recommendations
- Auto-selection logic

### submissionStorage.js
- LocalStorage wrapper
- CRUD operations for submissions
- Workflow status constants

## Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- Utility functions
- Data validation

### Test Coverage
- 90+ tests across all modules
- Component tests with React Testing Library
- Utility tests with Vitest
- Data structure validation

## Performance Considerations

### Optimization Techniques
- useMemo for expensive calculations
- useCallback for stable function references
- Lazy loading for map components
- Efficient re-renders with proper dependencies

### Map Performance
- Leaflet map instance reuse
- Marker cleanup on updates
- Efficient bounds calculations
- Satellite tile caching

## Security Considerations

### Current Implementation
- Client-side only (LocalStorage)
- No authentication (placeholder user)
- No data validation on server

### Production Recommendations
- Backend API with authentication
- Input validation and sanitization
- Role-based access control
- Secure file upload handling
- HTTPS enforcement

## Deployment

### Build Process
```bash
npm run build
```
Creates optimized production build in `dist/` directory.

### Environment Variables
Currently none required. For production:
- API endpoint URLs
- Authentication configuration
- Feature flags

## Future Enhancements

### Potential Improvements
- Backend API integration
- Real-time collaboration
- Advanced analytics
- Export capabilities (PDF, Excel)
- Mobile app version
- Multi-language support
- Advanced freight calculations
- Integration with rail scheduling systems

