# API Documentation

## Component APIs

### SubmissionsList

**Props:**
```typescript
{
  onViewSubmission: (id: string) => void;
  onCreateNew: () => void;
  onEditSubmission: (id: string) => void;
  onBackToHome?: () => void;
}
```

**Features:**
- Displays all submissions with filtering and sorting
- Shows submission status, dates, and metadata
- Provides edit and delete actions
- **Bulk Operations**:
  - Bulk mode toggle
  - Multi-select with checkboxes
  - Select All / Deselect All
  - Bulk delete selected submissions
  - Bulk status change (mark as Submitted)
- Contextual help tooltips for filters and sorting
- Enhanced empty states with actionable CTAs

### SubmissionForm

**Props:**
```typescript
{
  submissionId?: string | null;
  onSave: (submission: Submission, shouldNavigateAway?: boolean) => void;
  onCancel: () => void;
  currentUser?: string;
}
```

**Features:**
- Multi-step form (Route → Freight → Review)
- Draft saving capability
- Submission for approval
- Auto-loads existing submission data when editing

### SubmissionDetail

**Props:**
```typescript
{
  submissionId: string;
  onBack: () => void;
  onEdit?: (id: string) => void;
  currentUser?: string;
  isApprover?: boolean;
}
```

**Features:**
- View-only submission details
- Approval/rejection actions (for approvers)
- Full metadata display
- Route and freight visualization
- Large interactive map with auto-zoom to route
- Operator-specific segment colors and labels
- Transfer point markers
- Contextual help tooltips

### FreightSpecification

**Props:**
```typescript
{
  freight: Freight | null;
  onFreightChange: (freight: Freight) => void;
}
```

**Features:**
- Input form for freight dimensions
- File upload for diagrams
- Auto-calculates volume and density

### FreightPlacementVisualization

**Props:**
```typescript
{
  freight: Freight;
  operators: string[];
  selectedRoute: Route;
  onFreightChange?: (freight: Freight) => void;
}
```

**Features:**
- **Split-Layout Interface**:
  - Left Panel: Compliance probability analysis
  - Center Panel: Real-time visualization (top and side views)
  - Right Panel: Interactive freight geometry controls
- Visual placement on car types
- Center of gravity calculations
- Auto-selection of best car type
- Interactive placement controls (forward/backward, left/right)
- Real-time freight dimension adjustment via sliders
- Compliance probability display with factor breakdown
- Car type recommendations panel

## Utility Functions

### routeFinder.js

#### `findRoutes(origin, destination, preferences)`
Finds top 3 routes between terminals.

**Parameters:**
- `origin` (string): Origin terminal code (required, must exist in stations)
- `destination` (string): Destination terminal code (required, must exist in stations)
- `preferences` (object): Route preferences (optional, defaults provided)
  - `weightDistance` (number): Distance weight (0-2, default: 1.0)
  - `weightSingleOperator` (number): Single operator preference (0-2, default: 0.5)
  - `weightCurves` (number): Straight route preference (0-2, default: 0.3)
  - `maxTransfers` (number): Maximum transfers (1-10, default: 5)

**Returns:**
Array of route objects with:
- `path`: Array of station objects
- `totalDistance`: Total distance in miles
- `operators`: Array of operator names
- `operatorCount`: Number of operators
- `transferPoints`: Array of transfer details
- `states`: Array of state/province codes
- `segments`: Array of route segments

**Throws:**
- `Error`: If origin or destination is missing or invalid
- `Error`: If origin or destination station code doesn't exist

### routePresets.js

#### `ROUTE_PRESETS`
Object containing route preference presets:
- `FASTEST`: Prioritize shortest distance and fewest transfers
- `SIMPLEST`: Prefer single operator with minimal transfers
- `STRAIGHTEST`: Minimize curves and turns for stability
- `BALANCED`: Balance all factors equally
- `CUSTOM`: Manual preference adjustment

#### `findMatchingPreset(preferences)`
Finds the preset that most closely matches given preferences.

**Parameters:**
- `preferences` (object): Route preferences object

**Returns:**
String key of matching preset, or 'CUSTOM' if no match found

#### `getPresetByName(name)`
Gets a preset by name.

**Parameters:**
- `name` (string): Preset name (FASTEST, SIMPLEST, etc.)

**Returns:**
Preset object or BALANCED if not found

### freightCalculations.js

#### `calculateCenterOfGravity(freight, car, placement)`
Calculates center of gravity for freight on car.

**Parameters:**
- `freight` (object): Freight specifications
  - `length`, `width`, `height` (number): Dimensions in feet
  - `weight` (number): Weight in pounds
- `car` (object): Car specifications
  - `length`, `width`, `height` (number): Dimensions in feet
  - `maxWeight` (number): Max weight in pounds
  - `deckHeight` (number): Deck height in feet
- `placement` (object): Placement position
  - `x` (number): Forward/backward offset in feet
  - `y` (number): Left/right offset in feet

**Returns:**
Object with:
- `freightCG`: Freight center of gravity (x, y, z)
- `carCG`: Car center of gravity (x, y, z)
- `combinedCG`: Combined center of gravity (x, y, z)
- `validations`: Validation results
- `totalWeight`, `carWeight`, `freightWeight`: Weight breakdown

