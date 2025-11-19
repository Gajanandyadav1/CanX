/* eslint-disable no-unused-vars */
import React, { useState } from "react";
 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarClock, Check, X } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeaveForm from "./LeaveForm";
import LeaveDetails from "./LeaveDetails";
 

export default function LeaveManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const queryClient = useQueryClient();

  const { data: leaves = [] } = useQuery({
    queryKey: ['leaves'],
   });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
   });

  const createMutation = useMutation({
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      setShowAddDialog(false);
    },
  });

  const updateMutation = useMutation({
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      setSelectedLeave(null);
    },
  });

  const handleApprove = (leave) => {
    updateMutation.mutate({
      id: leave.id,
      data: { ...leave, status: 'Approved', approved_by: 'Admin' }
    });
  };

  const handleReject = (leave) => {
    updateMutation.mutate({
      id: leave.id,
      data: { ...leave, status: 'Rejected', approved_by: 'Admin' }
    });
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Approved': 'bg-green-100 text-green-700 border-green-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
  };

  const leaveTypeColors = {
    'Sick Leave': 'bg-red-50',
    'Casual Leave': 'bg-blue-50',
    'Earned Leave': 'bg-green-50',
    'Maternity Leave': 'bg-purple-50',
    'Paternity Leave': 'bg-indigo-50',
    'Unpaid Leave': 'bg-gray-50',
  };

  const stats = {
    pending: leaves.filter(l => l.status === 'Pending').length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-500 mt-1">Manage employee leave requests</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leave Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-yellow-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <CalendarClock className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests */}
      <div className="grid grid-cols-1 gap-4">
        {leaves.map((leave) => (
          <Card 
            key={leave.id} 
            className={`${leaveTypeColors[leave.leave_type] || 'bg-white'} border-none shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
            onClick={() => setSelectedLeave(leave)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center text-white font-bold text-xl">
                    {leave.employee_name?.charAt(0) || 'E'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{leave.employee_name}</h3>
                    <p className="text-sm text-gray-600">{leave.employee_id}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {leave.leave_type}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {format(new Date(leave.start_date), 'dd MMM')} - {format(new Date(leave.end_date), 'dd MMM yyyy')}
                      </span>
                      <span className="text-sm font-semibold text-[#007BFF]">
                        {leave.total_days} days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`${statusColors[leave.status]} border px-4 py-2`}>
                    {leave.status}
                  </Badge>
                  
                  {leave.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(leave);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(leave);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {leave.reason && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Reason:</p>
                  <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {leaves.length === 0 && (
          <Card className="shadow-lg border-none">
            <CardContent className="p-12 text-center">
              <CalendarClock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No leave requests yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Leave Request" to create one</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              Add Leave Request
            </DialogTitle>
          </DialogHeader>
          <LeaveForm
            employees={employees}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              Leave Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <LeaveDetails
              leave={selectedLeave}
              onApprove={() => {
                handleApprove(selectedLeave);
                setSelectedLeave(null);
              }}
              onReject={() => {
                handleReject(selectedLeave);
                setSelectedLeave(null);
              }}
              onClose={() => setSelectedLeave(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}