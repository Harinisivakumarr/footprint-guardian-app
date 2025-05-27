
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Trophy, Target, TrendingDown } from 'lucide-react';

interface DashboardProps {
  user?: any;
  carbonEntries?: any[];
}

const Dashboard = ({ user, carbonEntries = [] }: DashboardProps) => {
  // Mock data for demonstration
  const monthlyData = [
    { month: 'Jan', emissions: 45, target: 40 },
    { month: 'Feb', emissions: 38, target: 40 },
    { month: 'Mar', emissions: 42, target: 40 },
    { month: 'Apr', emissions: 35, target: 40 },
    { month: 'May', emissions: 28, target: 40 },
    { month: 'Jun', emissions: 32, target: 40 },
  ];

  const categoryData = [
    { name: 'Transport', value: 45, color: '#ef4444' },
    { name: 'Energy', value: 30, color: '#f97316' },
    { name: 'Food', value: 20, color: '#eab308' },
    { name: 'Waste', value: 5, color: '#22c55e' },
  ];

  const stats = [
    {
      title: 'CO₂ Saved This Month',
      value: '12.5 kg',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%'
    },
    {
      title: 'Green Points',
      value: user?.greenPoints || 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+25 this week'
    },
    {
      title: 'Monthly Target',
      value: '85%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: 'On track'
    },
    {
      title: 'Reduction Rate',
      value: '23%',
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'vs last month'
    }
  ];

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
        {stats.map((stat, index) => (
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
            <CardTitle>Monthly CO₂ Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#22c55e" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Carbon Reduction Goal</span>
              <span className="text-sm text-gray-500">17/20 kg CO₂</span>
            </div>
            <Progress value={85} className="h-3" />
            <p className="text-sm text-gray-600">
              You're 85% of the way to your weekly carbon reduction goal! Keep it up! 🎯
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
