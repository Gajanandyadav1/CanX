/* eslint-disable no-unused-vars */
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
import { toast, Toaster } from "sonner";
import { Base_Url } from "@/config";

export default function PayrollForm({ onCancel }) {
  /* ================= STATE ================= */
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

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
  const LIMIT = 10;

  /* ================= FETCH EMPLOYEES ================= */
useEffect(() => {
  fetch(`${Base_Url}api/v1/employees?page=${page}&limit=${LIMIT}`)
    .then((res) => res.json())
    .then((json) => {
      const list = json?.data?.employees || json?.data || [];
      setEmployees(list);
    })
    .catch(() => setEmployees([]));
}, [page]); // ✅ page dependency


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
        `${Base_Url}api/v1/attendance/month/salary/slip/meta`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: formData.employee_id,
            month: Number(month),
            year: Number(year),
          }),
        }
      );

      const result = await res.json();

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
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const payload = {
      employeeId: formData.employee_id,
      month: Number(formData.month.split("-")[1]),
      year: Number(formData.month.split("-")[0]),
      bonus: formData.bonus,
      deductions: formData.deductions,
    };

    const res = await fetch(
      "https://api.canxinternational.in/api/v1/slips",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    // ❌ if API failed
    if (!res.ok) {
      throw new Error(
        data?.error?.explanation || data?.message || "Something went wrong"
      );
    }

    // ✅ SUCCESS
    toast.success(data?.message || "Payroll generated successfully");

    // ✅ 1 sec delay then close
    setTimeout(() => {
      onCancel();
    }, 1000);
  } catch (error) {
    // ✅ API ERROR MESSAGE SHOW HERE
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TOASTER */}
      <Toaster position="top-right" />

      {/* Employee */}
      <div className="space-y-2">
        <Label>Employee *</Label>
        <Select className="w-full"
  value={formData.employee_id}
  onValueChange={(value) =>
    setFormData({ ...formData, employee_id: value })
  }
  style={{ width: "100%" }}
>
  <SelectTrigger className="w-full p-2" onBlur={() => handleEmployeeChange(formData.employee_id)}>
    <SelectValue placeholder="Select employee" />
  </SelectTrigger>

  <SelectContent className="w-full">
    {/* EMPLOYEES */}
    {employees.map((emp) => (
      <SelectItem key={emp._id} value={emp._id}>
        {emp.name}
      </SelectItem>
    ))}

    {/* PAGINATION INSIDE */}
   <div
  className="flex justify-between items-center px-3 py-2 mt-2 rounded-md"
  style={{
    background: "#2563eb", // 🔵 Blue
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.5)",
    color: "#fff",
  }}
>
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        style={{ fontSize: 12 }}
      >
        Prev
      </button>

      <span style={{ fontSize: 12 }}>Page {page}</span>

      <button
        disabled={employees.length < LIMIT} // ✅ MAIN LOGIC
        onClick={() => setPage(page + 1)}
        style={{ fontSize: 12 }}
      >
        Next
      </button>
    </div>
  </SelectContent>
</Select>

      </div>

      {/* Month */}
      <div className="space-y-2">
        <Label>Salary Month *</Label>
        <Input
          type="month"
          value={formData.month}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, month: value });
            getSalaryMeta(value);
          }}
        />
      </div>

      {/* Meta */}
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
          <p>Total Days</p>
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

        {/* Bonus */}
        <div>
          <Label className="pb-2">Bonus</Label>
          <Input
            type="number"
            value={formData.bonus === 0 ? "" : formData.bonus}
            onChange={(e) =>
              setFormData({
                ...formData,
                bonus: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        </div>

        {/* Deductions */}
        <div>
          <Label className="pb-2">Deductions</Label>
          <Input
            type="number"
            value={formData.deductions === 0 ? "" : formData.deductions}
            onChange={(e) =>
              setFormData({
                ...formData,
                deductions:
                  e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        </div>
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
