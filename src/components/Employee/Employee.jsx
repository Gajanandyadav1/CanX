/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, Building2, Mail, Phone, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
 import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import { Base_Url } from "@/config";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    // queryFn: () => base44.entities.Employee.list('-created_date'),
  });

  const createMutation = useMutation({
    // mutationFn: (data) => base44.entities.Employee.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowAddDialog(false);
    },
  });

  const updateMutation = useMutation({
    // mutationFn: ({ id, data }) => base44.entities.Employee.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowAddDialog(false);
      setSelectedEmployee(null);
    },
  });

  const filteredEmployees = employees.filter(emp =>
    emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowAddDialog(true);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsDialog(true);
  };

  const statusColors = {
    'Active': 'bg-green-100 text-green-700 border-green-200',
    'On Leave': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Inactive': 'bg-red-100 text-red-700 border-red-200',
  };


  const navigate = useNavigate(); 
const [departments, setDepartments] = useState([]);
const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);

const limit = 6; 
const [totalPages, setTotalPages] = useState(1);

const DepartmentGet = () => {
  try {
    fetch(`${Base_Url}api/v1/employees?page=${currentPage}&limit=${limit}`)
      .then((response) => response.json())
      .then((result) => {
        setDepartments(result.data.employees);
        setTotalPages(result.data.totalPages); // 👈 IMPORTANT FIX
      })
      .catch((error) => console.error(error));
  } catch (error) {
    console.log("Error fetching departments:", error);
  }
};

useEffect(() => {
  DepartmentGet();
}, [currentPage]);

// Search Filter
const filteredDepartments = departments.filter((item) =>
  item.name?.toLowerCase().includes(search.toLowerCase())
);

 
 
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-500 mt-1">Manage your workforce efficiently</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setShowAddDialog(true);
          }}
          className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-lg border-none">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, ID, or department..."
             value={search}
          onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-200 focus:ring-2 focus:ring-[#007BFF]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
 {/* Employee Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredDepartments?.map((employee) => (
    <Card key={employee.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none shadow-lg">
      <div className="h-24 bg-gradient-to-r from-[#007BFF] to-[#0056b3] relative">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
            {employee.profile_image ? (
              <img src={employee.profile_image} alt={employee.full_name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-[#007BFF]">
                {employee.name?.charAt(0) || 'E'}
              </span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="pt-16 pb-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.designation}</p>
          </div>

          <div className="space-y-2">
            {/* <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{employee.department}</span>
            </div> */}

            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 truncate">{employee.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{employee.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Badge className={`${statusColors[employee.status]} border px-3 py-1`}>
              {employee.status}
            </Badge>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/google/${employee._id}`)}
              >
                view locations
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(employee)}
              >
                <Eye className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(employee)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
<Pagination className="mt-6">
  <PaginationContent>

    {/* Previous */}
    <PaginationItem>
      <PaginationPrevious
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
      />
    </PaginationItem>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }).map((_, index) => (
      <PaginationItem key={index}>
        <PaginationLink
          onClick={() => setCurrentPage(index + 1)}
          isActive={currentPage === index + 1}
        >
          {index + 1}
        </PaginationLink>
      </PaginationItem>
    ))}

    {/* Next */}
    <PaginationItem>
      <PaginationNext
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
      />
    </PaginationItem>

  </PaginationContent>
</Pagination>



{/* EMPTY STATE WHEN NO DATA */}
{filteredDepartments.length === 0 && (
  <Card className="shadow-lg border-none mt-6">
    <CardContent className="p-12 text-center">
      <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-gray-500 text-lg">No employees found</p>
      <p className="text-gray-400 text-sm mt-2">
        Try adjusting your search or add a new employee
      </p>
    </CardContent>
  </Card>
)}


      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={selectedEmployee}
            onSubmit={(data) => {
              if (selectedEmployee) {
                updateMutation.mutate({ id: selectedEmployee.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowAddDialog(false);
              setSelectedEmployee(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              Employee Details
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeDetails
              employee={selectedEmployee}
              onEdit={() => {
                setShowDetailsDialog(false);
                handleEdit(selectedEmployee);
              }}
              onClose={() => {
                setShowDetailsDialog(false);
                setSelectedEmployee(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}