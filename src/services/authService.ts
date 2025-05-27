
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
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user profile exists, if not create one
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
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

        await setDoc(doc(db, 'users', user.uid), userProfile);
      }

      console.log('Google login successful:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Google login error:', error);
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
