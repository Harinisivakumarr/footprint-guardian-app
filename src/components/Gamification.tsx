
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Leaf, Zap, Recycle } from 'lucide-react';

const Gamification = () => {
  const badges = [
    {
      id: 1,
      name: 'Eco Warrior',
      description: 'Completed 50 carbon reduction activities',
      icon: Trophy,
      earned: true,
      progress: 100,
      color: 'bg-yellow-500',
      earnedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Green Commuter',
      description: 'Used eco-friendly transport 30 times',
      icon: Leaf,
      earned: true,
      progress: 100,
      color: 'bg-green-500',
      earnedDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Energy Saver',
      description: 'Reduced energy consumption by 25%',
      icon: Zap,
      earned: false,
      progress: 68,
      color: 'bg-blue-500'
    },
    {
      id: 4,
      name: 'Waste Reducer',
      description: 'Recycled 100kg of waste',
      icon: Recycle,
      earned: false,
      progress: 45,
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Carbon Neutral',
      description: 'Achieved net-zero carbon footprint',
      icon: Target,
      earned: false,
      progress: 23,
      color: 'bg-emerald-500'
    },
    {
      id: 6,
      name: 'Eco Legend',
      description: 'Saved 1000kg CO₂ in total',
      icon: Star,
      earned: false,
      progress: 12,
      color: 'bg-indigo-500'
    }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Walk Week Challenge',
      description: 'Walk or cycle instead of driving for 7 days',
      reward: '50 Green Points',
      deadline: '2024-02-01',
      progress: 4,
      total: 7,
      status: 'active'
    },
    {
      id: 2,
      title: 'Plastic-Free February',
      description: 'Avoid single-use plastics for the entire month',
      reward: '100 Green Points',
      deadline: '2024-02-29',
      progress: 0,
      total: 28,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Energy Efficiency Sprint',
      description: 'Reduce home energy usage by 20%',
      reward: '75 Green Points',
      deadline: '2024-01-31',
      progress: 15,
      total: 20,
      status: 'active'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Green', points: 2450, badge: '🏆' },
    { rank: 2, name: 'Mike Eco', points: 2380, badge: '🥈' },
    { rank: 3, name: 'You', points: 2250, badge: '🥉' },
    { rank: 4, name: 'Anna Forest', points: 2100, badge: '' },
    { rank: 5, name: 'John Earth', points: 1950, badge: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Eco Rewards & Achievements</h1>
        <p className="text-gray-600">Track your progress and earn badges for eco-friendly actions</p>
      </div>

      {/* Points Summary */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">2,250 Green Points</h2>
              <p className="text-green-100">+125 points this week</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <Trophy size={32} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-100 mb-2">Next level: Eco Champion (250 points to go)</p>
            <Progress value={90} className="h-2 bg-green-400" />
          </div>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={24} />
            <span>Achievements & Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                  badge.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-full ${badge.earned ? badge.color : 'bg-gray-300'}`}>
                    <badge.icon 
                      size={20} 
                      className={badge.earned ? 'text-white' : 'text-gray-500'} 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    {badge.earned && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                {!badge.earned && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <Progress value={badge.progress} className="h-2" />
                  </div>
                )}
                {badge.earned && badge.earnedDate && (
                  <p className="text-xs text-green-600">
                    Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-blue-500" size={24} />
              <span>Active Challenges</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                  <Badge 
                    variant={challenge.status === 'active' ? 'default' : 'secondary'}
                    className={challenge.status === 'active' ? 'bg-blue-100 text-blue-700' : ''}
                  >
                    {challenge.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {challenge.progress}/{challenge.total}</span>
                    <span className="font-medium text-green-600">{challenge.reward}</span>
                  </div>
                  <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                  <p className="text-xs text-gray-500">
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="text-yellow-500" size={24} />
              <span>Community Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.name === 'You' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border">
                      <span className="font-semibold text-sm">
                        {user.badge || user.rank}
                      </span>
                    </div>
                    <div>
                      <p className={`font-medium ${user.name === 'You' ? 'text-green-700' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.points} points</p>
                    </div>
                  </div>
                  {user.name === 'You' && (
                    <Badge className="bg-green-100 text-green-700">You</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gamification;
