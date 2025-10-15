import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Heart, Plus, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const Dashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  if (!state.isAuthenticated) {
    navigate('/login');
    return null;
  }

  const renderUserDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-medium transition-shadow cursor-pointer" onClick={() => navigate('/orders')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{state.orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow cursor-pointer" onClick={() => navigate('/cart')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cart Items</p>
                <p className="text-2xl font-bold">{state.cart.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow cursor-pointer" onClick={() => navigate('/wishlist')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wishlist</p>
                <p className="text-2xl font-bold">{state.wishlist.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {state.orders.length > 0 ? (
              <div className="space-y-3">
                {state.orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.total}</p>
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
                  View All Orders
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => navigate('/furniture')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Furniture
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
              <Users className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSellerDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Dashboard</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Furniture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-2xl font-bold">{state.furniture.filter(f => f.sellerId === state.user?.id).length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome, {state.user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {state.user?.role === 'seller' ? 'Manage your furniture listings' : 'Your furniture shopping dashboard'}
          </p>
        </div>

        {state.user?.role === 'seller' ? renderSellerDashboard() : renderUserDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;