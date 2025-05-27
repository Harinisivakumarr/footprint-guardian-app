
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Download, Calendar as CalendarIcon, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock report data
  const reports = [
    {
      id: 1,
      title: 'Monthly Carbon Report - January 2024',
      type: 'Monthly Summary',
      period: 'January 2024',
      totalEmissions: 45.2,
      reduction: 18.5,
      greenPoints: 325,
      generatedDate: '2024-02-01',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Weekly Progress Report - Week 4',
      type: 'Weekly Analysis',
      period: 'Jan 22-28, 2024',
      totalEmissions: 11.8,
      reduction: 22.3,
      greenPoints: 85,
      generatedDate: '2024-01-29',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Quarterly Review - Q4 2023',
      type: 'Quarterly Review',
      period: 'Oct-Dec 2023',
      totalEmissions: 158.7,
      reduction: 15.2,
      greenPoints: 890,
      generatedDate: '2024-01-02',
      status: 'completed'
    }
  ];

  // Mock chart data
  const monthlyTrendData = [
    { month: 'Aug', emissions: 62, target: 50 },
    { month: 'Sep', emissions: 58, target: 50 },
    { month: 'Oct', emissions: 54, target: 50 },
    { month: 'Nov', emissions: 49, target: 50 },
    { month: 'Dec', emissions: 46, target: 50 },
    { month: 'Jan', emissions: 42, target: 50 },
  ];

  const categoryBreakdown = [
    { category: 'Transport', jan: 18, dec: 22, change: -18 },
    { category: 'Energy', jan: 15, dec: 17, change: -12 },
    { category: 'Food', jan: 8, dec: 6, change: 33 },
    { category: 'Waste', jan: 3, dec: 4, change: -25 },
  ];

  const handleDownload = (reportId: number) => {
    console.log(`Downloading report ${reportId}`);
    // In a real app, this would generate and download a PDF
  };

  const handleGenerateReport = () => {
    console.log(`Generating ${selectedPeriod} report for ${selectedDate}`);
    // In a real app, this would trigger report generation
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Environmental Reports</h1>
        <p className="text-gray-600">Track your progress and download detailed impact reports</p>
      </div>

      {/* Report Generation */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="text-green-600" size={24} />
            <span>Generate New Report</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  <SelectItem value="yearly">Yearly Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Period End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleGenerateReport}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <FileText size={16} className="mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month's Emissions</p>
                <p className="text-2xl font-bold text-gray-900">42.3 kg CO₂</p>
                <p className="text-sm text-green-600">↓ 18% from last month</p>
              </div>
              <TrendingDown className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-blue-600">3 this month</p>
              </div>
              <FileText className="text-blue-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Target Achievement</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-purple-600">Above average</p>
              </div>
              <PieChart className="text-purple-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>6-Month Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
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

        <Card>
          <CardHeader>
            <CardTitle>Category Comparison (Jan vs Dec)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dec" fill="#94a3b8" name="December" />
                <Bar dataKey="jan" fill="#22c55e" name="January" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <span>Report History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <span className="text-sm text-gray-600">{report.period}</span>
                    <span className="text-sm text-gray-500">
                      Generated: {new Date(report.generatedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 mt-2 text-sm">
                    <span className="text-red-600">
                      {report.totalEmissions} kg CO₂ total
                    </span>
                    <span className="text-green-600">
                      {report.reduction}% reduction
                    </span>
                    <span className="text-yellow-600">
                      {report.greenPoints} points earned
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.id)}
                    className="flex items-center space-x-1"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
