import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AttendanceForm({ employees, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    check_in_time: '',
    check_out_time: '',
    total_hours: 0,
    status: 'Present',
    notes: '',
  });

  const handleEmployeeChange = (empId) => {
    const employee = employees.find(e => e.employee_id === empId);
    setFormData({
      ...formData,
      employee_id: empId,
      employee_name: employee?.full_name || '',
    });
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const inTime = new Date(`2000-01-01 ${checkIn}`);
    const outTime = new Date(`2000-01-01 ${checkOut}`);
    const diff = (outTime - inTime) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  };

  const handleTimeChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    if (field === 'check_in_time' || field === 'check_out_time') {
      newData.total_hours = calculateHours(
        field === 'check_in_time' ? value : formData.check_in_time,
        field === 'check_out_time' ? value : formData.check_out_time
      );
    }
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
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Half Day">Half Day</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="check_in">Check In Time</Label>
          <Input
            id="check_in"
            type="time"
            value={formData.check_in_time}
            onChange={(e) => handleTimeChange('check_in_time', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check_out">Check Out Time</Label>
          <Input
            id="check_out"
            type="time"
            value={formData.check_out_time}
            onChange={(e) => handleTimeChange('check_out_time', e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any notes or comments..."
            className="h-20"
          />
        </div>

        {formData.total_hours > 0 && (
          <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Total Working Hours: {formData.total_hours.toFixed(2)} hours
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#007BFF] hover:bg-[#0056b3]" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Mark Attendance
        </Button>
      </div>
    </form>
  );
}