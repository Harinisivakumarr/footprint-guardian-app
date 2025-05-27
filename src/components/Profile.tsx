
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Leaf, Target, Edit2, Save, X } from 'lucide-react';

interface ProfileProps {
  user?: any;
  onUpdateProfile?: (data: any) => void;
}

const Profile = ({ user, onUpdateProfile }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    carbonGoal: user?.carbonGoal || '',
  });

  const handleSave = () => {
    onUpdateProfile?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      carbonGoal: user?.carbonGoal || '',
    });
    setIsEditing(false);
  };

  const activities = [
    {
      date: '2024-01-25',
      action: 'Reduced car usage',
      impact: '-5.2 kg CO₂',
      points: '+25 points',
      category: 'Transport'
    },
    {
      date: '2024-01-24',
      action: 'Switched to renewable energy',
      impact: '-12.8 kg CO₂',
      points: '+50 points',
      category: 'Energy'
    },
    {
      date: '2024-01-23',
      action: 'Composted organic waste',
      impact: '-2.1 kg CO₂',
      points: '+15 points',
      category: 'Waste'
    },
    {
      date: '2024-01-22',
      action: 'Ate plant-based meal',
      impact: '-3.4 kg CO₂',
      points: '+20 points',
      category: 'Food'
    },
  ];

  const stats = [
    { label: 'Total CO₂ Saved', value: '127.5 kg', color: 'text-green-600' },
    { label: 'Green Points', value: '2,250', color: 'text-yellow-600' },
    { label: 'Days Active', value: '45', color: 'text-blue-600' },
    { label: 'Badges Earned', value: '8', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Eco Profile</h1>
        <p className="text-gray-600">Manage your profile and track your environmental journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-1"
                >
                  {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback className="bg-green-100 text-green-600 text-2xl">
                    {user?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="carbonGoal">Monthly CO₂ Goal (kg)</Label>
                      <Input
                        id="carbonGoal"
                        type="number"
                        value={formData.carbonGoal}
                        onChange={(e) => setFormData({...formData, carbonGoal: e.target.value})}
                        placeholder="e.g., 50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell us about your eco journey..."
                        rows={3}
                      />
                    </div>
                    
                    <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    <h2 className="text-xl font-semibold text-center">
                      {user?.displayName || 'Eco Enthusiast'}
                    </h2>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>Joined {new Date(user?.joinedDate || '2024-01-01').toLocaleDateString()}</span>
                      </div>
                      
                      {formData.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span>{formData.location}</span>
                        </div>
                      )}
                      
                      {formData.carbonGoal && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target size={16} />
                          <span>Goal: {formData.carbonGoal} kg CO₂/month</span>
                        </div>
                      )}
                    </div>
                    
                    {formData.bio && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{formData.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="text-green-600" size={20} />
                <span>Your Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Eco Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.action}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()} • {activity.category}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {activity.impact}
                      </Badge>
                      <p className="text-sm text-yellow-600 font-medium">{activity.points}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
