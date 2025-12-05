import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { itemService, Item } from '@/services/itemService';

const Wishlist = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemService.getItems();
        setItems(response.items);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Get wishlist items from real data
  const wishlistItems = items.filter(item => 
    state.wishlist.includes(item._id)
  );

  const handleRemoveFromWishlist = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
  };

  const handleAddToCart = (item: Item) => {
    // Helper to convert image to URL string
    const getImageUrl = (img: string | { _id?: string; url: string; altText?: string } | undefined): string => {
      if (!img) return '/placeholder.svg';
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && 'url' in img) return img.url;
      return '/placeholder.svg';
    };
    
    // Convert Item to Furniture format for cart
    const furniture = {
      id: item._id,
      title: item.name,
      description: item.description,
      category: item.category?.name || 'Unknown',
      type: item.saleType === 'sale' ? 'sell' : item.saleType,
      price: item.price || 0,
      rentPrice: item.rentPrice || 0,
      deposit: item.depositPrice || 0,
      availability: item.availability === 'available',
      sellerId: 'admin',
      rating: 0,
      reviewCount: 0,
      images: item.images && item.images.length > 0 
        ? item.images.map(img => getImageUrl(img)).filter(Boolean)
        : ['/placeholder.svg'],
    };

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        furniture,
        quantity: 1,
        type: item.saleType === 'rent' ? 'rent' : 'sell'
      }
    });
  };

  const handleBrowseFurniture = () => {
    navigate('/furniture');
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
        
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
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
              <Card key={item._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm relative">
                <Link 
                  to={`/furniture/${item._id}`}
                  className="block cursor-pointer"
                >
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                      {(() => {
                        const getImageUrl = (img: string | { _id?: string; url: string; altText?: string } | undefined): string => {
                          if (!img) return '/placeholder.svg';
                          if (typeof img === 'string') return img;
                          if (typeof img === 'object' && 'url' in img) return img.url;
                          return '/placeholder.svg';
                        };
                        const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
                        const imageUrl = firstImage ? getImageUrl(firstImage) : '/placeholder.svg';
                        return (
                          <img 
                            src={imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        );
                      })()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white transition-colors duration-200 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFromWishlist(item._id);
                      }}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                    {item.saleType === 'rent' && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white z-10">
                        For Rent
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">0</span>
                        <span className="text-sm text-gray-500">(0)</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.category?.name || 'Unknown'}
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
                  </CardContent>
                </Link>
                
                <div className="flex space-x-2 mt-4 px-6 pb-6" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFromWishlist(item._id);
                    }}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;