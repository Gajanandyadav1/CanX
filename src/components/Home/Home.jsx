/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Base_Url } from "@/config";

export default function Home() {
  const [activeTab, setActiveTab] = useState("present");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [statsData, setStatsData] = useState({
    presentEmployeesCount: 0,
    leaveEmployeesCount: 0,
    absentEmployeesCount: 0,
    presentEmployees: [],
    leaveEmployees: [],
    absentEmployees: [],
  });

  const GetData = async () => {
    try {
      const res = await fetch(`${Base_Url}api/v1/employees/dashboard/details`);
      const result = await res.json();
      if (result.success === true) {
        setStatsData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Present" value={statsData.presentEmployeesCount} color="green" />
        <StatCard title="Absent" value={statsData.absentEmployeesCount} color="red" />
        <StatCard title="Leave" value={statsData.leaveEmployeesCount} color="blue" />
      </div>

      {/* TABS */}
      <div className="flex gap-3">
        <Button
          variant={activeTab === "present" ? "default" : "outline"}
          onClick={() => setActiveTab("present")}
        >
          Present
        </Button>
        <Button
          variant={activeTab === "leave" ? "default" : "outline"}
          onClick={() => setActiveTab("leave")}
        >
          Leave
        </Button>
        <Button
          variant={activeTab === "absent" ? "default" : "outline"}
          onClick={() => setActiveTab("absent")}
        >
          Absent
        </Button>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

        {activeTab === "present" &&
          (statsData.presentEmployees.length > 0 ? (
            statsData.presentEmployees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                name={emp.employee.name}
                phone={emp.employee.phone}
                status="Present"
                color="green"
              />
            ))
          ) : (
            <NoData />
          ))}

        {activeTab === "leave" &&
          (statsData.leaveEmployees.length > 0 ? (
            statsData.leaveEmployees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                name={emp.employee.name}
                phone={emp.employee.phone}
                status="On Leave"
                color="blue"
              />
            ))
          ) : (
            <NoData />
          ))}

        {activeTab === "absent" &&
          (statsData.absentEmployees.length > 0 ? (
            statsData.absentEmployees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                name={emp.name}
                phone={emp.phone}
                status="Absent"
                color="red"
              />
            ))
          ) : (
            <NoData />
          ))}
      </div>

      {/* DIALOG */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const NoData = () => (
  <div className="col-span-full text-center text-gray-700 py-10 font-bold text-xl">
    No Data Found
  </div>
);

const StatCard = ({ title, value, color }) => (
  <Card className={`border-l-4 border-${color}-500`}>
    <CardContent className="p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </CardContent>
  </Card>
);

const EmployeeCard = ({ name, phone, status, color }) => (
  <Card className="shadow-md hover:shadow-lg transition">
    <CardContent className="p-4 text-center">
      <div
        className={`w-14 h-14 mx-auto rounded-full bg-${color}-600 text-white flex items-center justify-center text-xl font-bold`}
      >
        {name?.charAt(0)}
      </div>

      <h3 className="mt-3 font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{phone}</p>

      <Badge className={`mt-3 bg-${color}-100 text-${color}-700 border border-${color}-200`}>
        {status}
      </Badge>
    </CardContent>
  </Card>
);
