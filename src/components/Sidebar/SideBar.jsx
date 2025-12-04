import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../assets/canx1.png";

import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Map,
  Wallet,
  CalendarClock,
  BarChart3,
  Settings,
  Building2
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/home", icon: LayoutDashboard },
  { title: "Employees", url: "/employee", icon: Users },
  { title: "Departments", url: "/departments", icon: Building2 },
  // { title: "Attendance", url: "/attendense", icon: ClipboardCheck },
  { title: "Travel Tracking", url: "/travel", icon: Map },
  { title: "Payroll", url: "/payroll", icon: Wallet },
  { title: "Leave Management", url: "/leave", icon: CalendarClock },
  { title: "Reports", url: "/report", icon: BarChart3 },
  { title: "Settings", url: "/setting", icon: Settings },
   // { title: "Logout", url: "#", icon: LogOut, color: "text-red-500" }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutPopup, setLogoutPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogoutPopup(false);
    navigate("/home");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F9FAFB]">
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
               <img 
        src={logo} 
        alt="Logo" 
        className=" h-12   w-50" 
      />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => item.title === "Logout" && setLogoutPopup(true)}
                          className={`mb-1 transition-all duration-200 ${
                            item.title === "Logout"
                              ? `${item.color} hover:bg-red-50`
                              : isActive
                              ? "bg-[#007BFF] text-white hover:bg-[#0056b3] shadow-md"
                              : "hover:bg-blue-50 hover:text-[#007BFF]"
                          }`}
                        >
                          <Link
                            to={item.title === "Logout" ? "#" : item.url}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg"
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>


           {/* BOTTOM LOGOUT BUTTON */}
          <SidebarFooter className="border-t border-0 p-4">
            <button
              onClick={() => setLogoutPopup(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all border-0"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </SidebarFooter>

          {/* <SidebarFooter className="border-t border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-white">
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Malhotra IT Innovations</p>
              <p className="text-xs text-gray-400 italic mt-1">Innovating Smarter Digital Workflows</p>
            </div>
          </SidebarFooter> */}
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                <div>
                  <h1 className="text-xl font-bold text-[#007BFF]">{currentPageName || "Dashboard"}</h1>
                  <p className="text-sm text-gray-500">Human Resource Management System</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-[#F9FAFB]">{children}</div>
        </main>
      </div>

      {/* LOGOUT MODAL */}
      {logoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-80 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Logout?</h2>
            <p className="text-sm text-gray-500 mt-2">Are you sure you want to logout?</p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setLogoutPopup(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
