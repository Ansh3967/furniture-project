import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalItems: number;
  availableItems: number;
  outOfStockItems: number;
  featuredItems: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topViewedItems: any[];
  itemsByType: any[];
  itemsByCategory: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    availableItems: 0,
    outOfStockItems: 0,
    featuredItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topViewedItems: [],
    itemsByType: [],
    itemsByCategory: [],
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch item statistics
        const itemStats = await adminService.getItemStats();

        // Fetch order statistics
        const orderStats = await adminService.getOrderStats();

        // Fetch recent orders
        const recentOrdersData = await adminService.getOrders({ limit: 5 });

        setStats({
          totalItems: itemStats.totalItems,
          availableItems: itemStats.availableItems,
          outOfStockItems: itemStats.outOfStockItems,
          featuredItems: itemStats.featuredItems,
          totalOrders: orderStats.totalOrders,
          pendingOrders: orderStats.pendingOrders,
          completedOrders: orderStats.completedOrders,
          cancelledOrders: orderStats.cancelledOrders,
          totalRevenue: orderStats.totalRevenue,
          recentOrders: recentOrdersData.orders || [],
          topViewedItems: itemStats.topViewedItems || [],
          itemsByType: itemStats.itemsByType || [],
          itemsByCategory: itemStats.itemsByCategory || [],
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      description: `${stats.availableItems} available`,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      description: `${stats.pendingOrders} pending`,
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: `${stats.completedOrders} completed`,
      trend: "up",
    },
    {
      title: "Featured Items",
      value: stats.featuredItems.toLocaleString(),
      icon: Star,
      description: `${stats.outOfStockItems} out of stock`,
      trend: "up",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin! Here's what's happening with your furniture
            store.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            ${order.totalAmount}
                          </span>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : "secondary"
                            }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent orders
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Viewed Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Viewed Items</CardTitle>
                <CardDescription>Most popular products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topViewedItems.length > 0 ? (
                    stats.topViewedItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.viewCount} views
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {item.category?.name || "Uncategorized"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                Manage and track customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Order #{order._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">
                          ${order.totalAmount}
                        </span>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : "secondary"
                          }>
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No orders found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                  Out of Stock Alert
                </CardTitle>
                <CardDescription>Items that need restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.outOfStockItems > 0 ? (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="font-medium text-orange-800">
                        {stats.outOfStockItems} items are out of stock
                      </p>
                      <p className="text-sm text-orange-600">
                        Check the Items management page for details
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      All items are in stock
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
                <CardDescription>Quick inventory overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-medium">{stats.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Items</span>
                    <span className="font-medium text-green-600">
                      {stats.availableItems}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock</span>
                    <span className="font-medium text-red-600">
                      {stats.outOfStockItems}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Featured Items</span>
                    <span className="font-medium text-blue-600">
                      {stats.featuredItems}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Revenue and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics chart would go here</p>
                  <p className="text-sm">
                    Integration with chart library needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
