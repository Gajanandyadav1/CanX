import React, { useState } from "react";
 import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// eslint-disable-next-line no-unused-vars
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
   });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance'],
   });

  const { data: travelLogs = [] } = useQuery({
    queryKey: ['travelLogs'],
   });

 

  // Month data
  const monthStart = selectedMonth + '-01';
  const monthEnd = format(endOfMonth(new Date(selectedMonth + '-01')), 'yyyy-MM-dd');
  
  // Attendance by department
  const deptAttendance = employees.reduce((acc, emp) => {
    const empAttendance = attendance.filter(a => 
      a.employee_id === emp.employee_id && 
      a.date >= monthStart && 
      a.date <= monthEnd &&
      a.status === 'Present'
    ).length;
    
    if (!acc[emp.department]) {
      acc[emp.department] = { total: 0, count: 0 };
    }
    acc[emp.department].total += empAttendance;
    acc[emp.department].count += 1;
    return acc;
  }, {});

  const deptData = Object.entries(deptAttendance).map(([name, data]) => ({
    name,
    attendance: data.count > 0 ? (data.total / data.count).toFixed(1) : 0
  }));

  // Travel analysis
  const travelByEmployee = {};
  travelLogs.filter(t => t.date >= monthStart && t.date <= monthEnd).forEach(log => {
    if (!travelByEmployee[log.employee_name]) {
      travelByEmployee[log.employee_name] = { km: 0, ta: 0 };
    }
    travelByEmployee[log.employee_name].km += log.total_km || 0;
    travelByEmployee[log.employee_name].ta += log.ta_amount || 0;
  });

  const travelData = Object.entries(travelByEmployee)
    .sort((a, b) => b[1].km - a[1].km)
    .slice(0, 10)
    .map(([name, data]) => ({
      name: name.split(' ')[0],
      km: data.km,
      ta: data.ta
    }));

  // Payroll trend (last 6 months)
//   const payrollTrend = [];
//   for (let i = 5; i >= 0; i--) {
//     const date = new Date();
//     date.setMonth(date.getMonth() - i);
//     const month = format(date, 'yyyy-MM');
//     const monthName = format(date, 'MMM');
//     const monthPayrolls = payrolls.filter(p => p.month === month);
//     const total = monthPayrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0);
//     payrollTrend.push({ month: monthName, total: total / 1000 });
//   }

  const COLORS = ['#007BFF', '#00C896', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-500 mt-1">Insights and data visualization</p>
        </div>
        <Button className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Month Selector */}
      <Card className="shadow-lg border-none">
        <CardContent className="p-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Attendance */}
        <Card className="shadow-lg border-none">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#007BFF]" />
              Attendance by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Bar dataKey="attendance" fill="#007BFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Travel Analysis */}
        <Card className="shadow-lg border-none">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#007BFF]" />
              Top Travelers (KM)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={travelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Bar dataKey="km" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payroll Trend */}
        {/* <Card className="shadow-lg border-none lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#007BFF]" />
              Payroll Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payrollTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" label={{ value: 'Amount (₹K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  formatter={(value) => `₹${value}K`}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#00C896" strokeWidth={3} dot={{ fill: '#00C896', r: 5 }} name="Total Salary" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Attendance This Month</h3>
            <p className="text-3xl font-bold text-[#007BFF]">
              {attendance.filter(a => a.date >= monthStart && a.date <= monthEnd && a.status === 'Present').length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Present days recorded</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Distance Traveled</h3>
            <p className="text-3xl font-bold text-purple-600">
              {travelLogs.filter(t => t.date >= monthStart && t.date <= monthEnd).reduce((sum, t) => sum + (t.total_km || 0), 0).toFixed(1)} km
            </p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total TA Disbursed</h3>
            <p className="text-3xl font-bold text-[#00C896]">
              ₹{travelLogs.filter(t => t.date >= monthStart && t.date <= monthEnd).reduce((sum, t) => sum + (t.ta_amount || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}