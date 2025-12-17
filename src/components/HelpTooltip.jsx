import { useState } from 'react';
import './HelpTooltip.css';

function HelpTooltip({ content, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="help-tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`help-tooltip help-tooltip-${position}`}
          role="tooltip"
          aria-live="polite"
        >
          <div className="help-tooltip-content">
            {content}
          </div>
          <div className={`help-tooltip-arrow help-tooltip-arrow-${position}`}></div>
        </div>
      )}
    </span>
  );
}

export default HelpTooltip;

