import React from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const Orders = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">My Orders</h1>
        
        {state.orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {state.orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                    <Badge>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Total: ${order.total}</p>
                  <p className="text-muted-foreground">{order.items.length} items</p>
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