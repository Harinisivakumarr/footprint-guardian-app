import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  greenPoints: number;
  totalCO2Saved: number;
  joinedDate: string;
  carbonTarget?: number;
}

export const authService = {
  // Register new user
  async register(email: string, password: string, displayName: string): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        greenPoints: 0,
        totalCO2Saved: 0,
        joinedDate: new Date().toISOString(),
        carbonTarget: 50 // Default weekly target in kg CO2
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      console.log('User registered successfully:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user profile from Firestore
      const userProfile = await this.getUserProfile(user.uid);
      
      console.log('User logged in successfully:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Google login
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      // Configure provider
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('Starting Google authentication...');
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      console.log('Google auth successful, user:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });

      // Check if user profile exists, if not create one
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        console.log('Creating new user profile for Google user...');
        userProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'Eco Warrior',
          photoURL: user.photoURL || undefined,
          greenPoints: 100, // Bonus points for Google login
          totalCO2Saved: 0,
          joinedDate: new Date().toISOString(),
          carbonTarget: 50
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userProfile);
          console.log('User profile created successfully in Firestore');
        } catch (firestoreError) {
          console.error('Error creating user profile in Firestore:', firestoreError);
          // Still return the user profile even if Firestore fails
          // The user can still use the app, just without persistent data
        }
      } else {
        console.log('Existing user profile found:', userProfile);
      }

      return userProfile;
    } catch (error: any) {
      console.error('Google login error details:', {
        code: error.code,
        message: error.message,
        details: error
      });
      
      // Provide more specific error messages
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google login was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google login. Please contact support.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google login is not enabled. Please contact support.');
      } else if (error.code === 'permission-denied' || error.message.includes('permissions')) {
        throw new Error('Unable to save user data. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid), updates, { merge: true });
      console.log('User profile updated:', updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};
