import { useState, useEffect } from 'react';
import { getAllSubmissions, WORKFLOW_STATUS, deleteSubmission, saveSubmission, duplicateSubmission, archiveSubmission, unarchiveSubmission, getActiveSubmissions, getArchivedSubmissions } from '../utils/submissionStorage';
import { exportSubmissionsToCSV } from '../utils/exportUtils';
import { fullTextSearch, applyFilters, getFilterOptions } from '../utils/searchUtils';
import { getSavedSearches, saveSearch, deleteSavedSearch, getSearchHistory, addToSearchHistory, clearSearchHistory } from '../utils/searchStorage';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import HelpTooltip from './HelpTooltip';
import { useToast } from '../contexts/ToastContext';

function SubmissionsList({ onViewSubmission, onCreateNew, onEditSubmission, onBackToHome, currentUser = 'Current User' }) {
  const [submissions, setSubmissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedSubmissions, setSelectedSubmissions] = useState(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  // Advanced search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    operators: [],
    states: [],
    origin: '',
    destination: '',
    createdBy: '',
    tags: [],
    minDistance: '',
    maxDistance: ''
  });
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadSubmissions();
    loadSavedSearches();
    loadSearchHistory();
    // Refresh every 5 seconds to catch updates
    const interval = setInterval(loadSubmissions, 5000);
    return () => clearInterval(interval);
  }, [showArchived]);

  const loadSavedSearches = () => {
    setSavedSearches(getSavedSearches());
  };

  const loadSearchHistory = () => {
    setSearchHistory(getSearchHistory());
  };

  const loadSubmissions = () => {
    const all = showArchived ? getArchivedSubmissions() : getActiveSubmissions();
    setSubmissions(all);
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Apply search and filters
  const searchFiltered = searchQuery 
    ? fullTextSearch(submissions, searchQuery)
    : submissions;
  
  const advancedFiltered = applyFilters(searchFiltered, {
    ...filters,
    status: filterStatus !== 'all' ? filterStatus : filters.status
  });

  const filteredSubmissions = advancedFiltered;

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.submittedDate || a.createdDate || 0);
      const dateB = new Date(b.submittedDate || b.createdDate || 0);
      return dateB - dateA;
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    if (sortBy === 'origin') {
      return (a.origin || '').localeCompare(b.origin || '');
    }
    return 0;
  });

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(id);
      loadSubmissions();
      setSelectedSubmissions(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedSubmissions.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedSubmissions.size} submission(s)?`)) {
      selectedSubmissions.forEach(id => deleteSubmission(id));
      loadSubmissions();
      setSelectedSubmissions(new Set());
      setIsBulkMode(false);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedSubmissions.size === 0) return;
    if (window.confirm(`Change status of ${selectedSubmissions.size} submission(s) to "${newStatus}"?`)) {
      selectedSubmissions.forEach(id => {
        const submission = submissions.find(s => s.id === id);
        if (submission) {
          const updated = {
            ...submission,
            status: newStatus,
            updatedDate: new Date().toISOString()
          };
          if (newStatus === WORKFLOW_STATUS.SUBMITTED && !submission.submittedDate) {
            updated.submittedDate = new Date().toISOString();
            updated.submittedBy = submission.createdBy || 'System';
          }
          saveSubmission(updated);
        }
      });
      loadSubmissions();
      setSelectedSubmissions(new Set());
      setIsBulkMode(false);
    }
  };

  const handleSelectSubmission = (id, e) => {
    e?.stopPropagation();
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.size === sortedSubmissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(sortedSubmissions.map(s => s.id)));
    }
  };

  const handleDuplicate = (id, e) => {
    e?.stopPropagation();
    const duplicated = duplicateSubmission(id, currentUser);
    if (duplicated) {
      success('Submission duplicated successfully! Opening in edit mode...');
      loadSubmissions();
      // Navigate to edit the duplicated submission
      setTimeout(() => {
        if (onEditSubmission) {
          onEditSubmission(duplicated.id);
        }
      }, 500);
    }
  };

  return (
    <div>
      <div className="sigma-header" style={{ padding: '24px 32px', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2rem', fontWeight: 700 }}>
              <span className="sigma-logo">Σ·IQ</span> Rail Freight Route Submissions
            </h1>
            <p className="subtitle" style={{ marginTop: '8px', color: 'rgba(255,255,255,0.9)' }}>
              Manage and track freight rail route submissions
            </p>
          </div>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ← Back to Home
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ margin: 0, color: '#0F172A' }}>All Submissions</h2>
            <HelpTooltip content="View and manage all your freight rail route submissions. Use filters and sorting to find specific submissions quickly.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '18px' }}>ℹ️</span>
            </HelpTooltip>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {sortedSubmissions.length > 0 && (
              <button
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  setSelectedSubmissions(new Set());
                }}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: isBulkMode ? '#10B981' : '#64748B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isBulkMode ? '✓ Bulk Mode' : 'Bulk Actions'}
              </button>
            )}
            {sortedSubmissions.length > 0 && (
              <button
                onClick={() => {
                  const submissionsToExport = filterStatus === 'all' 
                    ? sortedSubmissions 
                    : sortedSubmissions.filter(s => s.status === filterStatus);
                  if (submissionsToExport.length === 0) {
                    showError('No submissions to export');
                    return;
                  }
                  exportSubmissionsToCSV(submissionsToExport);
                  success(`Exported ${submissionsToExport.length} submission(s) to CSV`);
                }}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📥 Export {filterStatus === 'all' ? 'All' : 'Filtered'} ({sortedSubmissions.length})
              </button>
            )}
            <button
              onClick={onCreateNew}
              className="sigma-btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              + New Submission
            </button>
          </div>
        </div>

        {isBulkMode && sortedSubmissions.length > 0 && (
          <div style={{
            padding: '15px',
            backgroundColor: '#EFF6FF',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '2px solid #3B82F6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '600', color: '#1E40AF' }}>
                {selectedSubmissions.size} of {sortedSubmissions.length} selected
              </span>
              <button
                onClick={handleSelectAll}
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#3B82F6',
                  border: '1px solid #3B82F6',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {selectedSubmissions.size === sortedSubmissions.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!showArchived && (
                <>
                  <button
                    onClick={() => handleBulkStatusChange(WORKFLOW_STATUS.SUBMITTED)}
                    disabled={selectedSubmissions.size === 0}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: selectedSubmissions.size > 0 ? '#3B82F6' : '#CBD5E1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: selectedSubmissions.size > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: '600'
                    }}
                  >
                    Mark as Submitted
                  </button>
                  <button
                    onClick={handleBulkArchive}
                    disabled={selectedSubmissions.size === 0}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: selectedSubmissions.size > 0 ? '#8B5CF6' : '#C4B5FD',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: selectedSubmissions.size > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: '600'
                    }}
                  >
                    Archive Selected
                  </button>
                </>
              )}
              {showArchived && (
                <button
                  onClick={handleBulkUnarchive}
                  disabled={selectedSubmissions.size === 0}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: selectedSubmissions.size > 0 ? '#10B981' : '#A7F3D0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: selectedSubmissions.size > 0 ? 'pointer' : 'not-allowed',
                    fontWeight: '600'
                  }}
                >
                  Unarchive Selected
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                disabled={selectedSubmissions.size === 0}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: selectedSubmissions.size > 0 ? '#EF4444' : '#FCA5A5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: selectedSubmissions.size > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: '600'
                }}
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

      {/* Search Bar */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#F8F9FA',
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Search submissions (full-text search across all fields)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                outline: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  addToSearchHistory({ query: searchQuery, filters });
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              setShowAdvancedFilters(!showAdvancedFilters);
            }}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: showAdvancedFilters ? '#3B82F6' : '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔍 {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
          <button
            onClick={() => {
              setShowSavedSearches(!showSavedSearches);
            }}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⭐ Saved Searches ({savedSearches.length})
          </button>
          {(searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v && v !== 'all' && v !== '')) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  status: 'all',
                  dateFrom: '',
                  dateTo: '',
                  operators: [],
                  states: [],
                  origin: '',
                  destination: '',
                  createdBy: '',
                  tags: [],
                  minDistance: '',
                  maxDistance: ''
                });
                setFilterStatus('all');
              }}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ✕ Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Operators</label>
                <select
                  multiple
                  value={filters.operators}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({ ...filters, operators: selected });
                  }}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                >
                  {getFilterOptions(submissions).operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                <small style={{ color: '#6B7280', fontSize: '11px' }}>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>States</label>
                <select
                  multiple
                  value={filters.states}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({ ...filters, states: selected });
                  }}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                >
                  {getFilterOptions(submissions).states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <small style={{ color: '#6B7280', fontSize: '11px' }}>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Origin Yard</label>
                <select
                  value={filters.origin}
                  onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">All Origins</option>
                  {getFilterOptions(submissions).origins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Destination Yard</label>
                <select
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">All Destinations</option>
                  {getFilterOptions(submissions).destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Created By</label>
                <select
                  value={filters.createdBy}
                  onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">All Users</option>
                  {getFilterOptions(submissions).createdBys.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Tags</label>
                <select
                  multiple
                  value={filters.tags}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({ ...filters, tags: selected });
                  }}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                >
                  {getFilterOptions(submissions).tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <small style={{ color: '#6B7280', fontSize: '11px' }}>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Min Distance (miles)</label>
                <input
                  type="number"
                  value={filters.minDistance}
                  onChange={(e) => setFilters({ ...filters, minDistance: e.target.value || '' })}
                  placeholder="0"
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '12px' }}>Max Distance (miles)</label>
                <input
                  type="number"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value || '' })}
                  placeholder="∞"
                  style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const name = window.prompt('Enter a name for this search:');
                  if (name) {
                    const searchId = saveSearch({ name, query: searchQuery, filters });
                    if (searchId) {
                      success('Search saved!');
                      loadSavedSearches();
                    }
                  }
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                💾 Save Search
              </button>
            </div>
          </div>
        )}

        {/* Saved Searches Panel */}
        {showSavedSearches && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Saved Searches</h3>
              <button
                onClick={() => {
                  if (window.confirm('Clear all search history?')) {
                    clearSearchHistory();
                    loadSearchHistory();
                    success('Search history cleared');
                  }
                }}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear History
              </button>
            </div>
            {savedSearches.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: '14px' }}>No saved searches yet. Save a search to reuse it later.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedSearches.map(saved => (
                  <div
                    key={saved.id}
                    style={{
                      padding: '10px',
                      backgroundColor: '#F8F9FA',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '14px' }}>{saved.name}</strong>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                        {saved.config.query && `Query: "${saved.config.query}"`}
                        {saved.config.query && saved.config.filters && ' | '}
                        {Object.keys(saved.config.filters || {}).filter(k => {
                          const v = saved.config.filters[k];
                          return Array.isArray(v) ? v.length > 0 : v && v !== 'all' && v !== '';
                        }).length > 0 && 'Filters applied'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => {
                          setSearchQuery(saved.config.query || '');
                          setFilters(saved.config.filters || filters);
                          setShowSavedSearches(false);
                          success('Search loaded!');
                        }}
                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this saved search?')) {
                            deleteSavedSearch(saved.id);
                            loadSavedSearches();
                            success('Search deleted');
                          }
                        }}
                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && !showSavedSearches && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#6B7280' }}>
            Recent searches: {searchHistory.slice(0, 5).map((h, idx) => (
              <span key={h.id}>
                <button
                  onClick={() => {
                    setSearchQuery(h.config.query || '');
                    setFilters(h.config.filters || filters);
                    addToSearchHistory({ query: h.config.query, filters: h.config.filters });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3B82F6',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '0 4px'
                  }}
                >
                  {h.config.query || 'Filters only'}
                </button>
                {idx < Math.min(4, searchHistory.length - 1) && ' • '}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Filter by Status:
            <HelpTooltip content="Filter submissions by their current workflow status. Use 'All' to see every submission regardless of status.">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All</option>
            {Object.values(WORKFLOW_STATUS)
              .filter(status => showArchived ? status === WORKFLOW_STATUS.ARCHIVED : status !== WORKFLOW_STATUS.ARCHIVED)
              .map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
          </select>
          <button
            onClick={() => {
              setShowArchived(!showArchived);
              setFilterStatus('all');
            }}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: showArchived ? '#10B981' : '#64748B',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {showArchived ? '📦 Viewing Archived' : '📋 Viewing Active'}
          </button>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Sort by:
            <HelpTooltip content="Sort submissions by date (newest first), status (alphabetical), or shipping origin yard (alphabetical).">
              <span style={{ color: '#6B7280', cursor: 'help', fontSize: '14px' }}>ℹ️</span>
            </HelpTooltip>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="date">Date</option>
            <option value="status">Status</option>
            <option value="origin">Shipping Origin Yard</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', color: '#666' }}>
          Total: {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {sortedSubmissions.length === 0 ? (
        <EmptyState
          icon="📋"
          title={filterStatus === 'all' ? 'No Submissions Yet' : `No ${filterStatus} Submissions`}
          message={filterStatus === 'all' 
            ? 'Get started by creating your first freight rail route submission. Plan routes, specify freight details, and track approvals all in one place.'
            : `No submissions found with status "${filterStatus}". Try selecting a different status filter or create a new submission.`
          }
          actionLabel={filterStatus === 'all' ? '+ Create Your First Submission' : null}
          onAction={filterStatus === 'all' ? onCreateNew : null}
          secondaryActionLabel={filterStatus !== 'all' ? 'Clear Filter' : null}
          onSecondaryAction={filterStatus !== 'all' ? () => setFilterStatus('all') : null}
        />
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {sortedSubmissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => !isBulkMode && onViewSubmission(submission.id)}
              style={{
                padding: '20px',
                border: isBulkMode && selectedSubmissions.has(submission.id) 
                  ? '3px solid #3B82F6' 
                  : '2px solid #E2E8F0',
                borderRadius: '8px',
                cursor: isBulkMode ? 'default' : 'pointer',
                backgroundColor: isBulkMode && selectedSubmissions.has(submission.id)
                  ? '#EFF6FF'
                  : '#FFFFFF',
                transition: 'all 0.2s',
                boxShadow: isBulkMode && selectedSubmissions.has(submission.id)
                  ? '0 4px 12px rgba(59, 130, 246, 0.2)'
                  : '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isBulkMode) {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isBulkMode || !selectedSubmissions.has(submission.id)) {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }
              }}
            >
              {isBulkMode && (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="checkbox"
                    checked={selectedSubmissions.has(submission.id)}
                    onChange={(e) => handleSelectSubmission(submission.id, e)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#3B82F6'
                    }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                      {submission.origin} → {submission.destination}
                    </h3>
                    <StatusBadge status={submission.status} size="small" />
                  </div>
                  
                  {submission.selectedRoute && (
                    <div style={{ color: '#666', marginBottom: '10px' }}>
                      <strong>Distance:</strong> {submission.selectedRoute.totalDistance} miles
                      {' | '}
                      <strong>Operators:</strong> {submission.selectedRoute.operators.join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {(submission.status === WORKFLOW_STATUS.DRAFT || submission.status === WORKFLOW_STATUS.REJECTED) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditSubmission) {
                          onEditSubmission(submission.id);
                        }
                      }}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {!showArchived && submission.status !== WORKFLOW_STATUS.ARCHIVED && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (archiveSubmission(submission.id, currentUser)) {
                          success('Submission archived');
                          loadSubmissions();
                        }
                      }}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#8B5CF6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Archive
                    </button>
                  )}
                  {showArchived && submission.status === WORKFLOW_STATUS.ARCHIVED && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (unarchiveSubmission(submission.id, currentUser)) {
                          success('Submission unarchived');
                          loadSubmissions();
                        }
                      }}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Unarchive
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(submission.id, e)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                fontSize: '14px',
                color: '#666',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <div>
                  <strong>Submission ID:</strong> {submission.id}
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(submission.createdDate)}
                </div>
                {submission.submittedDate && (
                  <div>
                    <strong>Submitted:</strong> {formatDate(submission.submittedDate)}
                  </div>
                )}
                <div>
                  <strong>Submitted By:</strong> {submission.submittedBy || 'N/A'}
                </div>
                {submission.approvedDate && (
                  <>
                    <div>
                      <strong>Approved:</strong> {formatDate(submission.approvedDate)}
                    </div>
                    <div>
                      <strong>Approved By:</strong> {submission.approvedBy || 'N/A'}
                    </div>
                  </>
                )}
                {submission.rejectedDate && (
                  <>
                    <div>
                      <strong>Rejected:</strong> {formatDate(submission.rejectedDate)}
                    </div>
                    <div>
                      <strong>Rejected By:</strong> {submission.rejectedBy || 'N/A'}
                    </div>
                    {submission.rejectionReason && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Reason:</strong> {submission.rejectionReason}
                      </div>
                    )}
                  </>
                )}
                {submission.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Notes:</strong> {submission.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default SubmissionsList;

