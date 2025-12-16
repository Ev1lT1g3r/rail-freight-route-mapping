import { useState, useMemo, useContext, createContext } from 'react';
import MapComponent from './MapComponent';
import RouteConfig from './RouteConfig';
import RouteResults from './RouteResults';
import FreightSpecification from './FreightSpecification';
import FreightPlacementVisualization from './FreightPlacementVisualization';
import ErrorBoundary from './ErrorBoundary';
import ProgressIndicator from './ProgressIndicator';
import TerminalSearch from './TerminalSearch';
import { stations } from '../data/railNetwork';
import { findRoutes } from '../utils/routeFinder';
import { saveSubmission, createSubmissionId, WORKFLOW_STATUS, getSubmissionById } from '../utils/submissionStorage';
import { useToast } from '../hooks/useToast';

// Toast context for child components
const ToastContext = createContext(null);

function SubmissionForm({ submissionId, onSave, onCancel, currentUser = 'Current User' }) {
  const existingSubmission = submissionId ? getSubmissionById(submissionId) : null;
  const { success, error: showError, warning, info } = useToast();
  
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
  const [freight, setFreight] = useState(existingSubmission?.freight || null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Determine initial step based on existing submission state
  const getInitialStep = () => {
    if (existingSubmission) {
      if (existingSubmission.selectedRouteIndex !== null && existingSubmission.selectedRouteIndex !== undefined) {
        return existingSubmission.freight ? 'review' : 'freight';
      }
    }
    return 'route';
  };
  const [currentStep, setCurrentStep] = useState(getInitialStep());

  const selectedRoute = selectedRouteIndex !== null ? routes[selectedRouteIndex] : null;

  // Step definitions for progress indicator
  const steps = {
    route: 'Route Selection',
    freight: 'Freight Specification',
    review: 'Review & Submit'
  };

  // Validation functions
  const validateRouteStep = () => {
    const errors = {};
    if (!origin) errors.origin = 'Please select an origin terminal';
    if (!destination) errors.destination = 'Please select a destination terminal';
    if (origin === destination) errors.destination = 'Origin and destination must be different';
    if (routes.length === 0 && origin && destination) errors.routes = 'Please find routes first';
    if (selectedRouteIndex === null && routes.length > 0) errors.routeSelection = 'Please select a route';
    return errors;
  };

  const validateFreightStep = () => {
    const errors = {};
    if (!freight) {
      errors.freight = 'Please specify freight details';
      return errors;
    }
    if (!freight.length || freight.length <= 0) errors.length = 'Freight length must be greater than 0';
    if (!freight.width || freight.width <= 0) errors.width = 'Freight width must be greater than 0';
    if (!freight.height || freight.height <= 0) errors.height = 'Freight height must be greater than 0';
    if (!freight.weight || freight.weight <= 0) errors.weight = 'Freight weight must be greater than 0';
    return errors;
  };

  const validateReviewStep = () => {
    const errors = {};
    if (!submissionName.trim()) {
      errors.submissionName = 'Submission name is required';
    }
    const routeErrors = validateRouteStep();
    const freightErrors = validateFreightStep();
    return { ...errors, ...routeErrors, ...freightErrors };
  };

  const handleOriginSelect = (code) => {
    setOrigin(code);
    setRoutes([]);
    setSelectedRouteIndex(null);
    setValidationErrors(prev => ({ ...prev, origin: null }));
    if (code === destination) {
      setValidationErrors(prev => ({ ...prev, destination: 'Origin and destination must be different' }));
    }
  };

  const handleDestinationSelect = (code) => {
    setDestination(code);
    setRoutes([]);
    setSelectedRouteIndex(null);
    setValidationErrors(prev => ({ ...prev, destination: null }));
    if (code === origin) {
      setValidationErrors(prev => ({ ...prev, destination: 'Origin and destination must be different' }));
    }
  };

  const handleFindRoutes = () => {
    const errors = validateRouteStep();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showError('Please fix the errors before finding routes');
      return;
    }

    setIsLoading(true);
    setValidationErrors({});
    
    // Simulate async operation
    setTimeout(() => {
      try {
        const foundRoutes = findRoutes(origin, destination, preferences);
        setRoutes(foundRoutes);
        if (foundRoutes.length > 0) {
          setSelectedRouteIndex(0);
          success(`Found ${foundRoutes.length} route${foundRoutes.length > 1 ? 's' : ''}`);
        } else {
          warning('No routes found between these terminals');
        }
      } catch (err) {
        showError('Error finding routes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
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
      freight,
      notes,
      status: WORKFLOW_STATUS.DRAFT,
      createdDate: existingSubmission?.createdDate || new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: existingSubmission?.createdBy || currentUser,
      updatedBy: currentUser
    };

    if (saveSubmission(submission)) {
      success('Draft saved successfully! You can continue editing or come back later.');
      if (onSave) onSave(submission, false);
    } else {
      showError('Error saving draft');
    }
  };

  const handleSubmit = () => {
    const errors = validateReviewStep();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showError('Please fix all errors before submitting');
      return;
    }

    const submission = {
      id: submissionId || createSubmissionId(),
      name: submissionName,
      origin,
      destination,
      preferences,
      routes,
      selectedRouteIndex,
      selectedRoute: selectedRoute,
      freight,
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
      success('Submission submitted successfully!');
      if (onSave) onSave(submission);
    } else {
      showError('Error submitting');
    }
  };

  const handleStepChange = (step) => {
    if (step === 'freight' && selectedRouteIndex === null) {
      showError('Please select a route first');
      return;
    }
    if (step === 'review') {
      const errors = validateFreightStep();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        showError('Please complete freight specification first');
        return;
      }
    }
    setCurrentStep(step);
    setValidationErrors({});
  };

  return (
    <ToastContext.Provider value={{ success, error: showError, warning, info }}>
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

          {/* Progress Indicator */}
          <ProgressIndicator 
            steps={steps} 
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          {/* Submission Name */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Submission Name {currentStep === 'review' && <span style={{ color: '#EF4444' }}>*</span>}:
            </label>
            <input
              type="text"
              value={submissionName}
              onChange={(e) => {
                setSubmissionName(e.target.value);
                setValidationErrors(prev => ({ ...prev, submissionName: null }));
              }}
              placeholder="e.g., Chicago to Los Angeles Route"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '8px',
                borderRadius: '4px',
                border: validationErrors.submissionName ? '2px solid #EF4444' : '1px solid #ddd',
                fontSize: '14px'
              }}
            />
            {validationErrors.submissionName && (
              <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                {validationErrors.submissionName}
              </div>
            )}
          </div>

          {/* Route Selection Step */}
          {currentStep === 'route' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <TerminalSearch
                    id="origin-select"
                    label="Origin Terminal"
                    value={origin}
                    onChange={handleOriginSelect}
                    placeholder="Search for origin terminal..."
                  />
                  {validationErrors.origin && (
                    <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.origin}
                    </div>
                  )}
                </div>

                <div>
                  <TerminalSearch
                    id="destination-select"
                    label="Destination Terminal"
                    value={destination}
                    onChange={handleDestinationSelect}
                    placeholder="Search for destination terminal..."
                  />
                  {validationErrors.destination && (
                    <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.destination}
                    </div>
                  )}
                </div>
              </div>

              <RouteConfig preferences={preferences} onPreferencesChange={setPreferences} />

              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button
                  onClick={handleFindRoutes}
                  disabled={!origin || !destination || isLoading}
                  className="sigma-btn-primary"
                  style={{
                    padding: '12px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    opacity: (!origin || !destination || isLoading) ? 0.6 : 1,
                    cursor: (!origin || !destination || isLoading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Finding Routes...' : 'Find Routes'}
                </button>
              </div>

              {validationErrors.routes && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#FEF2F2', 
                  border: '1px solid #FECACA', 
                  borderRadius: '8px',
                  color: '#DC2626',
                  marginBottom: '20px'
                }}>
                  {validationErrors.routes}
                </div>
              )}

              {routes.length > 0 && (
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
                      onRouteSelect={(idx) => {
                        setSelectedRouteIndex(idx);
                        setValidationErrors(prev => ({ ...prev, routeSelection: null }));
                      }}
                      selectedRouteIndex={selectedRouteIndex}
                    />
                    {validationErrors.routeSelection && (
                      <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#FEF2F2', 
                        border: '1px solid #FECACA', 
                        borderRadius: '8px',
                        color: '#DC2626',
                        marginTop: '10px'
                      }}>
                        {validationErrors.routeSelection}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Freight Specification Step */}
          {currentStep === 'freight' && selectedRoute && (
            <div>
              <FreightSpecification 
                freight={freight}
                onFreightChange={(newFreight) => {
                  setFreight(newFreight);
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    if (newFreight?.length > 0) delete newErrors.length;
                    if (newFreight?.width > 0) delete newErrors.width;
                    if (newFreight?.height > 0) delete newErrors.height;
                    if (newFreight?.weight > 0) delete newErrors.weight;
                    return newErrors;
                  });
                }}
                validationErrors={validationErrors}
              />
              
              {freight && freight.length > 0 && freight.width > 0 && freight.height > 0 && (
                <FreightPlacementVisualization
                  freight={freight}
                  operators={selectedRoute.operators || []}
                  selectedRoute={selectedRoute}
                  onFreightChange={setFreight}
                />
              )}
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div>
              <h3 style={{ color: '#0F172A' }}>Review Submission</h3>
              
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Route Summary</h4>
                <p><strong>Origin:</strong> {origin} - {stations[origin]?.name}</p>
                <p><strong>Destination:</strong> {destination} - {stations[destination]?.name}</p>
                {selectedRoute && (
                  <>
                    <p><strong>Distance:</strong> {selectedRoute.totalDistance} miles</p>
                    <p><strong>Operators:</strong> {selectedRoute.operators.join(', ')}</p>
                  </>
                )}
              </div>

              {freight && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h4>Freight Summary</h4>
                  <p><strong>Description:</strong> {freight.description || 'N/A'}</p>
                  <p><strong>Dimensions:</strong> {freight.length}ft × {freight.width}ft × {freight.height}ft</p>
                  <p><strong>Weight:</strong> {freight.weight.toLocaleString()} lbs</p>
                </div>
              )}

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
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between', paddingTop: '20px', borderTop: '2px solid #eee' }}>
            <div>
              {currentStep !== 'route' && (
                <button
                  onClick={() => {
                    if (currentStep === 'freight') setCurrentStep('route');
                    if (currentStep === 'review') setCurrentStep('freight');
                    setValidationErrors({});
                  }}
                  className="sigma-btn-secondary"
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ← Previous
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              {currentStep !== 'review' && (
                <button
                  onClick={() => {
                    if (currentStep === 'route' && selectedRouteIndex !== null) {
                      setCurrentStep('freight');
                      setValidationErrors({});
                    } else if (currentStep === 'freight') {
                      const errors = validateFreightStep();
                      if (Object.keys(errors).length === 0) {
                        setCurrentStep('review');
                        setValidationErrors({});
                      } else {
                        setValidationErrors(errors);
                        showError('Please complete freight specification');
                      }
                    }
                  }}
                  disabled={currentStep === 'route' && selectedRouteIndex === null}
                  className="sigma-btn-primary"
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: (currentStep === 'route' && selectedRouteIndex === null) ? 0.5 : 1,
                    cursor: (currentStep === 'route' && selectedRouteIndex === null) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next →
                </button>
              )}
              
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
              
              {currentStep === 'review' && (
                <button
                  onClick={handleSubmit}
                  disabled={!origin || !destination || routes.length === 0 || selectedRouteIndex === null || !freight}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: (!origin || !destination || routes.length === 0 || selectedRouteIndex === null || !freight) ? '#E2E8F0' : '#10B981',
                    color: (!origin || !destination || routes.length === 0 || selectedRouteIndex === null || !freight) ? '#64748B' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (!origin || !destination || routes.length === 0 || selectedRouteIndex === null || !freight) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Submit for Approval
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export default SubmissionForm;
