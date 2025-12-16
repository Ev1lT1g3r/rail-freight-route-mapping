# API Documentation

## Component APIs

### SubmissionsList

**Props:**
```typescript
{
  onViewSubmission: (id: string) => void;
  onCreateNew: () => void;
  onEditSubmission: (id: string) => void;
}
```

**Features:**
- Displays all submissions with filtering and sorting
- Shows submission status, dates, and metadata
- Provides edit and delete actions

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
}
```

**Features:**
- Visual placement on car types
- Center of gravity calculations
- Auto-selection of best car type
- Interactive placement controls

## Utility Functions

### routeFinder.js

#### `findRoutes(origin, destination, preferences)`
Finds top 3 routes between terminals.

**Parameters:**
- `origin` (string): Origin terminal code
- `destination` (string): Destination terminal code
- `preferences` (object): Route preferences
  - `weightDistance` (number): Distance weight (0-2)
  - `weightSingleOperator` (number): Single operator preference (0-2)
  - `weightCurves` (number): Straight route preference (0-2)
  - `maxTransfers` (number): Maximum transfers (1-10)

**Returns:**
Array of route objects with:
- `path`: Array of station objects
- `totalDistance`: Total distance in miles
- `operators`: Array of operator names
- `operatorCount`: Number of operators
- `transferPoints`: Array of transfer details
- `states`: Array of state/province codes
- `segments`: Array of route segments

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

