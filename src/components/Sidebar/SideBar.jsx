import React from "react";
import { Link, useLocation } from "react-router-dom";
// import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Map,
  Wallet,
  CalendarClock,
  BarChart3,
  Settings,
  Menu,
  X,
  Building2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  { title: "Attendance", url: "/attendense", icon: ClipboardCheck },
  { title: "Travel Tracking", url: "/travel", icon: Map },
  { title: "Payroll", url: "/payroll", icon: Wallet },
  { title: "Leave Management", url: "/leave", icon: CalendarClock },
  { title: "Reports", url: "/report", icon: BarChart3 },
  { title: "Settings", url: "/setting", icon: Settings },
  { title: "departments", url: "/departments", icon: Building2  }
];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-blue: #007BFF;
          --primary-blue-dark: #0056b3;
          --accent-green: #00C896;
          --accent-green-dark: #00A578;
          --bg-light: #F9FAFB;
          --text-dark: #1F2937;
          --text-muted: #6B7280;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-[#F9FAFB]">
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-[#007BFF] text-lg">Malhotra IT</h2>
                <p className="text-xs text-gray-500 font-medium">HRMS Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              {/* <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Main Menu
              </SidebarGroupLabel> */}
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`mb-1 transition-all duration-200 ${
                            isActive 
                              ? 'bg-[#007BFF] text-white hover:bg-[#0056b3] shadow-md' 
                              : 'hover:bg-blue-50 hover:text-[#007BFF]'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3 rounded-lg">
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

          <SidebarFooter className="border-t border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-white">
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Malhotra IT Innovations</p>
              <p className="text-xs text-gray-400 italic mt-1">Innovating Smarter Digital Workflows</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                <div>
                  <h1 className="text-xl font-bold text-[#007BFF]">{currentPageName || 'Dashboard'}</h1>
                  <p className="text-sm text-gray-500">Human Resource Management System</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#007BFF] to-[#0056b3] rounded-lg text-white text-sm font-medium shadow-md">
                  <Building2 className="w-4 h-4" />
                  <span>Admin Portal</span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-[#F9FAFB]">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

