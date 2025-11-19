/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Base_Url } from "@/config";

export default function EmployeeForm({ employee, onSubmit, onCancel, isLoading }) {
 const [isLoading1, setIsLoading] = useState(false);

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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
 
    const phone = formData.phone.startsWith("+91")
      ? formData.phone
      : `+91${formData.phone}`;

    const emergency = formData.emergency_contact.startsWith("+91")
      ? formData.emergency_contact
      : `+91${formData.emergency_contact}`;

    const body = {
      empId: formData.employee_id,
      name: formData.full_name,
      email: formData.email,
      phone: phone,
      password: formData.password,
      department: formData.department,
      designation: formData.designation,
      joiningDate: formData.join_date,
      baseSalary: Number(formData.base_salary),
      address: formData.address,
      bankName: formData.bank_name,
      accountNumber: formData.bank_account,
      ifscCode: formData.ifsc_code,
      panNumber: formData.pan_number,
      emergencyContact: emergency,
    };

    try {
      const res = await fetch(`${Base_Url}api/v1/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success === true) {
        toast.success(data?.message);
        setFormData({
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
        });
      } else {
         toast.error(data?.error?.explanation);
      }
    } catch (error) {
      toast.error("Network Error!");
    }

    setIsLoading(false);
  };



   const [Departments, setDepartments] = useState([]);
     const [page, setPage] = useState(1);
  const fetchDepartments = async () => {
      const res = await fetch(
        `${Base_Url}api/v1/departments?page=${page}`
      );
      const data = await res.json();
  
      setDepartments(data.data.departments); 
      console.log(data.data.departments,`Departments`);
    };


    useEffect(() => {
      fetchDepartments();
    }, []);
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* FORM FIELDS SAME AS YOU GAVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label>Employee ID *</Label>
          <Input
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            placeholder="EMP001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Phone *</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="9876543210"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Password *</Label>
          <Input
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter Password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Address *</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter address"
            required
          />
        </div>

        {/* DEPARTMENT SELECT */}
        <div className="space-y-2">
          <Label>Department *</Label>
         <Select
  value={formData.department}
  onValueChange={(v) => setFormData({ ...formData, department: v })}
>
  <SelectTrigger>
    <SelectValue placeholder="Select department" />
  </SelectTrigger>

  <SelectContent>
    {Departments.map((dept) => (
      <SelectItem key={dept._id} value={dept._id}>
        {dept?.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        </div>

        <div className="space-y-2">
          <Label>Designation *</Label>
          <Input
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder="Software Engineer"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Join Date</Label>
          <Input
            type="date"
            value={formData.join_date}
            onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Base Salary (₹) *</Label>
          <Input
            type="number"
            value={formData.base_salary}
            onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
            placeholder="50000"
            required
          />
        </div>

      </div>

      {/* BANK AND KYC */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Bank & KYC Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              placeholder="HDFC Bank"
            />
          </div>

          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              value={formData.bank_account}
              onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              placeholder="1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label>IFSC Code</Label>
            <Input
              value={formData.ifsc_code}
              onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
              placeholder="HDFC0001234"
            />
          </div>

          <div className="space-y-2">
            <Label>PAN Number</Label>
            <Input
              value={formData.pan_number}
              onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
              placeholder="ABCDE1234F"
            />
          </div>

          <div className="space-y-2">
            <Label>Emergency Contact</Label>
            <Input
              value={formData.emergency_contact}
              onChange={(e) =>
                setFormData({ ...formData, emergency_contact: e.target.value })
              }
              placeholder="9876543210"
            />
          </div>

        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

        <Button type="submit" className="bg-[#007BFF]" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Add Employee
        </Button>
      </div>
    </form>
  );
}