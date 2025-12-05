import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { dispatch } = useApp();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Items",
      href: "/admin/items",
      icon: Package,
      current: location.pathname.startsWith("/admin/items"),
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
      current: location.pathname.startsWith("/admin/categories"),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: location.pathname.startsWith("/admin/users"),
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: location.pathname.startsWith("/admin/orders"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
    },
  ];

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // On large screens, static and fits height, not overlay
          // On mobile, fixed and sliding in/out
          "z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex-shrink-0 flex flex-col",
          "lg:static lg:inset-y-0 lg:translate-x-0",
          isOpen
            ? "fixed inset-y-0 left-0 translate-x-0"
            : "fixed inset-y-0 -translate-x-full left-0"
        )}
        style={{
          height: "100dvh", // Modern CSS for full *physical* viewport height, not extending past if body is long
          maxHeight: "100dvh",
          position:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? "static"
              : undefined,
        }}
        aria-label="Sidebar">
        <div className="flex flex-col h-full max-h-[100dvh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-none">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Furniture Store</p>
              </div>
            </div>
            {/* Show close button only on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.current
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.name === "Orders"}
              </Link>
            ))}
          </nav>

          {/* Footer (remains at the bottom of the visible area) */}
          <div className="p-4 border-t border-gray-200 flex-none">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
