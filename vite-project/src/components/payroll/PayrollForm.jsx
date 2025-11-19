import React, { useState, useEffect } from "react";
 import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { format, getDaysInMonth } from "date-fns";

export default function PayrollForm({ employees, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    month: format(new Date(), 'yyyy-MM'),
    base_salary: 0,
    working_days: getDaysInMonth(new Date()),
    present_days: 0,
    total_ta: 0,
    bonus: 0,
    deductions: 0,
    gross_salary: 0,
    net_salary: 0,
    status: 'Draft',
  });

  const { data: travelLogs = [] } = useQuery({
    queryKey: ['travelLogs'],
   });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance'],
   });

  const handleEmployeeChange = (empId) => {
    const employee = employees.find(e => e.employee_id === empId);
    if (!employee) return;

    // Calculate present days
    const monthStart = formData.month + '-01';
    const monthEnd = format(new Date(formData.month + '-' + getDaysInMonth(new Date(formData.month))), 'yyyy-MM-dd');
    const presentDays = attendance.filter(a => 
      a.employee_id === empId && 
      a.date >= monthStart && 
      a.date <= monthEnd &&
      a.status === 'Present'
    ).length;

    // Calculate total TA
    const totalTA = travelLogs
      .filter(t => t.employee_id === empId && t.date.startsWith(formData.month))
      .reduce((sum, t) => sum + (t.ta_amount || 0), 0);

    const baseSalary = employee.base_salary || 0;
    const gross = baseSalary + totalTA + (formData.bonus || 0);
    const net = gross - (formData.deductions || 0);

    setFormData({
      ...formData,
      employee_id: empId,
      employee_name: employee.full_name || '',
      base_salary: baseSalary,
      present_days: presentDays,
      total_ta: totalTA,
      gross_salary: gross,
      net_salary: net,
    });
  };

  useEffect(() => {
    const gross = (formData.base_salary || 0) + (formData.total_ta || 0) + (formData.bonus || 0);
    const net = gross - (formData.deductions || 0);
    setFormData(prev => ({
      ...prev,
      gross_salary: gross,
      net_salary: net,
    }));
  }, [formData.bonus, formData.deductions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="employee">Employee *</Label>
          <Select
            value={formData.employee_id}
            onValueChange={handleEmployeeChange}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="month">Salary Month *</Label>
          <Input
            id="month"
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Processed">Processed</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Salary Breakdown</h3>
        
        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Working Days</p>
            <p className="text-lg font-bold">{formData.working_days}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Present Days</p>
            <p className="text-lg font-bold text-green-600">{formData.present_days}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Base Salary</span>
            <span className="font-semibold">₹{formData.base_salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-gray-700">Travel Allowance</span>
            <span className="font-semibold text-green-600">+₹{formData.total_ta.toLocaleString()}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bonus">Bonus</Label>
            <Input
              id="bonus"
              type="number"
              value={formData.bonus}
              onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductions">Deductions (Tax, etc.)</Label>
            <Input
              id="deductions"
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg">
            <span className="font-semibold text-gray-800">Gross Salary</span>
            <span className="text-xl font-bold text-[#007BFF]">₹{formData.gross_salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
            <span className="font-semibold text-gray-800">Net Salary</span>
            <span className="text-2xl font-bold text-[#00C896]">₹{formData.net_salary.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#007BFF] hover:bg-[#0056b3]" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Generate Payroll
        </Button>
      </div>
    </form>
  );
}