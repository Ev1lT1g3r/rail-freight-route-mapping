// Search and filtering utilities

import { stations } from '../data/railNetwork';

/**
 * Performs full-text search across all submission fields
 */
export function fullTextSearch(submissions, query) {
  if (!query || query.trim() === '') {
    return submissions;
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return submissions.filter(submission => {
    const searchableText = [
      submission.id,
      submission.name,
      submission.origin,
      submission.destination,
      submission.status,
      submission.createdBy,
      submission.submittedBy,
      submission.approvedBy,
      submission.rejectedBy,
      submission.rejectionReason,
      submission.approvalComment,
      submission.notes,
      submission.tags?.join(' '),
      submission.freight?.description,
      submission.selectedRoute?.operators?.join(' '),
      submission.selectedRoute?.states?.join(' '),
      submission.selectedRoute?.transferPoints?.map(tp => tp.station).join(' '),
      stations[submission.origin]?.name,
      stations[submission.destination]?.name
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // All search terms must be found
    return searchTerms.every(term => searchableText.includes(term));
  });
}

/**
 * Applies multi-criteria filters to submissions
 */
export function applyFilters(submissions, filters) {
  if (!filters) {
    return submissions;
  }
  
  // If all filter values are empty/default, return all submissions
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key];
    if (key === 'status') {
      return value && value !== 'all' && value !== undefined && value !== null;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value && value !== '' && value !== undefined && value !== null;
  });
  
  if (!hasActiveFilters) {
    return submissions;
  }

  return submissions.filter(submission => {
    // Status filter - only apply if explicitly set and not 'all'
    if (filters.status && filters.status !== 'all' && filters.status !== undefined && filters.status !== null) {
      if (submission.status !== filters.status) return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      const subDate = new Date(submission.submittedDate || submission.createdDate);
      if (subDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      const subDate = new Date(submission.submittedDate || submission.createdDate);
      if (subDate > toDate) return false;
    }

    // Operator filter
    if (filters.operators && filters.operators.length > 0) {
      const subOperators = submission.selectedRoute?.operators || [];
      const hasOperator = filters.operators.some(op => subOperators.includes(op));
      if (!hasOperator) return false;
    }

    // State filter
    if (filters.states && filters.states.length > 0) {
      const subStates = submission.selectedRoute?.states || [];
      const hasState = filters.states.some(state => subStates.includes(state));
      if (!hasState) return false;
    }

    // Origin filter
    if (filters.origin) {
      if (submission.origin !== filters.origin) return false;
    }

    // Destination filter
    if (filters.destination) {
      if (submission.destination !== filters.destination) return false;
    }

    // Created by filter
    if (filters.createdBy) {
      if (submission.createdBy?.toLowerCase() !== filters.createdBy.toLowerCase()) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const subTags = submission.tags || [];
      const hasTag = filters.tags.some(tag => subTags.includes(tag));
      if (!hasTag) return false;
    }

    // Distance range filter
    if (filters.minDistance !== undefined && filters.minDistance !== null) {
      const distance = submission.selectedRoute?.totalDistance || 0;
      if (distance < filters.minDistance) return false;
    }
    if (filters.maxDistance !== undefined && filters.maxDistance !== null) {
      const distance = submission.selectedRoute?.totalDistance || 0;
      if (distance > filters.maxDistance) return false;
    }

    return true;
  });
}

/**
 * Gets all unique values for filter dropdowns
 */
export function getFilterOptions(submissions) {
  const operators = new Set();
  const states = new Set();
  const origins = new Set();
  const destinations = new Set();
  const createdBys = new Set();
  const tags = new Set();

  submissions.forEach(sub => {
    sub.selectedRoute?.operators?.forEach(op => operators.add(op));
    sub.selectedRoute?.states?.forEach(state => states.add(state));
    origins.add(sub.origin);
    destinations.add(sub.destination);
    if (sub.createdBy) createdBys.add(sub.createdBy);
    sub.tags?.forEach(tag => tags.add(tag));
  });

  return {
    operators: Array.from(operators).sort(),
    states: Array.from(states).sort(),
    origins: Array.from(origins).sort(),
    destinations: Array.from(destinations).sort(),
    createdBys: Array.from(createdBys).sort(),
    tags: Array.from(tags).sort()
  };
}

