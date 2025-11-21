import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, Calendar, MapPin, CreditCard, Edit } from "lucide-react";
import { format } from "date-fns";
import { Image_Url } from "@/config";

export default function EmployeeDetails({ employee, onEdit, onClose }) {
 const statusColors = {
  ACTIVE: "bg-green-500 text-white",
  INACTIVE: "bg-red-500 text-white",
  RESIGNED: "bg-yellow-500 text-white",
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 pb-6 border-b">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {employee.profile ? (
    <img
      src={`${Image_Url}${employee.profile}`}
      alt={employee.name}
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    <span className="text-3xl font-bold text-white">
      {employee.name?.charAt(0) || "E"}
    </span>
  )}

        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
          <p className="text-gray-600 mt-1">{employee.designation}</p>
         <Badge className={`${statusColors[employee.status]} mt-2 px-3 py-1`}>
  {employee.status}
</Badge>

        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#007BFF]" />
            Professional Details
          </h4>
          <div className="space-y-3 pl-7">
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium">{employee.empId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{employee.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="font-medium">
                {employee.joiningDate ? format(new Date(employee.joiningDate), 'dd MMM yyyy') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Base Salary</p>
              <p className="font-medium text-[#007BFF]">₹{employee.baseSalary?.toLocaleString()}</p>
            </div>
          
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#007BFF]" />
            Contact Information
          </h4>
          <div className="space-y-3 pl-7">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{employee.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="font-medium">{employee.emergencyContact || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{employee.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-4 pt-6 border-t">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#007BFF]" />
          Bank & KYC Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
          <div>
            <p className="text-sm text-gray-500">Bank Name</p>
            <p className="font-medium">{employee.bankName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="font-medium">{employee.accountNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">IFSC Code</p>
            <p className="font-medium">{employee.ifscCode || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PAN Number</p>
            <p className="font-medium">{employee.panNumber || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit} className="bg-[#007BFF] hover:bg-[#0056b3]">
          <Edit className="w-4 h-4 mr-2" />
          Edit Employee
        </Button>
      </div>
    </div>
  );
}