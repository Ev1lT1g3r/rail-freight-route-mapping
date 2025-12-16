import { useState } from 'react';
import './App.css';
import SubmissionsList from './components/SubmissionsList';
import SubmissionForm from './components/SubmissionForm';
import SubmissionDetail from './components/SubmissionDetail';

// View states
const VIEWS = {
  LIST: 'list',
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view'
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [currentUser] = useState('Current User'); // In a real app, this would come from auth
  const [isApprover] = useState(true); // In a real app, this would come from user permissions

  console.log('App rendering - Current view:', currentView);

  const handleCreateNew = () => {
    setSelectedSubmissionId(null);
    setCurrentView(VIEWS.CREATE);
  };

  const handleViewSubmission = (id) => {
    setSelectedSubmissionId(id);
    setCurrentView(VIEWS.VIEW);
  };

  const handleEditSubmission = (id) => {
    setSelectedSubmissionId(id);
    setCurrentView(VIEWS.EDIT);
  };

  const handleBackToList = () => {
    setCurrentView(VIEWS.LIST);
    setSelectedSubmissionId(null);
  };

  const handleSaveSubmission = (submission, shouldNavigateAway = true) => {
    // If it's a draft save and user wants to continue editing, don't navigate away
    if (!shouldNavigateAway && submission.status === WORKFLOW_STATUS.DRAFT) {
      // Stay on the form, just update the submission ID if it's new
      if (!selectedSubmissionId && submission.id) {
        setSelectedSubmissionId(submission.id);
      }
      return;
    }
    // Otherwise, return to list (for submitted items or explicit navigation)
    setCurrentView(VIEWS.LIST);
    setSelectedSubmissionId(null);
  };

  // Debug: Log current view
  console.log('App render - currentView:', currentView, 'VIEWS.LIST:', VIEWS.LIST);

  return (
    <div className="App">
      {currentView === VIEWS.LIST && (
        <SubmissionsList
          onViewSubmission={handleViewSubmission}
          onCreateNew={handleCreateNew}
          onEditSubmission={handleEditSubmission}
        />
      )}

      {(currentView === VIEWS.CREATE || currentView === VIEWS.EDIT) && (
        <SubmissionForm
          submissionId={currentView === VIEWS.EDIT ? selectedSubmissionId : null}
          onSave={handleSaveSubmission}
          onCancel={handleBackToList}
          currentUser={currentUser}
        />
      )}

      {currentView === VIEWS.VIEW && (
        <SubmissionDetail
          submissionId={selectedSubmissionId}
          onBack={handleBackToList}
          onEdit={() => handleEditSubmission(selectedSubmissionId)}
          currentUser={currentUser}
          isApprover={isApprover}
        />
      )}
    </div>
  );
}

export default App;
