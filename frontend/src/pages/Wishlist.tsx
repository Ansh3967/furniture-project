import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Wishlist = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">My Wishlist</h1>
        
        {state.wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save items you love for later!</p>
            <Button>Browse Furniture</Button>
          </div>
        ) : (
          <div>Wishlist items here</div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;