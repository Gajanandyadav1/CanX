/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import PayrollForm from "./PayrollForm";
import { Base_Url, Image_Url } from "@/config";

// --------------------- FETCH PAYROLLS ---------------------
const fetchPayrolls = async ({ queryKey }) => {
  const [_key, { page, limit, month }] = queryKey;
  let url = `${Base_Url}api/v1/slips?page=${page}&limit=${limit}`;
  if (month) {
    const [year, m] = month.split("-");
    url += `&month=${m}&year=${year}`;
  }
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to fetch payrolls");
  return json.data;
};

// --------------------- STATUS MODAL COMPONENT ---------------------
function StatusModal({ payroll, open, onClose }) {
  const [status, setStatus] = useState(payroll?.status || "Draft");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${Base_Url}api/v1/slips/status/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: payroll._id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update status");

      toast.success(data?.message || "Status updated successfully");
      queryClient.invalidateQueries(["payrolls"]);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payroll Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-gray-500 text-sm">Select Status</p>
          <select
            className="w-full border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Draft">Draft</option>
            <option value="Generated">Generated</option>
          </select>

          <Button
            onClick={handleUpdateStatus}
            className=" w-40 bg-green-600 hover:bg-green-700 text-white mx-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Status"}
          </Button>

          <Button variant="outline" onClick={onClose} className=" w-40 ">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --------------------- MAIN PAYROLL COMPONENT ---------------------
export default function Payroll() {
  const queryClient = useQueryClient();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [page, setPage] = useState(1);
  const [viewPayroll, setViewPayroll] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const limit = 5;

  const { data, isLoading } = useQuery({
    queryKey: ["payrolls", { page, limit, month: selectedMonth || null }],
    queryFn: fetchPayrolls,
    keepPreviousData: true,
  });

  const payrolls = data?.slips || [];
  const totalPages = data?.totalPages || 1;

  const statusColors = {
    Draft: "bg-gray-100 text-gray-700",
    Generated: "bg-blue-100 text-blue-700",
    Paid: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-gray-500">Process and manage employee salaries</p>
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate Payroll
        </Button>
      </div>

      {/* TABLE */} 
<Card>
  <CardHeader>
    <CardTitle>
      Payroll Records{" "}
      {selectedMonth &&
        `- ${format(new Date(selectedMonth + "-01"), "MMMM yyyy")}`}
    </CardTitle>
  </CardHeader>

  <CardContent className="p-0">
    {isLoading && <div className="p-10 text-center">Loading...</div>}

    {!isLoading && payrolls.length === 0 && (
      <div className="p-10 text-center text-gray-500">
        No payroll records found
      </div>
    )}

    {!isLoading && payrolls.length > 0 && (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left whitespace-nowrap">Employee</th>
              <th className="px-6 py-3 text-left whitespace-nowrap">Month/Year</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">Bonus</th>
              <th className="px-6 py-3 pe-5 whitespace-nowrap">Deductions</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">Net Salary</th>
              <th className="px-6 py-3 text-center whitespace-nowrap">Status</th>
              <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {payrolls.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-left">
                  <div className="font-medium">{p.employee?.name}</div>
                  <div className="text-sm text-gray-500">{p.employee?.email}</div>
                </td>

                <td className="px-6 py-4 text-left">{p.month}/{p.year}</td>

                <td className="px-6 py-4 text-center font-mono text-green-600">
                  +₹{p.bonus ?? 0}
                </td>

                <td className="px-6 py-4 text-center font-mono text-red-600">
                  -₹{p.deductions ?? 0}
                </td>

                <td className="px-6 py-4 text-center font-mono font-semibold">
                  ₹{p.netSalary}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      statusColors[p.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewPayroll(p)}
                  >
                    View Details
                  </Button>

                  <Button className=" bg-green-600 hover:bg-green-700 text-white"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayroll(p);
                      setStatusModalOpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* PAGINATION */}
    <div className="flex justify-between items-center p-4">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Prev
      </Button>

      <span>
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </CardContent>
</Card>


      {/* GENERATE PAYROLL DIALOG */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Payroll</DialogTitle>
          </DialogHeader>
          <PayrollForm onCancel={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={!!viewPayroll} onOpenChange={() => setViewPayroll(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>

          {viewPayroll && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Employee</p>
                <p className="font-medium">
                  {viewPayroll.employee?.name} ({viewPayroll.employee?.email})
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Month</p>
                <p className="font-medium">{viewPayroll.month}/{viewPayroll.year}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Gross Salary</p>
                <p className="font-medium">₹{viewPayroll.grossSalary}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Bonus</p>
                <p className="font-medium text-green-600">₹{viewPayroll.bonus ?? 0}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Deductions</p>
                <p className="font-medium text-red-600">₹{viewPayroll.deductions ?? 0}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Net Salary</p>
                <p className="font-medium text-blue-600">₹{viewPayroll.netSalary}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium">{viewPayroll.status}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm">Other Details</p>
                <p className="font-medium">{viewPayroll.details || "N/A"}</p>
              </div>

              {viewPayroll.slipFileUrl && (
                <div className="md:col-span-2 mt-4">
                  <a
                    href={`${Image_Url}${viewPayroll.slipFileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Salary Slip
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* STATUS UPDATE MODAL */}
      {selectedPayroll && (
        <StatusModal
          payroll={selectedPayroll}
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
        />
      )}
    </div>
  );
}
