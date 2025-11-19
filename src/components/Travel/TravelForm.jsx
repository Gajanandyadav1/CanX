import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function TravelForm({ employees, taPerKm, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    total_km: 0,
    ta_amount: 0,
    start_location: '',
    end_location: '',
    purpose: '',
  });

  const handleEmployeeChange = (empId) => {
    const employee = employees.find(e => e.employee_id === empId);
    setFormData({
      ...formData,
      employee_id: empId,
      employee_name: employee?.full_name || '',
    });
  };

  const handleKmChange = (km) => {
    const kmValue = parseFloat(km) || 0;
    setFormData({
      ...formData,
      total_km: kmValue,
      ta_amount: kmValue * taPerKm,
    });
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
          <Label htmlFor="total_km">Total Distance (KM) *</Label>
          <Input
            id="total_km"
            type="number"
            step="0.1"
            value={formData.total_km}
            onChange={(e) => handleKmChange(e.target.value)}
            placeholder="0.0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_location">Start Location</Label>
          <Input
            id="start_location"
            value={formData.start_location}
            onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
            placeholder="Starting point"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_location">End Location</Label>
          <Input
            id="end_location"
            value={formData.end_location}
            onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
            placeholder="Destination"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="Client visit, meeting, etc."
            className="h-20"
          />
        </div>

        <div className="md:col-span-2 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-2xl font-bold text-purple-600">{formData.total_km} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rate</p>
              <p className="text-2xl font-bold text-orange-600">₹{taPerKm}/km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">TA Amount</p>
              <p className="text-2xl font-bold text-[#00C896]">₹{formData.ta_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#007BFF] hover:bg-[#0056b3]" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Add Travel Log
        </Button>
      </div>
    </form>
  );
}