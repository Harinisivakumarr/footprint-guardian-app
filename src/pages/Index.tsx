
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Auth from '@/components/Auth';
import Dashboard from '@/components/Dashboard';
import CarbonCalculator from '@/components/CarbonCalculator';
import Gamification from '@/components/Gamification';
import Profile from '@/components/Profile';
import DailyTip from '@/components/DailyTip';
import Suggestions from '@/components/Suggestions';
import Reports from '@/components/Reports';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [carbonEntries, setCarbonEntries] = useState<any[]>([]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCarbonEntries([]);
    console.log('User logged out');
  };

  const handleAddCarbonEntry = (entry: any) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      userId: user?.uid,
      createdAt: new Date().toISOString()
    };
    setCarbonEntries(prev => [newEntry, ...prev]);
    console.log('Carbon entry added:', newEntry);
  };

  const handleUpdateProfile = (profileData: any) => {
    setUser(prev => ({ ...prev, ...profileData }));
    console.log('Profile updated:', profileData);
  };

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
