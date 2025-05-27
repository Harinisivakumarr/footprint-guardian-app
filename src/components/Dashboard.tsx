
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Trophy, Target, TrendingDown } from 'lucide-react';
import { carbonService, DashboardStats } from '@/services/carbonService';
import { UserProfile } from '@/services/authService';

interface DashboardProps {
  user?: UserProfile;
  carbonEntries?: any[];
}

const Dashboard = ({ user, carbonEntries = [] }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEntries: 0,
    totalCO2Saved: 0,
    weeklyProgress: 0,
    monthlyEmissions: [],
    categoryBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.uid) return;
      
      setIsLoading(true);
      try {
        const dashboardStats = await carbonService.getDashboardStats(user.uid);
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.uid, carbonEntries]);

  // Calculate dashboard metrics from real data
  const dashboardMetrics = [
    {
      title: 'CO₂ Tracked This Month',
      value: `${stats.totalCO2Saved.toFixed(1)} kg`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${stats.totalEntries} entries`
    },
    {
      title: 'Green Points',
      value: user?.greenPoints || 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+' + Math.floor((user?.greenPoints || 0) / 10) + ' this week'
    },
    {
      title: 'Weekly Progress',
      value: `${Math.round(stats.weeklyProgress)}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: stats.weeklyProgress >= 85 ? 'On track' : 'Needs attention'
    },
    {
      title: 'Total Entries',
      value: stats.totalEntries,
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'All time'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || 'Eco Warrior'}! 🌱
          </h1>
          <p className="text-gray-600">Loading your environmental impact overview...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName || 'Eco Warrior'}! 🌱
        </h1>
        <p className="text-gray-600">Here's your environmental impact overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Emissions Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly CO₂ Tracking Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.monthlyEmissions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyEmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                <p>Start tracking your carbon footprint to see trends!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.categoryBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {stats.categoryBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name} ({item.value}kg)</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                <p>Add carbon entries to see category breakdown!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Tracking Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Weekly Tracking Goal</span>
              <span className="text-sm text-gray-500">
                {stats.totalCO2Saved.toFixed(1)}/20 kg CO₂ tracked
              </span>
            </div>
            <Progress value={stats.weeklyProgress} className="h-3" />
            <p className="text-sm text-gray-600">
              {stats.weeklyProgress >= 85 
                ? "Great job! You're actively tracking your carbon footprint! 🎯"
                : "Keep tracking your activities to reach your weekly goal! 🌱"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