#### `getRecommendedCarTypes(freight, operators, carTypesData)`
Gets car type recommendations.

**Parameters:**
- `freight` (object): Freight specifications
- `operators` (array): Array of operator names
- `carTypesData` (object): Car types data structure

**Returns:**
Array of recommendation objects with:
- `operator`: Operator name
- `car`: Car type object
- `score`: Recommendation score
- `isPerfectFit`: Boolean
- `fits`: Array of fitting dimensions
- `issues`: Array of issues
- `lengthUtilization`, `widthUtilization`, `weightUtilization`: Utilization percentages

#### `getBestCarTypeForFreight(freight, operators, carTypesData)`
Gets the best car type for freight.

**Returns:**
Object with:
- `operator`: Best operator
- `car`: Best car type
- `recommendation`: Full recommendation object

### complianceCalculator.js

#### `calculateComplianceProbability(freight, car, placement, route, operator)`
Calculates compliance probability for freight shipment approval.

**Parameters:**
- `freight` (object): Freight specifications
- `car` (object): Car specifications
- `placement` (object): Placement position (x, y offsets)
- `route` (object): Route information
- `operator` (string): Operator name

**Returns:**
Object with:
- `probability` (number): Overall compliance probability (0-100)
- `category` (string): Category classification ('High', 'Medium', 'Low', 'Very Low')
- `color` (string): Color code for UI display
- `factors` (array): Array of factor objects with:
  - `name` (string): Factor name
  - `score` (number): Factor score (0-100)
  - `weight` (number): Weight in overall calculation
  - `details` (array): Detailed information
- `warnings` (array): Array of warning messages
- `criticalIssues` (array): Array of critical issue messages
- `recommendations` (array): Array of recommendation objects with:
  - `priority` (string): Priority level
  - `action` (string): Recommended action
  - `items` (array): Specific items to address

### ToastContext

#### `ToastProvider`
React context provider for global toast notifications.

**Usage:**
```jsx
<ToastProvider>
  <App />
</ToastProvider>
```

#### `useToast()`
Hook to access toast functions within ToastProvider.

**Returns:**
Object with:
- `success(message, duration?)`: Show success toast
- `error(message, duration?)`: Show error toast
- `warning(message, duration?)`: Show warning toast
- `info(message, duration?)`: Show info toast
- `showToast(message, type, duration)`: Show custom toast
- `removeToast(id)`: Remove toast by ID

**Example:**
```jsx
function MyComponent() {
  const { success, error } = useToast();
  
  const handleSave = () => {
    success('Saved successfully!');
  };
}
```

### submissionStorage.js

#### `getAllSubmissions()`
Gets all submissions from storage.

**Returns:** Array of submission objects

#### `saveSubmission(submission)`
Saves a submission to storage.

**Parameters:**
- `submission` (object): Submission object

**Returns:** Boolean (success)

#### `getSubmissionById(id)`
Gets a submission by ID.

**Parameters:**
- `id` (string): Submission ID

**Returns:** Submission object or undefined

#### `deleteSubmission(id)`
Deletes a submission.

**Parameters:**
- `id` (string): Submission ID

**Returns:** Boolean (success)

#### `createSubmissionId()`
Creates a unique submission ID.

**Returns:** String (submission ID)

#### `WORKFLOW_STATUS`
Constants for workflow statuses:
- `DRAFT`: 'Draft'
- `SUBMITTED`: 'Submitted'
- `PENDING_APPROVAL`: 'Pending Approval'
- `APPROVED`: 'Approved'
- `REJECTED`: 'Rejected'

## Data Structures

### Submission Object
```javascript
{
  id: string,
  name: string,
  origin: string,
  destination: string,
  preferences: {
    weightDistance: number,
    weightSingleOperator: number,
    weightCurves: number,
    maxTransfers: number
  },
  routes: Route[],
  selectedRouteIndex: number,
  selectedRoute: Route,
  freight: Freight,
  notes: string,
  status: string,
  createdDate: string,  // ISO date string
  submittedDate: string,
  approvedDate: string,
  rejectedDate: string,
  createdBy: string,
  submittedBy: string,
  approvedBy: string,
  rejectedBy: string,
  rejectionReason: string,
  updatedDate: string,
  updatedBy: string
}
```

### Freight Object
```javascript
{
  description: string,
  length: number,    // feet
  width: number,     // feet
  height: number,    // feet
  weight: number,    // pounds
  diagram: string    // base64 image data (optional)
}
```

### Route Object
```javascript
{
  path: Station[],
  totalDistance: number,
  operators: string[],
  operatorCount: number,
  transferPoints: TransferPoint[],
  states: string[],
  segments: RouteSegment[]
}
```

### Station Object
```javascript
{
  name: string,
  lat: number,
  lng: number,
  state: string,
  operator: string
}
```

### Car Type Object
```javascript
{
  id: string,
  name: string,
  length: number,      // feet
  width: number,       // feet
  height: number,      // feet
  maxWeight: number,    // pounds
  deckHeight: number,   // feet
  image: string
}
```

