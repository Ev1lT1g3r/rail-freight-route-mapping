import { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import SubmissionsList from './components/SubmissionsList';
import SubmissionForm from './components/SubmissionForm';
import SubmissionDetail from './components/SubmissionDetail';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { WORKFLOW_STATUS } from './utils/submissionStorage';

// View states
const VIEWS = {
  HOME: 'home',
  LIST: 'list',
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view'
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // In a real app, this would come from auth
  const [isApprover, setIsApprover] = useState(false); // In a real app, this would come from user permissions
  const { toasts, removeToast } = useToast();

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
    // Submission saved, return to list
    setCurrentView(VIEWS.LIST);
    setSelectedSubmissionId(null);
  };

  const handleNavigateToWorkflow = () => {
    setCurrentView(VIEWS.LIST);
  };

  const handleLogin = (email) => {
    setCurrentUser(email || 'User');
    setIsApprover(true); // For demo purposes, logged-in users are approvers
    setCurrentView(VIEWS.LIST);
  };

  return (
    <div className="App">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {currentView === VIEWS.HOME && (
        <HomePage
          onNavigateToWorkflow={handleNavigateToWorkflow}
          onLogin={handleLogin}
        />
      )}

      {currentView === VIEWS.LIST && (
        <SubmissionsList
          onViewSubmission={handleViewSubmission}
          onCreateNew={handleCreateNew}
          onEditSubmission={handleEditSubmission}
          onBackToHome={() => setCurrentView(VIEWS.HOME)}
        />
      )}

      {(currentView === VIEWS.CREATE || currentView === VIEWS.EDIT) && (
        <SubmissionForm
          submissionId={currentView === VIEWS.EDIT ? selectedSubmissionId : null}
          onSave={handleSaveSubmission}
          onCancel={handleBackToList}
          currentUser={currentUser || 'Guest User'}
        />
      )}

      {currentView === VIEWS.VIEW && (
        <SubmissionDetail
          submissionId={selectedSubmissionId}
          onBack={handleBackToList}
          onEdit={() => handleEditSubmission(selectedSubmissionId)}
          currentUser={currentUser || 'Guest User'}
          isApprover={isApprover}
        />
      )}
    </div>
  );
}

export default App;
