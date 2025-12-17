import { useState, useMemo, useRef, useEffect } from 'react';
import { stations } from '../data/railNetwork';
import './TerminalSearch.css';

function TerminalSearch({ value, onChange, placeholder = 'Search freight yards...', label, id }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get station name from code
  const selectedStation = value ? stations[value] : null;

  // Filter stations based on search term
  const filteredStations = useMemo(() => {
    if (!searchTerm) {
      // Show all stations when no search term (alphabetically sorted)
      return Object.entries(stations).sort((a, b) => 
        a[1].name.localeCompare(b[1].name)
      );
    }
    
    const term = searchTerm.toLowerCase();
    // Show all matching results when searching
    return Object.entries(stations).filter(([code, station]) => {
      return (
        code.toLowerCase().includes(term) ||
        station.name.toLowerCase().includes(term) ||
        station.state.toLowerCase().includes(term) ||
        station.operator.toLowerCase().includes(term)
      );
    }).sort((a, b) => a[1].name.localeCompare(b[1].name));
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // If there's a selected station and user is typing something different, clear selection
    if (selectedStation) {
      const expectedFormat = `${selectedStation.name} (${value})`;
      // If input doesn't match the expected format, user is editing
      if (inputValue !== expectedFormat) {
        onChange(''); // Clear the selection
      }
    }
    
    // Extract search term (remove code in parentheses if present)
    const cleanSearchTerm = inputValue.replace(/\s*\([^)]+\)\s*$/, '').trim();
    setSearchTerm(cleanSearchTerm);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (code) => {
    onChange(code);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredStations.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredStations[highlightedIndex][0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="terminal-search-container">
      {label && (
        <label htmlFor={id} className="terminal-search-label">
          {label}
        </label>
      )}
      <div className="terminal-search-wrapper" ref={searchRef}>
        <input
          id={id}
          type="text"
          className="terminal-search-input"
          value={selectedStation && !searchTerm ? `${selectedStation.name} (${value})` : searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
        {selectedStation && (
          <button
            type="button"
            className="terminal-search-clear"
            onClick={() => {
              onChange('');
              setSearchTerm('');
            }}
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
        
        {isOpen && filteredStations.length > 0 && (
          <div className="terminal-search-dropdown" ref={dropdownRef}>
            {filteredStations.map(([code, station], index) => (
              <div
                key={code}
                className={`terminal-search-option ${index === highlightedIndex ? 'highlighted' : ''} ${value === code ? 'selected' : ''}`}
                onClick={() => handleSelect(code)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="terminal-search-option-main">
                  <span className="terminal-search-option-name">{station.name}</span>
                  <span className="terminal-search-option-code">{code}</span>
                </div>
                <div className="terminal-search-option-meta">
                  <span className="terminal-search-option-state">{station.state}</span>
                  <span className="terminal-search-option-operator">{station.operator}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isOpen && filteredStations.length === 0 && searchTerm && (
          <div className="terminal-search-dropdown">
            <div className="terminal-search-no-results">
              No freight yards found matching "{searchTerm}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TerminalSearch;

