
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '@/components/Layout';
import Auth from '@/components/Auth';
import Dashboard from '@/components/Dashboard';
import CarbonCalculator from '@/components/CarbonCalculator';
import Gamification from '@/components/Gamification';
import Profile from '@/components/Profile';
import DailyTip from '@/components/DailyTip';
import Suggestions from '@/components/Suggestions';
import Reports from '@/components/Reports';
import { auth } from '@/lib/firebase';
import { authService, UserProfile } from '@/services/authService';
import { carbonService } from '@/services/carbonService';

const Index = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [carbonEntries, setCarbonEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        console.log('Firebase user detected:', firebaseUser.uid);
        
        try {
          // Get or create user profile from Firestore
          let userProfile = await authService.getUserProfile(firebaseUser.uid);
          
          // If no profile exists, create one (for existing users or OAuth users)
          if (!userProfile) {
            console.log('No user profile found, creating one...');
            userProfile = await authService.createUserProfile(firebaseUser.uid, {
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || 'Eco Warrior',
              photoURL: firebaseUser.photoURL || undefined
            });
          }
          
          setUser(userProfile);
          
          // Load user's carbon entries
          try {
            const entries = await carbonService.getUserCarbonEntries(firebaseUser.uid);
            setCarbonEntries(entries);
            console.log('Carbon entries loaded:', entries.length);
          } catch (error) {
            console.error('Error loading carbon entries:', error);
            setCarbonEntries([]);
          }
          
          console.log('User profile loaded:', userProfile);
        } catch (error) {
          console.error('Error loading/creating user profile:', error);
          // Set basic user info even if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || 'User',
            greenPoints: 0,
            totalCO2Saved: 0,
            joinedDate: new Date().toISOString(),
            weeklyTarget: 20,
            monthlyTarget: 80,
            badgesEarned: [],
            activityStreak: 0,
            preferences: {
              emailNotifications: true,
              weeklyReports: true,
              dailyTips: true
            }
          });
          setCarbonEntries([]);
        }
      } else {
        // User is signed out
        console.log('No Firebase user detected');
        setUser(null);
        setCarbonEntries([]);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (userData: UserProfile) => {
    setUser(userData);
    // Load user's carbon entries
    try {
      const entries = await carbonService.getUserCarbonEntries(userData.uid);
      setCarbonEntries(entries);
      console.log('Carbon entries loaded after login:', entries.length);
    } catch (error) {
      console.error('Error loading carbon entries after login:', error);
      setCarbonEntries([]);
    }
    console.log('User logged in:', userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setCarbonEntries([]);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddCarbonEntry = async (entry: any) => {
    if (!user) return;

    try {
      const entryId = await carbonService.addCarbonEntry({
        ...entry,
        userId: user.uid,
        date: new Date().toISOString()
      });

      const newEntry = {
        ...entry,
        id: entryId,
        userId: user.uid,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setCarbonEntries(prev => [newEntry, ...prev]);
      
      // Update user's green points and total CO2 saved
      const points = Math.floor(entry.co2Emission * 2);
      const updatedUser = {
        ...user,
        greenPoints: user.greenPoints + points,
        totalCO2Saved: user.totalCO2Saved + entry.co2Emission,
        lastActivity: new Date().toISOString()
      };
      
      setUser(updatedUser);

      console.log('Carbon entry added:', newEntry);
    } catch (error) {
      console.error('Error adding carbon entry:', error);
    }
  };

  const handleUpdateProfile = async (profileData: any) => {
    if (!user) return;

    try {
      await authService.updateUserProfile(user.uid, profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      console.log('Profile updated:', profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">🌱</span>
          </div>
          <p className="text-gray-600">Loading your eco journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={<Dashboard user={user} carbonEntries={carbonEntries} />} 
        />
        <Route 
          path="/calculator" 
          element={<CarbonCalculator onAddEntry={handleAddCarbonEntry} />} 
        />
        <Route path="/reports" element={<Reports />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route 
          path="/profile" 
          element={<Profile user={user} onUpdateProfile={handleUpdateProfile} />} 
        />
        <Route path="/daily-tip" element={<DailyTip />} />
      </Routes>
    </Layout>
  );
};

export default Index;
