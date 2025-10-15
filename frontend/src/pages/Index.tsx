import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Calendar, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryService, Category } from '@/services/categoryService';
import { itemService, Item } from '@/services/itemService';
import heroLivingRoom from '@/assets/hero-living-room.jpg';
import heroOffice from '@/assets/hero-office.jpg';
import chairOffice from '@/assets/chair-office.jpg';
import deskWalnut from '@/assets/desk-walnut.jpg';
import sofaPremium from '@/assets/sofa-premium.jpg';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesResponse = await categoryService.getCategories();
        setCategories(categoriesResponse);

        // Load featured items
        const featuredResponse = await itemService.getFeaturedItems(8);
        setFeaturedItems(featuredResponse);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryColors = [
    'bg-gradient-to-br from-sage to-sage/80',
    'bg-gradient-to-br from-walnut to-walnut/80',
    'bg-gradient-to-br from-terracotta to-terracotta/80',
    'bg-gradient-to-br from-charcoal to-charcoal/80',
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600'
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Quality Guarantee',
      description: 'Premium furniture with full warranty coverage'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Delivery',
      description: 'Complimentary delivery on orders over ₹5000'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Flexible Rentals',
      description: 'Rent furniture with affordable monthly payments'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Exceptional quality and service. The rental option made furnishing my apartment so affordable!',
      role: 'Customer'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Perfect for my startup office. Great selection and the team was incredibly helpful.',
      role: 'Business Owner'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Premium Furniture Collection
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Beautiful Furniture for
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Every Space</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Discover our curated collection of premium home and office furniture. 
                  Buy or rent with flexible terms and exceptional quality.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/furniture">
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg rounded-xl">
                  <Link to="/furniture?type=rent">
                    Explore Rentals
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span>4.9/5 from 500+ reviews</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="grid grid-cols-1 gap-6">
                <div className="relative overflow-hidden rounded-2xl shadow-strong">
                  <img 
                    src={heroLivingRoom} 
                    alt="Premium living room furniture"
                    className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-medium">
                  <img 
                    src={heroOffice} 
                    alt="Modern office furniture"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Why Choose FurnishHome?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make furnishing your space simple, affordable, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 shadow-soft hover:shadow-medium transition-shadow animate-scale-in">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect furniture for every room in your home or office
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
              ))
            ) : (
              categories.slice(0, 4).map((category, index) => (
                <Link
                  key={category._id}
                  to={`/furniture?category=${category._id}`}
                  className="group"
                >
                  <Card className={`${categoryColors[index % categoryColors.length]} text-white h-40 flex items-center justify-center hover:scale-105 transition-transform shadow-soft hover:shadow-medium`}>
                    <CardContent className="text-center">
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/90">Browse items</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Featured Furniture
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover our handpicked selection of premium furniture pieces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
              ))
            ) : featuredItems.length > 0 ? (
              featuredItems.slice(0, 4).map((item, index) => {
                // Fallback images array
                const fallbackImages = [chairOffice, deskWalnut, heroLivingRoom, heroOffice, sofaPremium];
                const displayImage = item.images && item.images.length > 0 
                  ? item.images[0] 
                  : fallbackImages[index % fallbackImages.length];
                
                return (
                <Link key={item._id} to={`/furniture/${item._id}`}>
                  <Card className="group hover:shadow-medium transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={displayImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {item.saleType === 'sale' && item.price && (
                            <span className="text-lg font-bold text-primary">${item.price}</span>
                          )}
                          {item.saleType === 'rent' && item.rentPrice && (
                            <span className="text-lg font-bold text-primary">${item.rentPrice}/mo</span>
                          )}
                          {item.saleType === 'both' && (
                            <div className="flex flex-col">
                              {item.price && <span className="text-sm font-bold text-primary">Buy: ${item.price}</span>}
                              {item.rentPrice && <span className="text-sm font-bold text-primary">Rent: ${item.rentPrice}/mo</span>}
                            </div>
                          )}
                        </div>
                        <Badge variant={item.condition === 'new' ? 'default' : 'secondary'}>
                          {item.condition}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured items available at the moment.</p>
              </div>
            )}
          </div>

          {featuredItems.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/furniture">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  View All Furniture
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 shadow-soft">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Browse our collection or start your rental journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/furniture">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Start Shopping
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/signup">
                Join FurnishHome
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
