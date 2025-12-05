import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CalendarClock, Check, X } from "lucide-react";
import { Base_Url } from "@/config";
import { toast } from "sonner";

export default function LeaveManagement() {
  
  const [showModal, setShowModal] = useState(false);
  const [leaves, setLeaves] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ⭐ Modal State (Default Approved)
  const [updateData, setUpdateData] = useState({
    leaveId: "", employee: "",  status: "Approved",  response: "", });

  // ⭐ Fetch Leaves
  const getLeaves = async () => {
    try {
      const res = await fetch(`${Base_Url}api/v1/leaves/admin?page=${page}`);
      const data = await res.json();
      setLeaves(data?.data?.leaves || []);
      setTotalPages(data?.data?.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };



  // ⭐ Update Status API (fallback Approved)
  const updateLeaveStatus = async () => {

    const finalStatus = updateData.status || "Approved";

    try {
      const res = await fetch(`${Base_Url}api/v1/leaves`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveId: updateData.leaveId,
          employee: updateData.employee,
          status: finalStatus,
          response: updateData.response
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data?.message);
        getLeaves();
        setShowModal(false);
      } else {
        toast.error(data.message || "Update failed ❌");
      }

    } catch (error) {
      toast.error("Network error!");
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaves();
  }, [page]);

  return (
    <div className="p-6 space-y-6">
      
      {/* ---- Header ---- */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Leave Request
        </Button>
      </div>

      {/* ---- Leave Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaves.map((leave) => (
          <Card
            key={leave._id}
            className={`rounded-xl py-1 border-2 shadow-md hover:shadow-xl transition cursor-pointer ${
              leave.status === "Approved"
                ? "border-green-500"
                : leave.status === "Rejected"
                ? "border-red-500"
                : "border-yellow-500"
            }`}
          >
            <CardContent className="p-6">
              
              {/* Header */}
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {leave.employee?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-lg">{leave.employee?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()} →{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {leave.status === "Approved" && <Check className="text-green-600" />}
                {leave.status === "Rejected" && <X className="text-red-600" />}
                {leave.status === "Pending" && <CalendarClock className="text-yellow-500" />}
              </div>

              {/* Body */}
              <div className="mt-4 ml-16 space-y-2">
                <p className="text-sm"><strong>Type:</strong> {leave.type}</p>
                <p className="text-sm"><strong>Reason:</strong> {leave.reason}</p>
              </div>

              {/* Status + Button */}
              <div className="ml-16 mt-4 flex items-center gap-4">

                <span
                  className={`px-3 py-1 text-xs rounded font-bold ${
                    leave.status === "Approved"
                      ? "bg-green-200 text-green-700"
                      : leave.status === "Rejected"
                      ? "bg-red-200 text-red-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {leave.status}
                </span>

                {/* Only Pending show Change Button */}
                {leave.status === "Pending" && (
                  <button
                    onClick={() => {
                      setUpdateData({
                        leaveId: leave._id,
                        employee: leave.employee._id,
                        status: "Approved", // ALWAYS DEFAULT
                        response: "",
                      });
                      setShowModal(true);
                    }}
                    className="text-xs bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
                  >
                    Change Status
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* ---- Pagination ---- */}
      <div className="flex justify-center gap-2 mt-6">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded border ${
              page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>


      {/* ---- Modal ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-80 p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg text-gray-900">Update Status</h2>

            <select
              className="w-full p-2 border rounded"
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
            >
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </select>


            <textarea
              className="w-full p-2 border rounded h-20"
              placeholder="Write comment..."
              value={updateData.response}
              onChange={(e) => setUpdateData({ ...updateData, response: e.target.value })}
            ></textarea>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={updateLeaveStatus}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
