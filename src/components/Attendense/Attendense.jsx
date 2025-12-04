/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// // import { base44 } from "@/api/base44Client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Plus, CalendarIcon, Download, MapPin, Clock } from "lucide-react";
// import { format } from "date-fns";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import AttendanceForm from "./AttendanceForm";
 
// export default function Attendance() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const queryClient = useQueryClient();

//   const { data: attendance = [] } = useQuery({
//     queryKey: ['attendance'], 
//   });

//   const { data: employees = [] } = useQuery({
//     queryKey: ['employees'], 
//   });

//   const createMutation = useMutation({
//     // mutationFn: (data) => base44.entities.Attendance.create(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['attendance'] });
//       setShowAddDialog(false);
//     },
//   });

//   const dateStr = format(selectedDate, 'yyyy-MM-dd');
//   const todayAttendance = attendance.filter(a => a.date === dateStr);
  
//   const stats = {
//     present: todayAttendance.filter(a => a.status === 'Present').length,
//     absent: todayAttendance.filter(a => a.status === 'Absent').length,
//     halfDay: todayAttendance.filter(a => a.status === 'Half Day').length,
//     onLeave: todayAttendance.filter(a => a.status === 'On Leave').length,
//   };

//   const statusColors = {
//     'Present': 'bg-green-100 text-green-700 border-green-200',
//     'Absent': 'bg-red-100 text-red-700 border-red-200',
//     'Half Day': 'bg-yellow-100 text-yellow-700 border-yellow-200',
//     'On Leave': 'bg-blue-100 text-blue-700 border-blue-200',
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
//           <p className="text-gray-500 mt-1">Monitor and manage employee attendance</p>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//           <Button
//             onClick={() => setShowAddDialog(true)}
//             className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Mark Attendance
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="border-l-4 border-green-500 shadow-lg">
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-600">Present</p>
//             <p className="text-3xl font-bold text-green-600">{stats.present}</p>
//           </CardContent>
//         </Card>
//         <Card className="border-l-4 border-red-500 shadow-lg">
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-600">Absent</p>
//             <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
//           </CardContent>
//         </Card>
//         <Card className="border-l-4 border-yellow-500 shadow-lg">
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-600">Half Day</p>
//             <p className="text-3xl font-bold text-yellow-600">{stats.halfDay}</p>
//           </CardContent>
//         </Card>
//         <Card className="border-l-4 border-blue-500 shadow-lg">
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-600">On Leave</p>
//             <p className="text-3xl font-bold text-blue-600">{stats.onLeave}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Date Picker */}
//       <Card className="shadow-lg border-none">
//         <CardContent className="p-4">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {format(selectedDate, 'PPP')}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={setSelectedDate}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//         </CardContent>
//       </Card>

//       {/* Attendance List */}
//       <Card className="shadow-lg border-none">
//         <CardHeader className="border-b">
//           <CardTitle>Attendance Records - {format(selectedDate, 'dd MMM yyyy')}</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="divide-y divide-gray-100">
//             {todayAttendance.map((record) => (
//               <div key={record.id} className="p-4 hover:bg-blue-50 transition-colors duration-200">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex items-center justify-center text-white font-bold text-lg">
//                       {record.employee_name?.charAt(0) || 'E'}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{record.employee_name}</p>
//                       <p className="text-sm text-gray-500">ID: {record.employee_id}</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 md:max-w-2xl">
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Check In</p>
//                         <p className="text-sm font-medium">{record.check_in_time || 'N/A'}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Check Out</p>
//                         <p className="text-sm font-medium">{record.check_out_time || 'N/A'}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Hours</p>
//                         <p className="text-sm font-medium">{record.total_hours?.toFixed(1) || '0'} hrs</p>
//                       </div>
//                     </div>
//                     <div>
//                       <Badge className={`${statusColors[record.status]} border px-3 py-1`}>
//                         {record.status}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
                
//                 {record.notes && (
//                   <div className="mt-3 pl-16 text-sm text-gray-600">
//                     <p className="font-medium text-gray-700">Notes:</p>
//                     <p>{record.notes}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
            
//             {todayAttendance.length === 0 && (
//               <div className="p-12 text-center">
//                 <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                 <p className="text-gray-500 text-lg">No attendance records for this date</p>
//                 <p className="text-gray-400 text-sm mt-2">Click "Mark Attendance" to add records</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add Dialog */}
//       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold text-[#007BFF]">
//               Mark Attendance
//             </DialogTitle>
//           </DialogHeader>
//           <AttendanceForm
//             employees={employees}
//             onSubmit={(data) => createMutation.mutate(data)}
//             onCancel={() => setShowAddDialog(false)}
//             isLoading={createMutation.isPending}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


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
            new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
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
        {filteredAttendance.map((record) => (
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
