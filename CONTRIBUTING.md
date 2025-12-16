# Contributing to Rail Freight Route Mapping

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rail-freight-route-mapping.git
   cd rail-freight-route-mapping
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Follow existing code style and patterns
- Use functional components with hooks
- Keep components focused and reusable
- Add comments for complex logic

### Component Structure
```jsx
// Imports
import { useState, useEffect } from 'react';
import OtherComponent from './OtherComponent';

// Component
function MyComponent({ prop1, prop2 }) {
  // State
  const [state, setState] = useState(initial);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default MyComponent;
```

### Testing
- Write tests for new features
- Maintain or improve test coverage
- Run tests before committing:
  ```bash
  npm test
  ```

### Git Workflow
1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes
3. Write/update tests
4. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```

5. Commit with descriptive messages:
   ```bash
   git commit -m "Add feature: description of changes"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```

7. Create a Pull Request on GitHub

## Commit Message Format

Use clear, descriptive commit messages:
- `Add feature: description`
- `Fix bug: description`
- `Update: description`
- `Refactor: description`
- `Test: description`
- `Docs: description`

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update README** if adding features
5. **Request review** from maintainers

## Areas for Contribution

### High Priority
- Backend API integration
- Authentication system
- Enhanced freight calculations
- Additional car types
- More rail network data

### Medium Priority
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Export functionality
- Advanced analytics

### Low Priority
- UI/UX enhancements
- Additional test coverage
- Documentation improvements
- Code refactoring

## Questions?

Open an issue on GitHub for questions or discussions about contributions.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing! 🚂

