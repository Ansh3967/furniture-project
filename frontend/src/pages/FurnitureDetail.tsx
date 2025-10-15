import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Calendar,
  Truck,
  Shield,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { itemService, Item } from "@/services/itemService";

const FurnitureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await itemService.getItem(id);
        setItem(data);
      } catch (e) {
        // show not found UI
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const imageUrls = Array.isArray(item?.images)
    ? item!.images
        .map((img: any) => (typeof img === "string" ? img : img.url))
        .filter(Boolean)
    : [];
  const images = imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"];

  const handleAddToCart = (type: "sell" | "rent") => {
    if (!item) return;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        furniture: {
          id: item._id,
          title: item.name,
          description: item.description,
          price: item.price,
          rentPrice: item.rentPrice,
          deposit: item.depositPrice,
          rating: 0,
          reviewCount: 0,
          category: item.category?.name,
          type: item.saleType,
          availability: item.availability === "available",
          images,
        },
        quantity,
        type,
      },
    });

    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (state.wishlist.includes(furniture.id)) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: furniture.id });
      toast({
        title: "Removed from wishlist",
        description: `${furniture.title} has been removed from your wishlist.`,
      });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: furniture.id });
      toast({
        title: "Added to wishlist!",
        description: `${furniture.title} has been added to your wishlist.`,
      });
    }
  };

  const features = [
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Free Delivery",
      description: "On orders over ₹5000",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "1 Year Warranty",
      description: "Full coverage included",
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: "30-Day Returns",
      description: "Easy returns policy",
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Absolutely love this piece! The quality is exceptional and it looks even better in person.",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "1 month ago",
      comment:
        "Great furniture, very comfortable and well-made. Delivery was smooth.",
      verified: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Furniture not found</h2>
          <Button onClick={() => navigate("/furniture")}>
            Back to Furniture
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/furniture")}
          className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Furniture
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={images[selectedImage]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border"
                    }`}>
                    <img
                      src={image}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-primary">{item.name}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleWishlist}>
                  <Heart
                    className={`w-5 h-5 ${
                      state.wishlist.includes(item._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(0)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium ml-2">0</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    (0 reviews)
                  </span>
                </div>
                <Badge variant="secondary">{item.category?.name}</Badge>
              </div>

              <p className="text-muted-foreground text-lg">
                {item.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              {item.price && (
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    <span className="text-muted-foreground">
                      One-time purchase
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => handleAddToCart("sell")}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - Buy
                  </Button>
                </div>
              )}

              {item.rentPrice && (
                <div className="p-4 border rounded-lg">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-accent">
                        ₹{item.rentPrice}/month
                      </span>
                      <span className="text-muted-foreground">
                        Monthly rental
                      </span>
                    </div>
                    {item.depositPrice && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Security deposit:</span>
                        <span>₹{item.depositPrice}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleAddToCart("rent")}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Add to Cart - Rent
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Features & Benefits</h3>
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share this product
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Product Description
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground">
                      {furniture.description} This premium piece combines
                      exceptional craftsmanship with modern design principles.
                      Made from high-quality materials, it's built to last while
                      providing both comfort and style to your space.
                    </p>
                    <p className="text-muted-foreground mt-4">
                      Perfect for both residential and commercial use, this
                      furniture piece meets the highest standards of quality and
                      durability. Whether you're looking to purchase or rent,
                      you'll enjoy the flexibility and premium experience that
                      comes with every piece in our collection.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{furniture.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Availability:
                        </span>
                        <Badge
                          variant={
                            furniture.availability ? "default" : "destructive"
                          }>
                          {furniture.availability ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material:</span>
                        <span>Premium Quality</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Warranty:</span>
                        <span>1 Year</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{furniture.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assembly:</span>
                        <span>Professional Setup Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span>3-5 Business Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span>{furniture.rating}/5 Stars</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-accent text-accent"
                          />
                        ))}
                      </div>
                      <span className="font-medium">{furniture.rating}</span>
                      <span className="text-muted-foreground">(0 reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.name}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "fill-accent text-accent"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FurnitureDetail;
