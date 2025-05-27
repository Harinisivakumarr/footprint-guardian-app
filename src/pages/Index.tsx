
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
      if (firebaseUser) {
        // User is signed in, get their profile
        const userProfile = await authService.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
          // Load user's carbon entries
          const entries = await carbonService.getUserCarbonEntries(firebaseUser.uid);
          setCarbonEntries(entries);
        }
      } else {
        // User is signed out
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
    const entries = await carbonService.getUserCarbonEntries(userData.uid);
    setCarbonEntries(entries);
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
      
      // Update user's green points in local state
      const points = Math.floor(entry.co2Emission * 2);
      setUser(prev => prev ? {
        ...prev,
        greenPoints: prev.greenPoints + points,
        totalCO2Saved: prev.totalCO2Saved + entry.co2Emission
      } : null);

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
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">E</span>
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
