import React from 'react'

const TestComponent = ({ title = "Test Component", user }) => {
  console.log(`📋 ${title} rendered with user:`, user)
  
  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      backgroundColor: 'var(--glass-bg, rgba(255, 255, 255, 0.1))',
      color: 'var(--text-primary, #ffffff)'
    }}>
      <h2 style={{ color: '#3b82f6', marginBottom: '10px' }}>
        🧪 {title}
      </h2>
      <p>Component is working correctly!</p>
      
      {user && (
        <div style={{ marginTop: '10px', fontSize: '0.875rem' }}>
          <strong>User Data:</strong>
          <pre style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.75rem'
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={() => {
            console.log(`${title} button clicked`)
            alert(`${title} is working!`)
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Button
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}

export default TestComponent