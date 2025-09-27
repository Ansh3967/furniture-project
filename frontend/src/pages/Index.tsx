import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Calendar, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroLivingRoom from '@/assets/hero-living-room.jpg';
import heroOffice from '@/assets/hero-office.jpg';

const Index = () => {
  const featuredCategories = [
    { name: 'Living Room', count: '120+ items', color: 'bg-gradient-to-br from-sage to-sage/80' },
    { name: 'Office', count: '85+ items', color: 'bg-gradient-to-br from-walnut to-walnut/80' },
    { name: 'Bedroom', count: '95+ items', color: 'bg-gradient-to-br from-terracotta to-terracotta/80' },
    { name: 'Storage', count: '60+ items', color: 'bg-gradient-to-br from-charcoal to-charcoal/80' }
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
      description: 'Complimentary delivery on orders over $500'
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Premium Furniture Collection
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  Beautiful Furniture for
                  <span className="text-accent"> Every Space</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Discover our curated collection of premium home and office furniture. 
                  Buy or rent with flexible terms and exceptional quality.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Link to="/furniture">
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
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
            {featuredCategories.map((category, index) => (
              <Link
                key={index}
                to={`/furniture?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="group"
              >
                <Card className={`${category.color} text-white h-40 flex items-center justify-center hover:scale-105 transition-transform shadow-soft hover:shadow-medium`}>
                  <CardContent className="text-center">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
