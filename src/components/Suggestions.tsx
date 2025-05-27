
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, Brain, Sparkles } from 'lucide-react';

const Suggestions = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock conversation history
  const conversationHistory = [
    {
      id: 1,
      query: "How can I reduce my home energy consumption?",
      response: "Here are some effective ways to reduce your home energy consumption:\n\n1. **Switch to LED bulbs** - They use 75% less energy than incandescent bulbs\n2. **Unplug electronics** when not in use to avoid phantom loads\n3. **Use a programmable thermostat** to optimize heating and cooling\n4. **Seal air leaks** around windows and doors\n5. **Upgrade to Energy Star appliances** when replacing old ones\n\nThese changes could save you 15-30% on your energy bills while reducing your carbon footprint!",
      category: "Energy",
      timestamp: "2024-01-25 14:30",
      impact: "high"
    },
    {
      id: 2,
      query: "What are some eco-friendly transportation options?",
      response: "Great question! Here are sustainable transportation alternatives:\n\n🚲 **Cycling** - Zero emissions and great exercise\n🚌 **Public Transit** - Reduces per-person emissions significantly\n🚗 **Electric Vehicles** - Much lower lifetime emissions\n👥 **Carpooling** - Share rides to reduce individual impact\n🚶 **Walking** - For short distances, it's the greenest option\n\nEven replacing just one car trip per week with these alternatives can reduce your annual CO₂ emissions by 500+ kg!",
      category: "Transport",
      timestamp: "2024-01-24 10:15",
      impact: "high"
    },
    {
      id: 3,
      query: "Best practices for composting at home?",
      response: "Composting is an excellent way to reduce waste! Here's how to get started:\n\n✅ **Browns (Carbon)**: Dry leaves, paper, cardboard\n✅ **Greens (Nitrogen)**: Kitchen scraps, grass clippings\n❌ **Avoid**: Meat, dairy, oils, pet waste\n\n**Steps:**\n1. Choose a bin or designated area\n2. Layer browns and greens (3:1 ratio)\n3. Keep moist but not soggy\n4. Turn regularly for aeration\n5. Harvest rich compost in 3-6 months\n\nThis diverts organic waste from landfills, reducing methane emissions!",
      category: "Waste",
      timestamp: "2024-01-23 16:45",
      impact: "medium"
    }
  ];

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const mockResponse = generateMockResponse(query);
      setSuggestions([mockResponse, ...suggestions]);
      setQuery('');
      setIsLoading(false);
    }, 2000);
  };

  const generateMockResponse = (userQuery: string) => {
    const responses = {
      food: "For sustainable eating, consider:\n\n🌱 **Plant-based meals** 2-3 times per week\n🥬 **Local & seasonal** produce\n🐟 **Sustainable seafood** choices\n♻️ **Reduce food waste** by meal planning\n🥡 **Avoid single-use packaging**\n\nThese changes can reduce your food-related emissions by 20-30%!",
      plastic: "To reduce plastic usage:\n\n🛍️ **Reusable bags** for shopping\n💧 **Metal water bottles** instead of plastic\n🥤 **Glass containers** for food storage\n🧴 **Refillable products** when possible\n📦 **Bulk buying** to reduce packaging\n\nSmall changes add up to prevent hundreds of plastic items from entering waste streams!",
      default: "Here are some personalized eco-friendly suggestions based on your query:\n\n• Start with small, manageable changes\n• Focus on areas with the highest impact\n• Track your progress to stay motivated\n• Consider your lifestyle and budget\n• Connect with others for support and ideas\n\nEvery action counts toward a more sustainable future! 🌍"
    };

    let category = "General";
    let response = responses.default;

    if (userQuery.toLowerCase().includes('food') || userQuery.toLowerCase().includes('eat')) {
      response = responses.food;
      category = "Food";
    } else if (userQuery.toLowerCase().includes('plastic') || userQuery.toLowerCase().includes('waste')) {
      response = responses.plastic;
      category = "Waste";
    }

    return {
      id: Date.now(),
      query: userQuery,
      response,
      category,
      timestamp: new Date().toLocaleString(),
      impact: "medium"
    };
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const quickPrompts = [
    "How to reduce plastic waste?",
    "Sustainable food choices",
    "Energy-efficient home tips",
    "Eco-friendly travel options",
    "Water conservation methods",
    "Green shopping habits"
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Eco Suggestions</h1>
        <p className="text-gray-600">Get personalized environmental advice powered by AI</p>
      </div>

      {/* Query Input */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="text-blue-600" size={24} />
            <span>Ask for Eco Advice</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask me anything about reducing your environmental impact... e.g., 'How can I make my daily commute more eco-friendly?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="focus:ring-blue-500 focus:border-blue-500"
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              💡 Be specific for more personalized suggestions
            </p>
            <Button 
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Get Suggestions
                </>
              )}
            </Button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(prompt)}
                  className="text-xs hover:bg-blue-50 hover:border-blue-300"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="text-green-600" size={20} />
              <span>Your Recent Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">"{suggestion.query}"</h3>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{suggestion.category}</Badge>
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {suggestion.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{suggestion.response}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{suggestion.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="text-purple-600" size={20} />
            <span>Previous Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {conversationHistory.map((conversation) => (
              <div key={conversation.id} className="border-l-4 border-purple-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">"{conversation.query}"</h3>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{conversation.category}</Badge>
                    <Badge className={getImpactColor(conversation.impact)}>
                      {conversation.impact} impact
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{conversation.response}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">{conversation.timestamp}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suggestions;
