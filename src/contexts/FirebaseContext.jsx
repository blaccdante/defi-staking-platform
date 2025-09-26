import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const FirebaseContext = createContext();

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Load user profile from Firestore
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signup = async (email, password, userData) => {
    const startTime = performance.now();
    try {
      setLoading(true);
      console.log('🔥 Starting Firebase signup process...', { email, username: userData.username });
      
      // Step 1: Create user account
      const authStartTime = performance.now();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const authEndTime = performance.now();
      console.log(`✅ User created in Firebase Auth: ${user.uid} (${Math.round(authEndTime - authStartTime)}ms)`);
      
      // Step 2: Prepare user document data
      const userDocData = {
        uid: user.uid,
        username: userData.username,
        email: user.email,
        bio: userData.bio || '',
        walletAddress: userData.walletAddress || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Step 3: Run parallel operations to improve performance
      const parallelStartTime = performance.now();
      await Promise.all([
        // Update Firebase Auth profile
        updateProfile(user, { displayName: userData.username }),
        // Create user document in Firestore
        setDoc(doc(db, 'users', user.uid), userDocData)
      ]);
      const parallelEndTime = performance.now();
      console.log(`✅ Auth profile updated and Firestore document created (${Math.round(parallelEndTime - parallelStartTime)}ms)`);
      
      setUserProfile(userDocData);
      
      const totalTime = performance.now() - startTime;
      console.log(`🎉 Signup completed successfully in ${Math.round(totalTime)}ms`);
      
      // Emit performance metric
      if (window.emitPerformanceMetric) {
        window.emitPerformanceMetric('Firebase Signup', totalTime, 'authentication');
      }
      
      toast.success('Account created successfully!');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Signup error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // More user-friendly error messages
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check your email format.';
      } else if (error.code === 'auth/missing-email') {
        errorMessage = 'Email is required.';
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase configuration error. Please check your API key.';
      } else if (error.code === 'auth/project-not-found') {
        errorMessage = 'Firebase project not found. Please check your project configuration.';
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await loadUserProfile(user.uid);
      toast.success('Logged in successfully!');
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      setLoading(true);
      
      // Update Firebase Auth profile if username changed
      if (updates.username && updates.username !== user.displayName) {
        await updateProfile(user, {
          displayName: updates.username
        });
      }

      // Update Firestore document
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);
      
      // Update local state
      setUserProfile(prev => ({ ...prev, ...updateData }));
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const linkWalletAddress = async (walletAddress) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      // Check if wallet is already linked to another account
      const q = query(
        collection(db, 'users'), 
        where('walletAddress', '==', walletAddress)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const existingUser = querySnapshot.docs[0].data();
        if (existingUser.uid !== user.uid) {
          throw new Error('This wallet is already linked to another account');
        }
      }

      await updateUserProfile({ walletAddress });
      return { success: true };
    } catch (error) {
      console.error('Link wallet error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const checkUsernameAvailable = async (username) => {
    const startTime = performance.now();
    try {
      console.log(`🔍 Checking username availability: ${username}`);
      const q = query(
        collection(db, 'users'), 
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(q);
      const isAvailable = querySnapshot.empty;
      const duration = performance.now() - startTime;
      console.log(`✅ Username check completed: ${isAvailable ? 'available' : 'taken'} (${Math.round(duration)}ms)`);
      return isAvailable;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ Username check failed after ${Math.round(duration)}ms:`, error);
      return false;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    linkWalletAddress,
    checkUsernameAvailable,
    isAuthenticated: !!user
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};