import React from 'react';
import { Heart, ShoppingCart, Trash2, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Get wishlist items from furniture data
  const wishlistItems = state.furniture.filter(item => 
    state.wishlist.includes(item.id)
  );

  const handleRemoveFromWishlist = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
  };

  const handleAddToCart = (furniture: any) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        furniture,
        quantity: 1,
        type: furniture.type === 'rent' ? 'rent' : 'sell'
      }
    });
  };

  const handleBrowseFurniture = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Wishlist
          </h1>
          <p className="text-lg text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love for later! Browse our collection and add your favorites.
            </p>
            <Button 
              onClick={handleBrowseFurniture}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Furniture
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={item.images[0] || '/placeholder.svg'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white transition-colors duration-200"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </Button>
                  {item.type === 'rent' && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                      For Rent
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                      <span className="text-sm text-gray-500">({item.reviewCount})</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {item.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-bold text-lg text-green-600">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {item.rentPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rent:</span>
                        <span className="font-semibold text-blue-600">
                          ₹{item.rentPrice}/month
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default Wishlist;