import React, { useState, useEffect } from 'react';

/**
 * A minimal debug application that doesn't depend on any external providers
 * or complex configurations. This helps isolate rendering issues.
 */
const DebugApp: React.FC = () => {
  const [count, setCount] = useState(0);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Collect environment variables for debugging
    try {
      const vars: Record<string, string> = {};
      
      // Get all environment variables that start with VITE_
      Object.keys(import.meta.env).forEach(key => {
        if (key.startsWith('VITE_')) {
          // Mask sensitive values
          const value = String(import.meta.env[key]);
          vars[key] = key.includes('KEY') || key.includes('SECRET') 
            ? `${value.substring(0, 5)}...${value.substring(value.length - 5)}` 
            : value;
        }
      });
      
      setEnvVars(vars);
    } catch (err) {
      setError(`Error collecting environment variables: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      color: '#333'
    }}>
      <div style={{ 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#6366f1', marginTop: 0 }}>SuiteSync Debug Mode</h1>
        <p>This is a minimal React application to help diagnose rendering issues.</p>
        <p>If you can see this content, basic React rendering is working correctly.</p>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => setCount(prev => prev + 1)}
            style={{
              padding: '8px 16px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Count: {count}
          </button>
          <span style={{ fontSize: '14px', color: '#666' }}>
            (Click to test state updates)
          </span>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          padding: '15px', 
          background: '#fee2e2', 
          border: '1px solid #ef4444',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#b91c1c'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Error</h3>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}
      
      <div style={{ 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>Environment Variables</h2>
        {Object.keys(envVars).length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Variable</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(envVars).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{key}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No environment variables found.</p>
        )}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>Browser Information</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>User Agent</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{navigator.userAgent}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Window Size</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{window.innerWidth} x {window.innerHeight}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Platform</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{navigator.platform}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        background: '#f0fdf4',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #86efac'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#166534' }}>Next Steps</h2>
        <p>Now that we've confirmed basic React rendering is working, you can:</p>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Restore your original main.tsx file</li>
          <li style={{ marginBottom: '8px' }}>Check for errors in your provider components</li>
          <li style={{ marginBottom: '8px' }}>Gradually add back providers to identify which one is causing issues</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugApp;
