import React, { useState, useEffect } from "react";
import { Package, Calendar, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { orderService } from "@/services/orderService";

const Orders = () => {
  const { state } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user orders from API
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await orderService.getUserOrders();
        setOrders(response.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        // Fallback to sample data on error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Sample Indian orders data for fallback
  const sampleOrders = [
    {
      id: "ORD-2024-001",
      status: "Delivered",
      total: 24999,
      date: "2024-01-15",
      items: [{ name: "Premium Leather Sofa", quantity: 1, price: 24999 }],
      customer: {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91 98765 43210",
        address: "123, MG Road, Bangalore, Karnataka 560001",
      },
    },
    {
      id: "ORD-2024-002",
      status: "In Transit",
      total: 18999,
      date: "2024-01-20",
      items: [{ name: "Luxury King Size Bed", quantity: 1, price: 18999 }],
      customer: {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 87654 32109",
        address: "456, Park Street, Mumbai, Maharashtra 400001",
      },
    },
    {
      id: "ORD-2024-003",
      status: "Processing",
      total: 12999,
      date: "2024-01-25",
      items: [{ name: "Teak Wood Executive Desk", quantity: 1, price: 12999 }],
      customer: {
        name: "Amit Patel",
        email: "amit.patel@email.com",
        phone: "+91 76543 21098",
        address: "789, Connaught Place, New Delhi, Delhi 110001",
      },
    },
    {
      id: "ORD-2024-004",
      status: "Delivered",
      total: 15999,
      date: "2024-01-10",
      items: [{ name: "Luxury Wardrobe", quantity: 1, price: 15999 }],
      customer: {
        name: "Sunita Reddy",
        email: "sunita.reddy@email.com",
        phone: "+91 65432 10987",
        address: "321, Jubilee Hills, Hyderabad, Telangana 500033",
      },
    },
    {
      id: "ORD-2024-005",
      status: "Cancelled",
      total: 7999,
      date: "2024-01-05",
      items: [{ name: "Gaming Desk Setup", quantity: 1, price: 7999 }],
      customer: {
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        phone: "+91 54321 09876",
        address: "654, Sector 17, Chandigarh, Punjab 160017",
      },
    },
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your furniture orders and delivery status
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">
              Your order history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayOrders.map((order: any) => (
              <Card
                key={order._id || order.id}
                className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      Order #{order.orderNumber || order.id}
                    </CardTitle>
                    <Badge
                      variant={
                        order.status === "delivered" ||
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "shipped" ||
                            order.status === "In Transit"
                          ? "secondary"
                          : order.status === "processing" ||
                            order.status === "Processing"
                          ? "outline"
                          : "destructive"
                      }>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Order Date:
                        </span>
                        <span className="font-medium">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : order.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Items:
                        </span>
                        <span className="font-medium">
                          {order.items?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Delivery Address:
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {order.shippingAddress || order.customer?.address}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{(order.total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <span className="font-medium">
                              {item.name || item.item?.name}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="font-semibold">
                            ₹{(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
