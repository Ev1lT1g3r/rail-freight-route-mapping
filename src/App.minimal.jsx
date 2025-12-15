// Minimal test version - if this doesn't show, React isn't working
import './App.css';

function App() {
  console.log('App component rendering...');
  
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#ffffff', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#ff0000', fontSize: '32px' }}>
        ✅ REACT IS WORKING!
      </h1>
      <p style={{ fontSize: '18px', color: '#333' }}>
        If you see this message, React is rendering correctly.
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <h2>Debug Info:</h2>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  );
}

export default App;

