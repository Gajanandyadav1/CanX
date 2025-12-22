import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { format, getDaysInMonth } from "date-fns";

export default function PayrollForm({ onSubmit, onCancel, isLoading }) {
  /* ================= STATE ================= */
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    month: format(new Date(), "yyyy-MM"),

    base_salary: 0,
    working_days: getDaysInMonth(new Date()),
    present_days: 0,
    leave_days: 0,
    total_ta: 0,

    bonus: 0,
    deductions: 0,
    gross_salary: 0,
    net_salary: 0,
    status: "Draft",
  });

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    fetch("https://api.canxinternational.in/api/v1/employees")
      .then((res) => res.json())
      .then((json) => {
        const list =
          json?.data?.employees || json?.data || [];
        setEmployees(list);
      })
      .catch(() => setEmployees([]));
  }, []);

  /* ================= EMPLOYEE CHANGE ================= */
  const handleEmployeeChange = (empId) => {
    const emp = employees.find((e) => e._id === empId);
    if (!emp) return;

    setFormData((prev) => ({
      ...prev,
      employee_id: empId,
      employee_name: emp.name || "",
      base_salary: emp.base_salary || 0,
    }));
  };

  /* ================= SALARY META API ================= */
  const getSalaryMeta = async (monthValue) => {
    if (!formData.employee_id || !monthValue) return;

    const [year, month] = monthValue.split("-");

    try {
      const res = await fetch(
        "https://api.canxinternational.in/api/v1/attendance/month/salary/slip/meta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: formData.employee_id,
            month: Number(month),
            year: Number(year),
          }),
        }
      );

      const result = await res.json();

      // ✅ CORRECT MAPPING (data.data)
      setFormData((prev) => ({
        ...prev,
        present_days: result?.data?.totalPresentDays || 0,
        leave_days: result?.data?.totalLeaveDays || 0,
        working_days:
          result?.data?.totalDaysInMonth || prev.working_days,
        total_ta: result?.data?.totalTravelAllowance || 0,
      }));
    } catch (error) {
      console.log("Salary Meta API Error:", error);
    }
  };

  /* ================= GROSS / NET ================= */
  useEffect(() => {
    const gross =
      (formData.base_salary || 0) +
      (formData.total_ta || 0) +
      (formData.bonus || 0);

    const net = gross - (formData.deductions || 0);

    setFormData((prev) => ({
      ...prev,
      gross_salary: gross,
      net_salary: net,
    }));
  }, [
    formData.base_salary,
    formData.total_ta,
    formData.bonus,
    formData.deductions,
  ]);

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      {/* Employee */}
      <div className="space-y-2">
        <Label>Employee *</Label>
        <Select
          value={formData.employee_id}
          onValueChange={handleEmployeeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp) => (
              <SelectItem key={emp._id} value={emp._id}>
                {emp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Salary Month */}
      <div className="space-y-2 w-50">
        <Label>Salary Month *</Label>
        <Input
          type="month"
          value={formData.month}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, month: value });
            getSalaryMeta(value); // ✅ API CALL
          }}
        />
      </div>

      {/* META INFO (EXISTING UI) */}
      <div className="grid grid-cols-2 gap-3 border-t pt-4">
        <div className="bg-gray-50 p-3 rounded">
          <p>Present Days</p>
          <b>{formData.present_days}</b>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p>Leave Days</p>
          <b>{formData.leave_days}</b>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p> Total Days In Month</p>
          <b>{formData.working_days}</b>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p>Travel Allowance</p>
          <b>₹{formData.total_ta}</b>
        </div>
      </div>

      {/* Salary */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <span>Base Salary</span>
          <b>₹{formData.base_salary}</b>
        </div>

        <Input
          type="number"
          placeholder="Bonus"
          value={formData.bonus}
          onChange={(e) =>
            setFormData({
              ...formData,
              bonus: Number(e.target.value) || 0,
            })
          }
        />

        <Input
          type="number"
          placeholder="Deductions"
          value={formData.deductions}
          onChange={(e) =>
            setFormData({
              ...formData,
              deductions: Number(e.target.value) || 0,
            })
          }
        />
{/* 
        <div className="flex justify-between bg-blue-100 p-3 rounded">
          <span>Gross Salary</span>
          <b>₹{formData.gross_salary}</b>
        </div>

        <div className="flex justify-between bg-green-100 p-3 rounded">
          <span>Net Salary</span>
          <b>₹{formData.net_salary}</b>
        </div> */}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Generate Payroll
        </Button>
      </div>
    </form>
  );
}
