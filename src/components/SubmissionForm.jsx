import { useState, useMemo } from 'react';
import MapComponent from './MapComponent';
import RouteConfig from './RouteConfig';
import RouteResults from './RouteResults';
import ErrorBoundary from './ErrorBoundary';
import { stations } from '../data/railNetwork';
import { findRoutes } from '../utils/routeFinder';
import { saveSubmission, createSubmissionId, WORKFLOW_STATUS, getSubmissionById } from '../utils/submissionStorage';

function SubmissionForm({ submissionId, onSave, onCancel, currentUser = 'Current User' }) {
  const existingSubmission = submissionId ? getSubmissionById(submissionId) : null;
  
  const [origin, setOrigin] = useState(existingSubmission?.origin || '');
  const [destination, setDestination] = useState(existingSubmission?.destination || '');
  const [preferences, setPreferences] = useState(existingSubmission?.preferences || {
    weightDistance: 1.0,
    weightSingleOperator: 0.5,
    weightCurves: 0.3,
    maxTransfers: 5
  });
  const [routes, setRoutes] = useState(existingSubmission?.routes || []);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(existingSubmission?.selectedRouteIndex ?? null);
  const [notes, setNotes] = useState(existingSubmission?.notes || '');
  const [submissionName, setSubmissionName] = useState(existingSubmission?.name || '');

  const selectedRoute = selectedRouteIndex !== null ? routes[selectedRouteIndex] : null;

  const handleOriginSelect = (code) => {
    setOrigin(code);
    setRoutes([]);
    setSelectedRouteIndex(null);
  };

  const handleDestinationSelect = (code) => {
    setDestination(code);
    setRoutes([]);
    setSelectedRouteIndex(null);
  };

  const handleFindRoutes = () => {
    if (!origin || !destination) {
      alert('Please select both origin and destination terminals');
      return;
    }

    const foundRoutes = findRoutes(origin, destination, preferences);
    setRoutes(foundRoutes);
    setSelectedRouteIndex(foundRoutes.length > 0 ? 0 : null);
  };

  const handleSaveDraft = () => {
    const submission = {
      id: submissionId || createSubmissionId(),
      name: submissionName || `${origin} → ${destination}`,
      origin,
      destination,
      preferences,
      routes,
      selectedRouteIndex,
      selectedRoute: selectedRoute,
      notes,
      status: WORKFLOW_STATUS.DRAFT,
      createdDate: existingSubmission?.createdDate || new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: existingSubmission?.createdBy || currentUser,
      updatedBy: currentUser
    };

    if (saveSubmission(submission)) {
      alert('Draft saved successfully!');
      if (onSave) onSave(submission);
    } else {
      alert('Error saving draft');
    }
  };

  const handleSubmit = () => {
    if (!origin || !destination) {
      alert('Please select both origin and destination terminals');
      return;
    }

    if (routes.length === 0) {
      alert('Please find routes before submitting');
      return;
    }

    if (selectedRouteIndex === null) {
      alert('Please select a route before submitting');
      return;
    }

    const submission = {
      id: submissionId || createSubmissionId(),
      name: submissionName || `${origin} → ${destination}`,
      origin,
      destination,
      preferences,
      routes,
      selectedRouteIndex,
      selectedRoute: selectedRoute,
      notes,
      status: WORKFLOW_STATUS.SUBMITTED,
      createdDate: existingSubmission?.createdDate || new Date().toISOString(),
      submittedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: existingSubmission?.createdBy || currentUser,
      submittedBy: currentUser,
      updatedBy: currentUser
    };

    if (saveSubmission(submission)) {
      alert('Submission submitted successfully!');
      if (onSave) onSave(submission);
    } else {
      alert('Error submitting');
    }
  };

  return (
    <div>
      <div className="sigma-header" style={{ padding: '24px 32px', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: 'white', fontSize: '2rem', fontWeight: 700 }}>
            <span className="sigma-logo">Σ·IQ</span> {existingSubmission ? 'Edit Submission' : 'New Route Submission'}
          </h1>
          <p className="subtitle" style={{ marginTop: '8px', color: 'rgba(255,255,255,0.9)' }}>
            {existingSubmission ? 'Update your route submission' : 'Create a new freight rail route submission'}
          </p>
        </div>
      </div>
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0F172A' }}>Submission Details</h2>
        <button
          onClick={onCancel}
          className="sigma-btn-secondary"
          style={{
            padding: '10px 20px',
            fontSize: '16px'
          }}
        >
          ← Back to List
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Submission Name (optional):
        </label>
        <input
          type="text"
          value={submissionName}
          onChange={(e) => setSubmissionName(e.target.value)}
          placeholder="e.g., Chicago to Los Angeles Route"
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label htmlFor="origin-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Origin Terminal:
          </label>
          <select
            id="origin-select"
            value={origin}
            onChange={(e) => handleOriginSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          >
            <option value="">Select origin...</option>
            {Object.entries(stations).map(([code, station]) => (
              <option key={code} value={code}>
                {station.name} ({code}) - {station.state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="destination-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Destination Terminal:
          </label>
          <select
            id="destination-select"
            value={destination}
            onChange={(e) => handleDestinationSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          >
            <option value="">Select destination...</option>
            {Object.entries(stations)
              .filter(([code]) => code !== origin)
              .map(([code, station]) => (
                <option key={code} value={code}>
                  {station.name} ({code}) - {station.state}
                </option>
              ))}
          </select>
        </div>
      </div>

      <RouteConfig preferences={preferences} onPreferencesChange={setPreferences} />

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={handleFindRoutes}
          disabled={!origin || !destination}
          className="sigma-btn-primary"
          style={{
            padding: '12px 30px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          Find Routes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="map-panel">
          <ErrorBoundary>
            <MapComponent
              stations={stations}
              origin={origin}
              destination={destination}
              onOriginSelect={handleOriginSelect}
              onDestinationSelect={handleDestinationSelect}
              selectedRoute={selectedRoute}
            />
          </ErrorBoundary>
        </div>

        <div>
          <RouteResults
            routes={routes}
            onRouteSelect={setSelectedRouteIndex}
            selectedRouteIndex={selectedRouteIndex}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Notes (optional):
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or comments about this route submission..."
          rows={4}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '2px solid #eee' }}>
        <button
          onClick={handleSaveDraft}
          className="sigma-btn-secondary"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Save as Draft
        </button>
        <button
          onClick={handleSubmit}
          disabled={!origin || !destination || routes.length === 0 || selectedRouteIndex === null}
          style={{
            padding: '12px 24px',
            backgroundColor: (!origin || !destination || routes.length === 0 || selectedRouteIndex === null) ? '#E2E8F0' : '#10B981',
            color: (!origin || !destination || routes.length === 0 || selectedRouteIndex === null) ? '#64748B' : 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!origin || !destination || routes.length === 0 || selectedRouteIndex === null) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
        >
          Submit for Approval
        </button>
      </div>
      </div>
    </div>
  );
}

export default SubmissionForm;

