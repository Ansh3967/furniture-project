import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { adminService, Admin } from "@/services/adminService";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifBtnRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch notifications
  useEffect(() => {
    let isMounted = true;
    async function fetchNotifications() {
      try {
        // Example: Only show recent orders that are "pending"
        const ordersResp = await adminService.getOrders({
          status: "pending",
          limit: 5,
        });
        if (isMounted) {
          const notifs = (ordersResp.orders || []).map((order: any) => ({
            id: order._id,
            message: `Order #${order._id.slice(-8)} (${order.user?.firstName} ${
              order.user?.lastName
            }) is pending.`,
            date: order.createdAt,
            link: `/admin/orders/${order._id}`,
            order, // for possible extensions
          }));
          setNotifications(notifs);
        }
      } catch (e) {
        // Optionally report error
      }
    }
    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside notification dropdown handler
  useEffect(() => {
    function handler(event: MouseEvent) {
      // @ts-ignore
      if (notifBtnRef.current && !notifBtnRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    }
    if (showNotifDropdown) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifDropdown]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/admin/login");
  };

  const handleNotifBtnClick = () => {
    setShowNotifDropdown((open) => !open);
  };

  const handleNotifItemClick = (notif: any) => {
    setShowNotifDropdown(false);
    // Go to order detail/admin page if link exists
    if (notif.link) {
      navigate(notif.link);
    }
  };

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 m-0 p-0 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col m-0 p-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 m-0 p-0">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>

              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search..." className="pl-10 w-64" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications (real) */}
              <div className="relative" ref={notifBtnRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={handleNotifBtnClick}
                  aria-haspopup="true"
                  aria-expanded={showNotifDropdown}
                  aria-label="Show notifications"
                  tabIndex={0}>
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
                {/* Popover dropdown */}
                {showNotifDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 min-w-[280px] w-[22rem] bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                    <div className="py-2 px-4 border-b font-semibold text-sm text-gray-800">
                      Pending Orders
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-gray-500 text-center py-6 text-sm">
                          No pending orders
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            className="w-full flex text-left px-4 py-3 items-center gap-3 hover:bg-gray-100 transition focus:outline-none"
                            onClick={() => handleNotifItemClick(notif)}>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-gray-900 text-sm truncate">
                                {notif.message}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(notif.date).toLocaleString()}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {admin?.username || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {admin?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 pt-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
