import { useState } from 'react';
import './HomePage.css';

function HomePage({ onNavigateToWorkflow, onLogin }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple login - in production, this would call an API
    if (loginCredentials.email && loginCredentials.password) {
      onLogin(loginCredentials.email);
      setShowLoginModal(false);
      setLoginCredentials({ email: '', password: '' });
    }
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="homepage-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="sigma-logo-text">Σ</span>
            <span className="sigma-brand">Sigma IQ</span>
          </div>
          <div className="nav-actions">
            <button 
              className="nav-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Intelligent Rail Freight
            <br />
            <span className="hero-title-accent">Route Planning</span>
          </h1>
          <p className="hero-subtitle">
            Streamline your freight rail operations with advanced route optimization, 
            compliance analysis, and interactive planning tools.
          </p>
          <div className="hero-cta">
            <button 
              className="cta-primary"
              onClick={onNavigateToWorkflow}
            >
              Start Route Submission
            </button>
            <button 
              className="cta-secondary"
              onClick={() => setShowLoginModal(true)}
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-icon">🚂</div>
            <h3>Route Optimization</h3>
            <p>Find the best routes with intelligent algorithms</p>
          </div>
          <div className="hero-card">
            <div className="card-icon">📊</div>
            <h3>Compliance Analysis</h3>
            <p>Real-time probability scoring for approvals</p>
          </div>
          <div className="hero-card">
            <div className="card-icon">🗺️</div>
            <h3>Interactive Planning</h3>
            <p>Visualize and adjust freight placement</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Route Finding</h3>
              <p>
                Advanced algorithms calculate optimal routes based on distance, 
                operator preferences, and transfer points.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Compliance Probability</h3>
              <p>
                Real-time analysis of approval likelihood with multi-factor 
                scoring and actionable recommendations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📐</div>
              <h3>Freight Planning</h3>
              <p>
                Interactive tools for dimension adjustment, placement visualization, 
                and center of gravity analysis.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚂</div>
              <h3>Operator Integration</h3>
              <p>
                Support for major Class I railroads including BNSF, UP, CSX, 
                NS, CN, and CP with operator-specific rules.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Workflow Management</h3>
              <p>
                Complete submission workflow with draft saving, approval tracking, 
                and comprehensive audit trails.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Enhanced Visualization</h3>
              <p>
                Rich map displays with operator-specific route coloring, 
                statistics panels, and satellite imagery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-text">
            Begin planning your rail freight routes with our comprehensive tools.
          </p>
          <button 
            className="cta-primary-large"
            onClick={onNavigateToWorkflow}
          >
            Access Route Submission Workflow
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="sigma-logo-text">Σ</span>
            <span className="sigma-brand">Sigma IQ</span>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
          <div className="footer-copyright">
            © 2024 Sigma IQ. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Sign In</h2>
              <button 
                className="modal-close"
                onClick={() => setShowLoginModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={loginCredentials.email}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="login-submit-btn">
                Sign In
              </button>
              <div className="login-footer">
                <a href="#forgot">Forgot password?</a>
                <a href="#signup">Don't have an account? Sign up</a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;

