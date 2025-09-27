import React from 'react'

const MobileForm = ({ children, className = '', ...props }) => {
  return (
    <form className={`mobile-form ${className}`} {...props}>
      {children}
      
      <style jsx>{`
        .mobile-form {
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .mobile-form {
            padding: 0 var(--space-2);
          }
          
          /* Form inputs - mobile optimized */
          .mobile-form :global(.form-input-enhanced),
          .mobile-form :global(.form-input) {
            font-size: 16px !important; /* Prevents iOS zoom */
            padding: var(--space-4) var(--space-4) !important;
            min-height: 52px !important;
            border-radius: var(--radius-lg) !important;
            border: 2px solid var(--glass-border) !important;
            background: var(--glass-bg) !important;
            color: var(--text-primary) !important;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
          }
          
          .mobile-form :global(.form-input-enhanced:focus),
          .mobile-form :global(.form-input:focus) {
            outline: none;
            border-color: var(--color-primary) !important;
            box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1) !important;
            transform: translateY(-1px);
          }
          
          /* Textareas */
          .mobile-form :global(textarea.form-input-enhanced),
          .mobile-form :global(textarea.form-input) {
            min-height: 120px !important;
            resize: vertical;
            font-family: inherit;
            line-height: 1.5;
          }
          
          /* Labels */
          .mobile-form :global(.form-label-enhanced) {
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            color: var(--text-primary) !important;
            margin-bottom: var(--space-2) !important;
            display: block;
          }
          
          /* Form groups */
          .mobile-form :global(.form-group-enhanced) {
            margin-bottom: var(--space-5) !important;
          }
          
          /* Buttons in forms */
          .mobile-form :global(.btn-enhanced) {
            min-height: 48px !important;
            padding: var(--space-3) var(--space-6) !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            border-radius: var(--radius-lg) !important;
            width: 100%;
            margin-bottom: var(--space-3);
            transition: all 0.3s ease;
          }
          
          .mobile-form :global(.btn-enhanced:active) {
            transform: scale(0.98);
          }
          
          /* Button groups */
          .mobile-form :global(.flex.gap-3) {
            flex-direction: column !important;
            gap: var(--space-3) !important;
          }
          
          .mobile-form :global(.flex.gap-3 .btn-enhanced) {
            flex: 1;
            width: 100% !important;
          }
          
          /* Checkbox and radio inputs */
          .mobile-form :global(input[type="checkbox"]),
          .mobile-form :global(input[type="radio"]) {
            width: 20px !important;
            height: 20px !important;
            min-height: 20px !important;
          }
          
          /* Labels for checkboxes/radios */
          .mobile-form :global(label) {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            padding: var(--space-3);
            cursor: pointer;
            border-radius: var(--radius-md);
            transition: background-color 0.2s ease;
          }
          
          .mobile-form :global(label:hover) {
            background: var(--glass-bg);
          }
          
          /* Error states */
          .mobile-form :global(.form-input-enhanced.error),
          .mobile-form :global(.form-input.error) {
            border-color: var(--color-error) !important;
            background: rgba(var(--color-error-rgb), 0.05) !important;
          }
          
          .mobile-form :global(.error-message) {
            color: var(--color-error);
            font-size: 0.75rem;
            margin-top: var(--space-1);
            display: flex;
            align-items: center;
            gap: var(--space-1);
          }
          
          /* Success states */
          .mobile-form :global(.form-input-enhanced.success),
          .mobile-form :global(.form-input.success) {
            border-color: var(--color-success) !important;
            background: rgba(var(--color-success-rgb), 0.05) !important;
          }
          
          /* Loading states */
          .mobile-form :global(.form-input-enhanced:disabled),
          .mobile-form :global(.form-input:disabled) {
            opacity: 0.6;
            cursor: not-allowed;
            background: var(--color-secondary) !important;
          }
          
          /* Placeholder styling */
          .mobile-form :global(.form-input-enhanced::placeholder),
          .mobile-form :global(.form-input::placeholder) {
            color: var(--text-tertiary);
            font-size: 0.875rem;
          }
          
          /* Select dropdowns */
          .mobile-form :global(select.form-input-enhanced),
          .mobile-form :global(select.form-input) {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right var(--space-3) center;
            background-size: 1rem;
            padding-right: var(--space-6) !important;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-form {
            padding: 0 var(--space-1);
          }
          
          .mobile-form :global(.form-input-enhanced),
          .mobile-form :global(.form-input) {
            padding: var(--space-3) !important;
            min-height: 48px !important;
          }
          
          .mobile-form :global(textarea.form-input-enhanced),
          .mobile-form :global(textarea.form-input) {
            min-height: 100px !important;
          }
        }
        
        /* Keyboard navigation improvements */
        @media (max-width: 768px) {
          .mobile-form :global(.form-input-enhanced:focus),
          .mobile-form :global(.form-input:focus),
          .mobile-form :global(.btn-enhanced:focus) {
            outline: 3px solid rgba(var(--color-primary-rgb), 0.3);
            outline-offset: 2px;
          }
          
          /* Ensure inputs are visible when keyboard appears */
          .mobile-form :global(.form-input-enhanced:focus),
          .mobile-form :global(.form-input:focus) {
            scroll-margin-top: 120px;
          }
        }
        
        /* Dark mode adjustments */
        @media (max-width: 768px) and (prefers-color-scheme: dark) {
          .mobile-form :global(.form-input-enhanced),
          .mobile-form :global(.form-input) {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
          }
          
          .mobile-form :global(.form-input-enhanced::placeholder),
          .mobile-form :global(.form-input::placeholder) {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      `}</style>
    </form>
  )
}

