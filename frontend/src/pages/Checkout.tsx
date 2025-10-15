import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { orderService, CreateOrderData } from '@/services/orderService';

const Checkout = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.cart.reduce((total, item) => {
    const price = item.type === 'sell' ? item.furniture.price! : item.furniture.rentPrice!;
    return total + (price * item.quantity);
  }, 0);

  const deposits = state.cart.reduce((total, item) => {
    if (item.type === 'rent' && item.furniture.deposit) {
      return total + (item.furniture.deposit * item.quantity);
    }
    return total;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + deposits + shipping;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData: CreateOrderData = {
        items: state.cart.map(item => ({
          furnitureId: item.furniture.id,
          name: item.furniture.title,
          quantity: item.quantity,
          price: item.type === 'sell' ? item.furniture.price! : item.furniture.rentPrice!,
          type: item.type
        })),
        total,
        type: state.cart.some(item => item.type === 'rent') ? 'rental' : 'purchase',
        shippingAddress: `${state.user?.firstName} ${state.user?.lastName}, ${state.user?.email}`,
        paymentMethod
      };

      // Create order via API
      const response = await orderService.createOrder(orderData);
      
      // Add order to context
      dispatch({ type: 'ADD_ORDER', payload: {
        id: response.order._id,
        userId: response.order.userId,
        items: state.cart,
        total: response.order.total,
        status: 'pending' as const,
        type: response.order.type,
        createdAt: response.order.createdAt
      }});

      // Clear cart
      dispatch({ type: 'CLEAR_CART' });

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${response.order.orderNumber} has been placed and will be processed soon.`,
      });

      navigate('/orders');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === 'card' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input 
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input 
                          id="cardName"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={isProcessing}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing Payment...' : `Pay ₹${total}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {state.cart.map((item) => (
                    <div key={`${item.furniture.id}-${item.type}`} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.furniture.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type === 'sell' ? 'Purchase' : 'Rental'} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{(item.type === 'sell' ? item.furniture.price! : item.furniture.rentPrice!) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

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
                </div>

                <hr />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;