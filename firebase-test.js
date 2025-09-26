// Test Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Load environment variables
const firebaseConfig = {
  apiKey: 'AIzaSyAA14SmhFtD-5glZ53T8T1_dn3BRAy-U',
  authDomain: 'defi-staking-platform.firebaseapp.com',
  projectId: 'defi-staking-platform',
  storageBucket: 'defi-staking-platform.firebasestorage.app',
  messagingSenderId: '688919996953',
  appId: '1:688919996953:web:dfd94df56ed2eb644a588B'
};

console.log('Testing Firebase configuration...');
console.log('Config:', firebaseConfig);

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');

  // Initialize Auth
  const auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');

  // Initialize Firestore
  const db = getFirestore(app);
  console.log('✅ Firebase Firestore initialized successfully');

  console.log('🎉 All Firebase services initialized successfully!');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
}