// Enhanced form input component with mobile optimizations
const MobileInput = ({ 
  label, 
  error, 
  success, 
  required = false, 
  className = '',
  type = 'text',
  ...props 
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`mobile-input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label-enhanced">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        className={`form-input-enhanced ${error ? 'error' : ''} ${success ? 'success' : ''}`}
        {...props}
      />
      
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <span>✅</span>
          {success}
        </div>
      )}
      
      <style jsx>{`
        .mobile-input-group {
          margin-bottom: var(--space-4);
        }
        
        .required-asterisk {
          color: var(--color-error);
          margin-left: var(--space-1);
        }
        
        .success-message {
          color: var(--color-success);
          font-size: 0.75rem;
          margin-top: var(--space-1);
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
      `}</style>
    </div>
  )
}

// Enhanced textarea component
const MobileTextarea = ({ 
  label, 
  error, 
  success, 
  required = false, 
  className = '',
  rows = 4,
  ...props 
}) => {
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`mobile-textarea-group ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="form-label-enhanced">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        rows={rows}
        className={`form-input-enhanced ${error ? 'error' : ''} ${success ? 'success' : ''}`}
        {...props}
      />
      
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          {error}
        </div>
      )}
      
      <style jsx>{`
        .mobile-textarea-group {
          margin-bottom: var(--space-4);
        }
        
        .required-asterisk {
          color: var(--color-error);
          margin-left: var(--space-1);
        }
      `}</style>
    </div>
  )
}

// Mobile button component
const MobileButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  loading = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`mobile-button mobile-button-${variant} mobile-button-${size} ${fullWidth ? 'mobile-button-full' : ''} ${loading ? 'mobile-button-loading' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="mobile-loading-spinner"></span>}
      {children}
      
      <style jsx>{`
        .mobile-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          border: none;
          border-radius: var(--radius-lg);
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          box-sizing: border-box;
          min-height: 44px;
        }
        
        .mobile-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .mobile-button-primary {
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-md);
        }
        
        .mobile-button-secondary {
          background: var(--glass-bg);
          border: 2px solid var(--glass-border);
          color: var(--text-primary);
        }
        
        .mobile-button-small {
          padding: var(--space-2) var(--space-4);
          font-size: 0.875rem;
          min-height: 36px;
        }
        
        .mobile-button-medium {
          padding: var(--space-3) var(--space-6);
          font-size: 1rem;
          min-height: 44px;
        }
        
        .mobile-button-large {
          padding: var(--space-4) var(--space-8);
          font-size: 1.125rem;
          min-height: 52px;
        }
        
        .mobile-button-full {
          width: 100%;
        }
        
        .mobile-button:active {
          transform: scale(0.98);
        }
        
        .mobile-loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .mobile-button {
            min-height: 48px;
            padding: var(--space-3) var(--space-4);
          }
          
          .mobile-button-large {
            min-height: 52px;
            padding: var(--space-4) var(--space-6);
          }
        }
      `}</style>
    </button>
  )
}

export { MobileForm, MobileInput, MobileTextarea, MobileButton }
export default MobileForm