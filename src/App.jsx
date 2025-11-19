import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Employees from "./components/Employee/Employee";
import Attendance from "./components/Attendense/Attendense";
import TravelTracking from "./components/Travel/TravelTracking";
import Payroll from "./components/payroll/payroll";
import LeaveManagement from "./components/LeaveManagement/LeaveManagement";
import Reports from "./components/Repots/Repots";
import SettingsPage from "./components/Setting/Setting";
import Departments from "./components/departments/departments";
import GoogleMapComponent from "./GoogleMapComponent";
import Login from "./components/Auth/Login";
import Layout from "./components/Sidebar/SideBar";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import EmployeeLocation from "./components/Employee/EmployeeLocation";
import { LoadScript } from "@react-google-maps/api";

const App = () => {
  const location = useLocation();
 
  const isLoginPage = location.pathname === "/";

  return (
    <>
      <Toaster position="top-right" richColors />
  <LoadScript googleMapsApiKey="AIzaSyCUf5l0MvNpqpUB2mb9gxz0EcmlybwrpsA">
      {isLoginPage ? ( 
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : ( 
        <Layout>
          
          <Routes>
            <Route path="/home" element={<ProtectedRoute>  <Home /> </ProtectedRoute>} />
            <Route path="/employee" element={<ProtectedRoute> <Employees /> </ProtectedRoute>} />
            <Route path="/attendense" element={<ProtectedRoute>  <Attendance /> </ProtectedRoute>} />
            <Route path="/travel" element={<ProtectedRoute> <TravelTracking /> </ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute> <Payroll /> </ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute> <LeaveManagement /> </ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute> <Reports /> </ProtectedRoute>}  />
            <Route path="/setting" element={<ProtectedRoute> <SettingsPage /> </ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute> <Departments /> </ProtectedRoute>} />
            <Route path="/employeeLocation" element={<ProtectedRoute> <EmployeeLocation/> </ProtectedRoute>} />
            <Route path="/google/:id"  element={<ProtectedRoute> <GoogleMapComponent /> </ProtectedRoute>} />
          </Routes>
        </Layout>
      )}
      </LoadScript>
    </>
  );
};

export default App;
