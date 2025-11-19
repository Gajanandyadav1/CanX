import React, { useState } from "react";
 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Wallet, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PayrollForm from "./PayrollForm";
 
export default function Payroll() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const queryClient = useQueryClient();

  const { data: payrolls = [] } = useQuery({
    queryKey: ['payrolls'],
   });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
   });

  const createMutation = useMutation({
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      setShowAddDialog(false);
    },
  });

  const monthPayrolls = payrolls.filter(p => p.month === selectedMonth);
  const totalGross = monthPayrolls.reduce((sum, p) => sum + (p.gross_salary || 0), 0);
  const totalNet = monthPayrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0);
  const totalDeductions = monthPayrolls.reduce((sum, p) => sum + (p.deductions || 0), 0);

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-700',
    'Processed': 'bg-blue-100 text-blue-700',
    'Paid': 'bg-green-100 text-green-700',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-gray-500 mt-1">Process and manage employee salaries</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Payroll
          </Button>
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gross Salary</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalGross.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{monthPayrolls.length} employees</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="w-6 h-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Net Salary</p>
                <p className="text-3xl font-bold text-[#00C896]">₹{totalNet.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">after deductions</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#00C896]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-3xl font-bold text-red-600">₹{totalDeductions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">taxes & other</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll List */}
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b">
          <CardTitle>Payroll Records - {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TA</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bonus</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthPayrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center text-white font-semibold">
                          {payroll.employee_name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payroll.employee_name}</p>
                          <p className="text-sm text-gray-500">{payroll.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{payroll.base_salary?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">+₹{payroll.total_ta?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">+₹{payroll.bonus?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">-₹{payroll.deductions?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 font-bold text-[#007BFF] text-lg">₹{payroll.net_salary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[payroll.status]}>
                        {payroll.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {monthPayrolls.length === 0 && (
              <div className="p-12 text-center">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No payroll records for this month</p>
                <p className="text-gray-400 text-sm mt-2">Click "Generate Payroll" to create records</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              Generate Payroll
            </DialogTitle>
          </DialogHeader>
          <PayrollForm
            employees={employees}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}