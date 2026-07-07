import { useState, useEffect } from 'react';
import './App.css';

interface ApiResponse {
  status: string;
  message: string;
  timestamp: string;
  features: string[];
}

function App() {
  const [count, setCount] = useState<number>(0);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api/info';

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackendHealth();
    // Poll backend status every 10 seconds
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePingAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setApiData(data);
      setBackendStatus('online');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server. Make sure the backend server is running on port 5000.');
      setApiData(null);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-title-section">
          <h1>NPM Workspace Monorepo</h1>
          <p>Manage and monitor frontend and backend applications from a single codebase</p>
        </div>
        <div className="status-badge">
          <span className={`status-dot ${backendStatus}`}></span>
          <span>
            Backend Server: {backendStatus.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Grid of Workspaces */}
      <main className="grid">
        {/* Frontend Workspace Card */}
        <section className="card web-card">
          <h2>
            <span>💻</span> apps/web
          </h2>
          <p className="desc">Frontend single page application built with React, Vite, and TypeScript.</p>
          
          <div className="badge-list">
            <span className="badge tech">React 19</span>
            <span className="badge tech">Vite 8</span>
            <span className="badge tech">TypeScript</span>
            <span className="badge dev">Port 5173</span>
          </div>

          <div className="file-list">
            <div className="file-item">📁 src/main.tsx</div>
            <div className="file-item">📁 src/App.tsx</div>
            <div className="file-item">📄 vite.config.ts</div>
            <div className="file-item">📄 package.json</div>
          </div>
        </section>

        {/* Backend Workspace Card */}
        <section className="card backend-card">
          <h2>
            <span>🛡️</span> apps/backend
          </h2>
          <p className="desc">RESTful API backend service running Node.js with Express and TypeScript.</p>
          
          <div className="badge-list">
            <span className="badge tech">Node.js</span>
            <span className="badge tech">Express</span>
            <span className="badge tech">TypeScript</span>
            <span className="badge dev">Port 5000</span>
          </div>

          <div className="file-list">
            <div className="file-item">📁 src/index.ts</div>
            <div className="file-item">📄 tsconfig.json</div>
            <div className="file-item">📄 package.json</div>
            <div className="file-item">📄 .env</div>
          </div>
        </section>
      </main>

      {/* Interactive Control Dashboard */}
      <section className="interactive-section">
        <div className="interactive-card">
          <div className="interactive-title-bar">
            <h3>Interactive Workspace Controls</h3>
            <div className="button-group">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setCount(c => c + 1)}
              >
                Increment Count: {count}
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handlePingAPI}
                disabled={loading}
              >
                {loading ? 'Pinging...' : 'Ping Backend API'}
              </button>
            </div>
          </div>

          {/* Console / Response Output */}
          <div className="console-container">
            {loading && (
              <div className="console-viewer placeholder">
                <span>Fetching data from backend api...</span>
              </div>
            )}
            
            {!loading && error && (
              <div className="console-viewer" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <span className="console-label" style={{ color: 'var(--accent-red)' }}>Error</span>
                <pre style={{ color: 'var(--accent-red)' }}>{error}</pre>
              </div>
            )}

            {!loading && !error && apiData && (
              <div className="console-viewer">
                <span className="console-label">API Response</span>
                <pre>{JSON.stringify(apiData, null, 2)}</pre>
              </div>
            )}

            {!loading && !error && !apiData && (
              <div className="console-viewer placeholder">
                <span>Click "Ping Backend API" to verify client-server communication.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Running in an <strong>NPM Workspace</strong> monorepo structure. Execute dev environment with <code>npm run dev</code> at the root.
        </p>
      </footer>
    </div>
  );
}

export default App;
