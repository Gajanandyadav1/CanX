/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Base_Url } from "@/config";

export default function EmployeeForm({ employee, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ Keep at top
  const [Departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    join_date: "",
    base_salary: "",
    address: "",
    bank_name: "",
    bank_account: "",
    ifsc_code: "",
    pan_number: "",
    emergency_contact: "",
    password: "",
    profile: null,
  });

  // ⭐ Helper to show department name in Select
  const getDepartmentName = (id) => {
    const dept = Departments.find((d) => d._id === id);
    return dept ? dept.name : "";
  };

  // ⭐ Auto-fill edit form
  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.empId || "",
        full_name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone?.replace("+91", "") || "",
        department: employee.department || "",
        designation: employee.designation || "",
        join_date: employee.joiningDate?.slice(0, 10) || "",
        base_salary: employee.baseSalary || "",
        address: employee.address || "",
        bank_name: employee.bankName || "",
        bank_account: employee.accountNumber || "",
        ifsc_code: employee.ifscCode || "",
        pan_number: employee.panNumber || "",
        emergency_contact:
          employee.emergencyContact?.replace("+91", "") || "",
        password: "",
        profile: null,
      });
    }
  }, [employee]);

  // ⭐ Auto-select department after Departments arrive
  useEffect(() => {
    if (employee && Departments.length > 0) {
      setFormData((prev) => ({
        ...prev,
        department: employee.department,
      }));
    }
  }, [Departments]);

  // ⭐ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const phone = formData.phone.startsWith("+91")
      ? formData.phone
      : `+91${formData.phone}`;

    const emergency = formData.emergency_contact.startsWith("+91")
      ? formData.emergency_contact
      : `+91${formData.emergency_contact}`;

    // ⭐ UPDATE mode
    if (employee?._id) {
      const raw = JSON.stringify({
        id: employee._id,
        name: formData.full_name,
        email: formData.email,
        phone: phone,
        department: formData.department,
        designation: formData.designation,
        joiningDate: formData.join_date,
        baseSalary: formData.base_salary,
        address: formData.address,
        bankName: formData.bank_name,
        accountNumber: formData.bank_account,
        ifscCode: formData.ifsc_code,
        panNumber: formData.pan_number,
        emergencyContact: emergency,
      });

      try {
        const res = await fetch(`${Base_Url}api/v1/employees/details/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: raw,
        });

        const data = await res.json();

        if (data.success) {
          toast.success(data?.message);
          onCancel();
          DepartmentGet();
        } else {
          toast.error(data?.error?.explanation);
        }
      } catch (error) {
        toast.error("Network Error");
      }

      setIsLoading(false);
      return;
    }

    // ⭐ ADD MODE
    const formdata = new FormData();
    formdata.append("empId", formData.employee_id);
    formdata.append("name", formData.full_name);
    formdata.append("email", formData.email);
    formdata.append("phone", phone);
    formdata.append("password", formData.password);
    formdata.append("department", formData.department);
    formdata.append("designation", formData.designation);
    formdata.append("joiningDate", formData.join_date);
    formdata.append("baseSalary", formData.base_salary);
    formdata.append("address", formData.address);
    formdata.append("bankName", formData.bank_name);
    formdata.append("accountNumber", formData.bank_account);
    formdata.append("ifscCode", formData.ifsc_code);
    formdata.append("panNumber", formData.pan_number);
    formdata.append("emergencyContact", emergency);

    if (formData.profile) {
      formdata.append("profile", formData.profile);
    }

    try {
      const res = await fetch(`${Base_Url}api/v1/employees`, {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();

      if (data.success === true) {
        toast.success(data?.message);
        DepartmentGet();
        setTimeout(() => onCancel(), 1500);
      } else {
        toast.error(data?.error?.explanation);
      }
    } catch (error) {
      toast.error("Network Error!");
    }

    setIsLoading(false);
  };

  // ⭐ Fetch department list
const fetchDepartments = async () => {
  const res = await fetch(`${Base_Url}api/v1/departments?page=${page}`);
  const data = await res.json();
  setDepartments(data.data.departments);
};
useEffect(() => {
  fetchDepartments();
}, []);


  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);

  const DepartmentGet = () => {
    try {
      fetch(`${Base_Url}api/v1/employees?page=${currentPage}&limit=${limit}`)
        .then((response) => response.json())
        .then((result) => {
         if(result.success === true){
           setDepartments(result.data.employees);
          setTotalPages(result.data.totalPages);
         }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    DepartmentGet();
  }, [currentPage]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Employee ID */}
        <div className="space-y-2">
          <Label>Employee ID *</Label>
          <Input
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
            placeholder="EMP001"
            required={!employee}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="Enter Name"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>Phone *</Label>
          <Input
            value={formData.phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setFormData({ ...formData, phone: value });
              }
            }}
            placeholder="Enter Phone Number"
            required
          />
        </div>

        {/* Password (only add) */}
        {!employee && (
          <div className="space-y-2">
            <Label>Password *</Label>
            <Input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter Password"
              required
            />
          </div>
        )}

        {/* Address */}
        <div className="space-y-2">
          <Label>Address *</Label>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Enter address"
            required
          />
        </div>

        {/* ⭐ Department Dropdown (Fixed Width + Name Display) */}
        <div className="space-y-2">
          <Label>Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(v) =>
              setFormData({ ...formData, department: v })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {formData.department
                  ? getDepartmentName(formData.department)
                  : "Select department"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {Departments.map((dept) => (
                <SelectItem key={dept._id} value={dept._id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label>Designation *</Label>
          <Input
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
            placeholder="Enter Designation"
            required
          />
        </div>

        {/* Join Date */}
        <div className="space-y-2">
          <Label>Join Date</Label>
          <Input
            type="date"
            value={formData.join_date}
            onChange={(e) =>
              setFormData({ ...formData, join_date: e.target.value })
            }
          />
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <Label>Base Salary (₹) *</Label>
          <Input
            type="number"
            value={formData.base_salary}
            onChange={(e) =>
              setFormData({ ...formData, base_salary: e.target.value })
            }
            placeholder="50000"
            required
          />
        </div>

        {/* Profile only add mode */}
        {!employee && (
          <div className="space-y-2">
            <Label>Upload Profile Photo *</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, profile: e.target.files[0] })
              }
              required={!employee}
            />
          </div>
        )}
      </div>

      {/* Bank Section */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Bank & KYC Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input
              value={formData.bank_name}
              onChange={(e) =>
                setFormData({ ...formData, bank_name: e.target.value })
              }
              placeholder="HDFC Bank"
            />
          </div>

          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              value={formData.bank_account}
              maxLength={18}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 18) {
                  setFormData({ ...formData, bank_account: value });
                }
              }}
              placeholder="Enter Account Number"
            />
          </div>

          <div className="space-y-2">
            <Label>IFSC Code</Label>
            <Input
              value={formData.ifsc_code}
              onChange={(e) =>
                setFormData({ ...formData, ifsc_code: e.target.value })
              }
              placeholder="Enter IFSC Code"
            />
          </div>

          <div className="space-y-2">
            <Label>PAN Number</Label>
            <Input
              value={formData.pan_number}
              maxLength={10}
              onChange={(e) => {
                let value = e.target.value.toUpperCase();
                setFormData({ ...formData, pan_number: value });
              }}
              placeholder="Enter PAN Number"
            />
          </div>

          <div className="space-y-2">
            <Label>Emergency Contact</Label>
            <Input
              value={formData.emergency_contact}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setFormData({ ...formData, emergency_contact: value });
                }
              }}
              placeholder="Enter Emergency Contact"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" className="bg-[#007BFF]" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {employee ? "Update Employee" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
}
