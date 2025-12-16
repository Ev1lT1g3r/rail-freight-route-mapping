import './ProgressIndicator.css';

function ProgressIndicator({ steps, currentStep, onStepClick }) {
  const getStepStatus = (stepIndex) => {
    const stepKeys = Object.keys(steps);
    const currentIndex = stepKeys.indexOf(currentStep);
    const stepIndexInArray = stepKeys.indexOf(stepKeys[stepIndex]);
    
    if (stepIndexInArray < currentIndex) return 'completed';
    if (stepIndexInArray === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="progress-indicator">
      {Object.entries(steps).map(([key, label], index) => {
        const status = getStepStatus(index);
        const stepNumber = index + 1;
        
        return (
          <div key={key} className="progress-step-container">
            <div 
              className={`progress-step ${status}`}
              onClick={() => onStepClick && onStepClick(key)}
              style={{ cursor: onStepClick ? 'pointer' : 'default' }}
            >
              <div className="progress-step-circle">
                {status === 'completed' ? (
                  <span className="progress-checkmark">✓</span>
                ) : (
                  <span className="progress-number">{stepNumber}</span>
                )}
              </div>
              <div className="progress-step-label">{label}</div>
            </div>
            {index < Object.keys(steps).length - 1 && (
              <div className={`progress-connector ${status === 'completed' ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressIndicator;

