import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Component stack:', errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', backgroundColor: '#fff' }}>
          <h2 style={{ color: 'red' }}>Something went wrong</h2>
          <p style={{ color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
            {this.state.error?.message || 'An error occurred'}
          </p>
          {this.state.error?.message?.includes('render2') && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
              <p style={{ color: '#856404' }}>
                <strong>Map Loading Error:</strong> This is a known issue with react-leaflet and React 18.
                The rest of the application should still work - you can use the station selectors above.
              </p>
            </div>
          )}
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>Technical Details</summary>
            <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto', fontSize: '12px', marginTop: '10px' }}>
              {this.state.error?.stack || 'No stack trace available'}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

