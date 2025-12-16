/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye, Building2, Mail, Phone, Calendar } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { Dialog,  DialogContent,  DialogHeader,  DialogTitle,}from "@/components/ui/dialog";   
import DepartmentForm from "./DepartmentForm";
import { Base_Url } from "@/config";

export default function Departments() {
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

  

  

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDepartments = async () => {
    const res = await fetch(
     `${Base_Url}api/v1/departments?page=${page}&name=${search}`
    );
    const data = await res.json();

    setDepartments(data.data.departments);
    setTotalPages(data.data.totalPages);
  };

  useEffect(() => {
    fetchDepartments();
  }, [page, search]);

  const filtered = departments.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

   
  

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments  </h2>
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
          Add Departments
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-lg border-none">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-gray-300"
        />
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
<div className="p-6 space-y-6">

  {/* Loading */}
  {isLoading && (
    <div className="flex justify-center items-center py-10">
      <p className="text-blue-600 font-semibold">Loading...</p>
    </div>
  )}

  {/* No Data */}
  {!isLoading && filtered.length === 0 && (
    <div className="flex justify-center items-center py-10">
      <p className="text-gray-500 font-semibold">No Data Found</p>
    </div>
  )}

  {/* Cards */}
  {!isLoading && filtered.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((item) => (
        <Card key={item._id} className="shadow-md border">
          <CardContent className="p-6">
            <h2 className="font-semibold text-xl">{item.name}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  )}

  {/* Pagination — hide when no data */}
  {!isLoading && filtered.length > 0 && (
    <Pagination className="mt-4">
      <PaginationContent>
        
        <PaginationItem>
          {page > 1 && (
            <PaginationPrevious onClick={() => setPage(page - 1)} />
          )}
        </PaginationItem>

        <PaginationItem className="px-3 font-medium">
          {page} / {totalPages}
        </PaginationItem>

        <PaginationItem>
          {page < totalPages && (
            <PaginationNext onClick={() => setPage(page + 1)} />
          )}
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )}

</div>


      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              {selectedEmployee ? 'Edit Deparment' : 'Add New Deparment'}
            </DialogTitle>
          </DialogHeader>
          <DepartmentForm
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

   
    </div>
  );
}
 