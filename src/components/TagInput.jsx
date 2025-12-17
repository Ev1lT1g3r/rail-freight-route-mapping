import { useState } from 'react';
import './TagInput.css';

function TagInput({ tags = [], onChange, placeholder = 'Add tags...', maxTags = 10 }) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue.trim()) {
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag) => {
    if (tags.length >= maxTags) {
      return;
    }
    
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.some(t => t.toLowerCase() === normalizedTag)) {
      const newTags = [...tags, tag];
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const commonTags = ['urgent', 'priority', 'hazmat', 'oversized', 'fragile', 'perishable', 'high-value', 'time-sensitive'];

  return (
    <div className="tag-input-container">
      <div 
        className={`tag-input-wrapper ${isFocused ? 'focused' : ''}`}
        onClick={() => document.getElementById('tag-input-field')?.focus()}
      >
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="tag-remove"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="tag-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="tag-input-field"
          disabled={tags.length >= maxTags}
        />
      </div>
      {tags.length < maxTags && (
        <div className="tag-suggestions">
          <small style={{ color: '#6B7280', marginRight: '8px' }}>Suggestions:</small>
          {commonTags
            .filter(tag => !tags.some(t => t.toLowerCase() === tag.toLowerCase()))
            .slice(0, 5)
            .map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="tag-suggestion"
              >
                {tag}
              </button>
            ))}
        </div>
      )}
      {tags.length >= maxTags && (
        <small style={{ color: '#EF4444', marginTop: '4px', display: 'block' }}>
          Maximum {maxTags} tags allowed
        </small>
      )}
    </div>
  );
}

export default TagInput;

