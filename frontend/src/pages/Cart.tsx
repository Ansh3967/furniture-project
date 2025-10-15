import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import sofaImage from '@/assets/sofa-premium.jpg';
import deskImage from '@/assets/desk-walnut.jpg';
import chairImage from '@/assets/chair-office.jpg';

const Cart = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const getItemImage = (furnitureId: string) => {
    switch (furnitureId) {
      case '1': return sofaImage;
      case '2': return deskImage;
      case '3': return chairImage;
      default: return '/placeholder.svg';
    }
  };

  const updateQuantity = (furnitureId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: furnitureId });
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id: furnitureId, quantity: newQuantity } 
      });
    }
  };

  const removeItem = (furnitureId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: furnitureId });
  };

  const calculateSubtotal = () => {
    return state.cart.reduce((total, item) => {
      const price = item.type === 'sell' ? item.furniture.price! : item.furniture.rentPrice!;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateDeposits = () => {
    return state.cart.reduce((total, item) => {
      if (item.type === 'rent' && item.furniture.deposit) {
        return total + (item.furniture.deposit * item.quantity);
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deposits = calculateDeposits();
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + deposits + shipping;

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Discover our amazing furniture collection and find something you love!
            </p>
            <Button size="lg" asChild>
              <Link to="/furniture">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Items ({state.cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => dispatch({ type: 'CLEAR_CART' })}
                  >
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {state.cart.map((item) => (
                    <div key={`${item.furniture.id}-${item.type}`} className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={getItemImage(item.furniture.id)}
                          alt={item.furniture.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.furniture.title}</h3>
                            <p className="text-muted-foreground text-sm">{item.furniture.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.furniture.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant={item.type === 'sell' ? 'default' : 'secondary'}>
                            {item.type === 'sell' ? (
                              <><ShoppingBag className="w-3 h-3 mr-1" /> Purchase</>
                            ) : (
                              <><Calendar className="w-3 h-3 mr-1" /> Rental</>
                            )}
                          </Badge>
                          {item.type === 'rent' && item.furniture.deposit && (
                            <span className="text-sm text-muted-foreground">
                              +₹{item.furniture.deposit} deposit
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.furniture.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.furniture.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              ₹{(item.type === 'sell' ? item.furniture.price! : item.furniture.rentPrice!) * item.quantity}
                              {item.type === 'rent' && '/mo'}
                            </div>
                            {item.type === 'rent' && item.furniture.deposit && (
                              <div className="text-sm text-muted-foreground">
                                +₹{item.furniture.deposit * item.quantity} deposit
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {deposits > 0 && (
                    <div className="flex justify-between">
                      <span>Security Deposits:</span>
                      <span>₹{deposits}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600">
                      🎉 Free shipping on orders over ₹5000!
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/furniture">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                {/* Benefits */}
                <div className="pt-4 border-t border-border">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>1-year warranty included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Professional assembly available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;