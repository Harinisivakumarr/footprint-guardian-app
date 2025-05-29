
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Leaf, Trophy, Target, TrendingDown, Calendar, Activity } from 'lucide-react';
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
        console.log('Dashboard stats loaded:', dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setStats({
          totalEntries: 0,
          totalCO2Saved: 0,
          weeklyProgress: 0,
          monthlyEmissions: [],
          categoryBreakdown: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.uid, carbonEntries.length]);

  // Calculate dashboard metrics from real user data
  const dashboardMetrics = [
    {
      title: 'CO₂ Tracked This Month',
      value: `${stats.totalCO2Saved.toFixed(1)} kg`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${stats.totalEntries} entries`,
      progress: user?.monthlyTarget ? (stats.totalCO2Saved / user.monthlyTarget) * 100 : 0
    },
    {
      title: 'Green Points',
      value: user?.greenPoints || 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: `+${Math.floor((user?.greenPoints || 0) / 50)} level`,
      streak: user?.activityStreak || 0
    },
    {
      title: 'Weekly Progress',
      value: `${stats.weeklyProgress}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: stats.weeklyProgress >= 75 ? 'On track' : 'Needs attention',
      target: user?.weeklyTarget || 20
    },
    {
      title: 'Total Tracked',
      value: `${stats.totalCO2Saved.toFixed(1)} kg`,
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'All time',
      badges: user?.badgesEarned?.length || 0
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
        <p className="text-gray-600">Here's your carbon footprint tracking overview</p>
        {user?.activityStreak && user.activityStreak > 0 && (
          <p className="text-sm text-green-600 font-medium">
            🔥 {user.activityStreak} day streak! Keep tracking!
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  
                  {stat.progress !== undefined && (
                    <div className="mt-2">
                      <Progress value={Math.min(stat.progress, 100)} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Target: {user?.monthlyTarget}kg/month
                      </p>
                    </div>
                  )}
                  
                  {stat.streak !== undefined && stat.streak > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      🔥 {stat.streak} day streak
                    </p>
                  )}
                  
                  {stat.badges !== undefined && (
                    <p className="text-xs text-purple-600 mt-1">
                      🏆 {stat.badges} badges earned
                    </p>
                  )}
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
        {/* Monthly CO₂ Tracking Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly CO₂ Tracking Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.monthlyEmissions.length > 0 ? (
              <ChartContainer
                config={{
                  emissions: {
                    label: "CO₂ Tracked",
                    color: "#22c55e",
                  },
                  target: {
                    label: "Target",
                    color: "#ef4444",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyEmissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="emissions" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                      name="CO₂ Tracked (kg)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Target (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Start tracking your carbon footprint to see trends!</p>
                  <p className="text-sm mt-1">Add your first carbon entry to begin.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Tracking by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.categoryBreakdown.length > 0 ? (
              <>
                <ChartContainer
                  config={{
                    transport: { label: "Transport", color: "#ef4444" },
                    energy: { label: "Energy", color: "#f97316" },
                    food: { label: "Food", color: "#eab308" },
                    waste: { label: "Waste", color: "#22c55e" },
                    water: { label: "Water", color: "#3b82f6" },
                    shopping: { label: "Shopping", color: "#8b5cf6" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
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
                      <ChartTooltip 
                        content={<ChartTooltipContent nameKey="name" />} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Add carbon entries to see category breakdown!</p>
                  <p className="text-sm mt-1">Track different activities to view insights.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Tracking Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Tracking Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Weekly Tracking Goal</span>
              <span className="text-sm text-gray-500">
                {stats.totalCO2Saved.toFixed(1)}/{user?.weeklyTarget || 20} kg CO₂ tracked
              </span>
            </div>
            <Progress value={Math.min(stats.weeklyProgress, 100)} className="h-4" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress: {stats.weeklyProgress}%</span>
              <span className={`font-medium ${stats.weeklyProgress >= 75 ? 'text-green-600' : 'text-orange-600'}`}>
                {stats.weeklyProgress >= 75 ? '🎯 On Track!' : '📈 Keep Going!'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {stats.weeklyProgress >= 75 
                ? "Excellent! You're actively tracking your carbon footprint this week! 🌱"
                : "Add more carbon tracking entries to reach your weekly goal! Every entry counts! 💪"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
