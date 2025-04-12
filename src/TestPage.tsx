import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>SuiteSync Test Page</h1>
      <p>If you can see this content, the basic React rendering is working correctly.</p>
      
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Environment Variables Test</h2>
        <p>Testing access to environment variables:</p>
        <ul>
          <li>VITE_SUPABASE_URL exists: {Boolean(import.meta.env.VITE_SUPABASE_URL).toString()}</li>
          <li>VITE_SUPABASE_ANON_KEY exists: {Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY).toString()}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Browser Information</h2>
        <p>User Agent: {navigator.userAgent}</p>
        <p>Window Size: {window.innerWidth} x {window.innerHeight}</p>
      </div>
      
      <button 
        onClick={() => alert('Button click works!')}
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestPage;
