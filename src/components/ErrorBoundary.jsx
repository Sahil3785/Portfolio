import { Component } from 'react';
import { profile } from '../data/content';

// Shows a calm fallback instead of a blank page if something throws.
export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Portfolio error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          background: '#f6f6fb',
          color: '#15173d',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>This page didn't load properly</h1>
          <p style={{ color: '#5d6187', marginBottom: '1.5rem' }}>
            Reload to try again, or reach me directly at{' '}
            <a href={`mailto:${profile.email}`} style={{ color: '#c4541b' }}>
              {profile.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.8rem 1.4rem',
              borderRadius: 999,
              border: 0,
              background: '#15173d',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
