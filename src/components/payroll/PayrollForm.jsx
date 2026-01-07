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
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);

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

  /* ================= FETCH ALL EMPLOYEES (HANDLE API PAGINATION) ================= */
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setIsEmployeeLoading(true);

      let allEmployees = [];
      let page = 1;
      const limit = 100; // safe limit

      try {
        while (true) {
          const res = await fetch(
            `${Base_Url}api/v1/employees?page=${page}&limit=${limit}`
          );
          const json = await res.json();

          const list = json?.data?.employees || json?.data || [];

          allEmployees = [...allEmployees, ...list];

          // 🔥 last page condition
          if (list.length < limit) break;

          page++;
        }

        setEmployees(allEmployees);
      } catch (error) {
        console.log("Employee fetch error:", error);
        setEmployees([]);
      } finally {
        setIsEmployeeLoading(false);
      }
    };

    fetchAllEmployees();
  }, []);

  /* ================= SEARCH (FULL DATA) ================= */
  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchText.toLowerCase())
  );

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

      if (!res.ok) {
        throw new Error(
          data?.error?.explanation || data?.message || "Something went wrong"
        );
      }

      toast.success(data?.message || "Payroll generated successfully");

      setTimeout(() => {
        onCancel();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster position="top-right" />

      {/* ================= EMPLOYEE ================= */}
      <div className="space-y-2">
        <Label>Employee *</Label>

        <Select
          value={formData.employee_id}
          onValueChange={(value) =>
            setFormData({ ...formData, employee_id: value })
          }
        >
          <SelectTrigger
            className="w-full"
            onBlur={() => handleEmployeeChange(formData.employee_id)}
          >
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>

          <SelectContent className="w-full">
            {/* 🔍 SEARCH */}
            <div className="p-2 border-b">
              <Input
                placeholder={
                  isEmployeeLoading
                    ? "Loading employees..."
                    : "Search employee..."
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                disabled={isEmployeeLoading}
              />
            </div>

            {/* EMPLOYEE LIST */}
            {isEmployeeLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading employees...
              </div>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <SelectItem key={emp._id} value={emp._id}>
                  {emp.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No employee found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* ================= SALARY MONTH ================= */}
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

      {/* ================= META ================= */}
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

      {/* ================= SALARY ================= */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <span>Base Salary</span>
          <b>₹{formData.base_salary}</b>
        </div>

        <div>
          <Label>Bonus</Label>
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

        <div>
          <Label>Deductions</Label>
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

      {/* ================= BUTTONS ================= */}
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
