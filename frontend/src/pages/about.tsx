import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Truck, 
  Shield, 
  Heart, 
  Users, 
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Our Furniture Shop</h1>
            <p className="text-xl mb-8 leading-relaxed">
              Crafting beautiful, functional spaces with premium furniture that transforms 
              houses into homes and offices into inspiring workspaces.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Award className="w-4 h-4 mr-2" />
                Premium Quality
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Heart className="w-4 h-4 mr-2" />
                Customer First
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Shield className="w-4 h-4 mr-2" />
                Trusted Service
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded in 2015, our furniture shop began with a simple vision: to provide 
                  exceptional furniture that combines timeless design with modern functionality. 
                  What started as a small family business has grown into a trusted name in 
                  home and office furnishings.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We believe that furniture is more than just functional objects – they're 
                  the foundation of your daily life, the backdrop to your memories, and the 
                  canvas for your personal style.
                </p>
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  Learn More About Our Journey
                </Button>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-800 mb-2">8+</div>
                    <div className="text-amber-700">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-800 mb-2">10K+</div>
                    <div className="text-amber-700">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-800 mb-2">500+</div>
                    <div className="text-amber-700">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-800 mb-2">50+</div>
                    <div className="text-amber-700">Designers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do and every piece we offer
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl">Quality First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We source only the finest materials and work with skilled craftsmen 
                    to ensure every piece meets our high standards of durability and beauty.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl">Customer Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Your satisfaction is our priority. From consultation to delivery, 
                    we're here to make your furniture shopping experience exceptional.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl">Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We're committed to eco-friendly practices, using sustainable materials 
                    and responsible manufacturing processes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Services</h2>
              <p className="text-xl text-gray-600">
                Comprehensive furniture solutions for every need
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Truck className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
                  <p className="text-gray-600">Complimentary delivery within 50 miles</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Assembly Service</h3>
                  <p className="text-gray-600">Professional assembly by our experts</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Warranty</h3>
                  <p className="text-gray-600">Extended warranty on all products</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Design Consultation</h3>
                  <p className="text-gray-600">Free design advice from our experts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                The passionate people behind our success
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-amber-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                  <p className="text-amber-600 mb-2">Founder & CEO</p>
                  <p className="text-gray-600 text-sm">
                    With 15 years in interior design, Sarah leads our vision of 
                    creating beautiful, functional spaces.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-amber-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                  <p className="text-amber-600 mb-2">Head of Design</p>
                  <p className="text-gray-600 text-sm">
                    Michael brings innovative design concepts and ensures every 
                    piece meets our quality standards.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-amber-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
                  <p className="text-amber-600 mb-2">Customer Experience</p>
                  <p className="text-gray-600 text-sm">
                    Emily ensures every customer receives exceptional service 
                    and finds their perfect furniture solution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
                <p className="text-xl mb-8 leading-relaxed">
                  Ready to transform your space? We'd love to hear from you and help 
                  you find the perfect furniture for your home or office.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>info@furnitureshop.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>123 Furniture Street, Design City, DC 12345</span>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-amber-900">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-amber-900">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-amber-900">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-amber-900">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Star className="w-5 h-5 text-amber-300 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Premium Quality</h4>
                      <p className="text-sm opacity-90">Only the finest materials and craftsmanship</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Star className="w-5 h-5 text-amber-300 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Expert Service</h4>
                      <p className="text-sm opacity-90">Professional consultation and support</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Star className="w-5 h-5 text-amber-300 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Satisfaction Guarantee</h4>
                      <p className="text-sm opacity-90">100% satisfaction or your money back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
