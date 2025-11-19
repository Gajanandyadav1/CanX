import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { differenceInDays } from "date-fns";

export default function LeaveForm({ employees, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    leave_type: 'Casual Leave',
    start_date: '',
    end_date: '',
    total_days: 0,
    reason: '',
    status: 'Pending',
  });

  const handleEmployeeChange = (empId) => {
    const employee = employees.find(e => e.employee_id === empId);
    setFormData({
      ...formData,
      employee_id: empId,
      employee_name: employee?.full_name || '',
    });
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const days = differenceInDays(new Date(end), new Date(start)) + 1;
    return days > 0 ? days : 0;
  };

  const handleDateChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    newData.total_days = calculateDays(
      field === 'start_date' ? value : formData.start_date,
      field === 'end_date' ? value : formData.end_date
    );
    setFormData(newData);
  };

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
          <Label htmlFor="leave_type">Leave Type *</Label>
          <Select
            value={formData.leave_type}
            onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Casual Leave">Casual Leave</SelectItem>
              <SelectItem value="Earned Leave">Earned Leave</SelectItem>
              <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
              <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
              <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleDateChange('start_date', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleDateChange('end_date', e.target.value)}
            required
          />
        </div>

        {formData.total_days > 0 && (
          <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-center">
              <span className="text-sm text-gray-600">Total Leave Days: </span>
              <span className="text-2xl font-bold text-[#007BFF]">{formData.total_days}</span>
            </p>
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="reason">Reason *</Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Please provide a reason for leave..."
            className="h-24"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#007BFF] hover:bg-[#0056b3]" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Submit Request
        </Button>
      </div>
    </form>
  );
}