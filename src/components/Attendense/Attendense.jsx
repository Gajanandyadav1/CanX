 


import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon, Download, Clock } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AttendanceForm from "./AttendanceForm";
import { useParams } from "react-router-dom";
import { Base_Url } from "@/config";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(null); // 👉 Important
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();

  // ---------------------- API CALL ----------------------
// eslint-disable-next-line no-unused-vars
const { data: attendanceData = [], isLoading } = useQuery({
  queryKey: ["attendance", id, selectedDate], // 🔥 date added here
  queryFn: async () => {
    const year = selectedDate
      ? new Date(selectedDate).getFullYear()
      : new Date().getFullYear();

    const month = selectedDate
      ? new Date(selectedDate).getMonth() + 1
      : new Date().getMonth() + 1;

    const res = await fetch(
      `${Base_Url}api/v1/attendance/month/admin/employee/${id}?year=${year}&month=${month}`
    );

    const json = await res.json();
    return json.data;
  },
});

  // ---------------------- FILTER ----------------------
const filteredAttendance =
  selectedDate === null
    ? attendanceData
    : attendanceData.filter(
        (item) =>
          new Date(item.date).getMonth() === new Date(selectedDate).getMonth()
      );


  // ---------------------- MUTATION ----------------------
  const createMutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
      setShowAddDialog(false);
    },
  });

  // ---------------------- STATS ----------------------
  const stats = {
    present: filteredAttendance.length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats */}
     
      

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="border-l-4 border-green-500 shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          </CardContent>
        </Card>
       
      
      </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
  <CardHeader>
    <CardTitle>
      {selectedDate
        ? `Attendance - ${format(selectedDate, "dd MMM yyyy")}`
        : "All Attendance Records"}
    </CardTitle>
  </CardHeader>
  

  <CardContent className="p-4">
    {filteredAttendance.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAttendance?.map((record) => (
          <Card
            key={record._id}
            className="p-4 shadow hover:shadow-lg transition-all border rounded-lg"
          >
            <CardContent className="space-y-3 p-0">

              {/* Employee Name */}
              <h3 className="font-bold text-lg text-gray-800">
                {record.employee?.name}
              </h3>

              {/* Check In */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  <strong>Check In:</strong>{" "}
                  {record.checkInTime
                    ? format(new Date(record.checkInTime), "hh:mm a")
                    : "Not Checked In"}
                </span>
              </div>

              {/* Check Out */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-red-500" />
                <span>
                  <strong>Check Out:</strong>{" "}
                  {record.checkOutTime
                    ? format(new Date(record.checkOutTime), "hh:mm a")
                    : "Not Checked Out"}
                </span>
              </div>
              {/* Date   */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
      <Clock className="w-4 h-4 text-red-500" />
      <span>
        <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
      </span>
    </div>


              {/* Distance */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">Distance:</span> {record.totalDistance} km
              </div>

              {/* Status Badge */}
              
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="p-12 text-center text-gray-500">
        No attendance found
      </div>
    )}
  </CardContent>
</Card>


      {/* Dialog Form */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-blue-600">
              Mark Attendance
            </DialogTitle>
          </DialogHeader>

          <AttendanceForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
