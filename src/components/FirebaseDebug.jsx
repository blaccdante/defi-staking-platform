import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

const FirebaseDebug = () => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const checkFirebase = async () => {
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };

      console.log('🔥 Firebase Environment Check:', config);

      setStatus({
        config,
        authConnected: !!auth,
        dbConnected: !!db,
        hasApiKey: !!config.apiKey,
        hasProjectId: !!config.projectId,
        configComplete: Object.values(config).every(val => val && val !== 'undefined')
      });
    };

    checkFirebase();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔥 Firebase Debug</h4>
      <div>Auth Connected: {status.authConnected ? '✅' : '❌'}</div>
      <div>DB Connected: {status.dbConnected ? '✅' : '❌'}</div>
      <div>Has API Key: {status.hasApiKey ? '✅' : '❌'}</div>
      <div>Has Project ID: {status.hasProjectId ? '✅' : '❌'}</div>
      <div>Config Complete: {status.configComplete ? '✅' : '❌'}</div>
      <details style={{ marginTop: '10px' }}>
        <summary>Config Details</summary>
        <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
          {JSON.stringify(status.config, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default FirebaseDebug;