import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Check, X } from "lucide-react";
import { format } from "date-fns";

export default function LeaveDetails({ leave, onApprove, onReject, onClose }) {
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 pb-6 border-b">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {leave.employee_name?.charAt(0) || 'E'}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{leave.employee_name}</h3>
          <p className="text-gray-600 mt-1">{leave.employee_id}</p>
          <Badge className={`${statusColors[leave.status]} mt-2`}>
            {leave.status}
          </Badge>
        </div>
      </div>

      {/* Leave Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#007BFF]" />
            Leave Information
          </h4>
          <div className="space-y-3 pl-7">
            <div>
              <p className="text-sm text-gray-500">Leave Type</p>
              <p className="font-medium">{leave.leave_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{format(new Date(leave.start_date), 'dd MMMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{format(new Date(leave.end_date), 'dd MMMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Days</p>
              <p className="font-medium text-[#007BFF] text-xl">{leave.total_days} days</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#007BFF]" />
            Additional Details
          </h4>
          <div className="space-y-3 pl-7">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{leave.status}</p>
            </div>
            {leave.approved_by && (
              <div>
                <p className="text-sm text-gray-500">Approved/Rejected By</p>
                <p className="font-medium">{leave.approved_by}</p>
              </div>
            )}
            {leave.remarks && (
              <div>
                <p className="text-sm text-gray-500">Remarks</p>
                <p className="font-medium">{leave.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2 pt-6 border-t">
        <h4 className="font-semibold text-gray-900">Reason for Leave</h4>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{leave.reason}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {leave.status === 'Pending' ? (
          <>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={onReject}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
}