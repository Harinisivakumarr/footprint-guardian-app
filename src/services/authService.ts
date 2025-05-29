
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  carbonGoal?: string;
  greenPoints: number;
  totalCO2Saved: number;
  joinedDate: string;
  carbonTarget?: number;
  weeklyTarget: number;
  monthlyTarget: number;
  badgesEarned: string[];
  activityStreak: number;
  lastActivity?: string;
  preferences: {
    emailNotifications: boolean;
    weeklyReports: boolean;
    dailyTips: boolean;
  };
}

export const authService = {
  // Create user profile in Firestore
  async createUserProfile(uid: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      uid,
      email: userData.email || '',
      displayName: userData.displayName || 'Eco Warrior',
      photoURL: userData.photoURL,
      greenPoints: 100,
      totalCO2Saved: 0,
      joinedDate: new Date().toISOString(),
      carbonTarget: 50,
      weeklyTarget: 20,
      monthlyTarget: 80,
      badgesEarned: ['newcomer'],
      activityStreak: 0,
      lastActivity: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        weeklyReports: true,
        dailyTips: true
      },
      ...userData
    };

    try {
      await setDoc(doc(db, 'users', uid), {
        ...defaultProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('User profile created in Firestore:', uid);
      return defaultProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email || '',
          displayName: data.displayName || 'Eco Warrior',
          photoURL: data.photoURL,
          greenPoints: data.greenPoints || 0,
          totalCO2Saved: data.totalCO2Saved || 0,
          joinedDate: data.joinedDate || new Date().toISOString(),
          carbonTarget: data.carbonTarget || 50,
          weeklyTarget: data.weeklyTarget || 20,
          monthlyTarget: data.monthlyTarget || 80,
          badgesEarned: data.badgesEarned || [],
          activityStreak: data.activityStreak || 0,
          lastActivity: data.lastActivity,
          preferences: data.preferences || {
            emailNotifications: true,
            weeklyReports: true,
            dailyTips: true
          }
        };
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
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('User profile updated:', uid);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Register with email and password
  async register(email: string, password: string, displayName: string): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile = await this.createUserProfile(user.uid, {
        email: user.email!,
        displayName,
        photoURL: user.photoURL || undefined
      });

      console.log('User registered successfully:', user.uid);
      return userProfile;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login with email and password
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get or create user profile
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        userProfile = await this.createUserProfile(user.uid, {
          email: user.email!,
          displayName: user.displayName || 'Eco Warrior',
          photoURL: user.photoURL || undefined
        });
      }

      console.log('User logged in successfully:', user.uid);
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Login with Google
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user profile exists, if not create it
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        userProfile = await this.createUserProfile(user.uid, {
          email: user.email!,
          displayName: user.displayName || 'Eco Warrior',
          photoURL: user.photoURL || undefined
        });
      }

      console.log('User logged in with Google:', user.uid);
      return userProfile;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};
