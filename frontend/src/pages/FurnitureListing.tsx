import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { categoryService } from "@/services/categoryService";
import { itemService, Item } from "@/services/itemService";
import sofaImage from "@/assets/sofa-premium.jpg";
import deskImage from "@/assets/desk-walnut.jpg";
import chairImage from "@/assets/chair-office.jpg";

const FurnitureListing = () => {
  const { state, dispatch } = useApp();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await categoryService.getCategories();
        const categoryNames = categoriesResponse.map((cat) => cat.name);
        setCategories(["All", ...categoryNames]);

        // Fetch items
        const itemsResponse = await itemService.getItems();
        setItems(itemsResponse.items);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to default categories
        setCategories([
          "All",
          "Sofa",
          "Chair",
          "Table",
          "Bed",
          "Desk",
          "Storage",
          "Decor",
        ]);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [localPriceRange, setLocalPriceRange] = useState(state.priceRange);

  // Get furniture with images
  const furnitureWithImages = useMemo(() => {
    return items.map((item) => ({
      ...item,
      id: item._id,
      title: item.name,
      type: item.saleType,
      price: item.price || 0,
      rentPrice: item.rentPrice || 0,
      images: item.images && item.images.length > 0 ? item.images : ["/placeholder.svg"],
    }));
  }, [items]);

  // Filter and sort furniture
  const filteredFurniture = useMemo(() => {
    let filtered = furnitureWithImages.filter((item) => {
      // Search filter
      if (
        state.searchQuery &&
        !item.title.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
        !item.description
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (
        state.selectedCategory !== "all" &&
        item.category?.name?.toLowerCase() !== state.selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Type filter
      if (state.typeFilter !== "all") {
        if (state.typeFilter === "sell" && item.type === "rent") return false;
        if (state.typeFilter === "rent" && item.type === "sell") return false;
      }

      // Price filter
      const price = item.price || item.rentPrice || 0;
      if (price < state.priceRange[0] || price > state.priceRange[1]) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || a.rentPrice || 0) - (b.price || b.rentPrice || 0);
        case "price-high":
          return (b.price || b.rentPrice || 0) - (a.price || a.rentPrice || 0);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0; // newest
      }
    });

    return filtered;
  }, [
    furnitureWithImages,
    state.searchQuery,
    state.selectedCategory,
    state.typeFilter,
    state.priceRange,
    sortBy,
  ]);

  const handleAddToCart = (furniture: any, type: "sell" | "rent") => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { furniture, quantity: 1, type },
    });
  };

  const handleToggleWishlist = (furnitureId: string) => {
    if (state.wishlist.includes(furnitureId)) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: furnitureId });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: furnitureId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Furniture Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium furniture for every space and style
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Search */}
              <div className="space-y-2 mb-6">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search furniture..."
                    value={state.searchQuery}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SEARCH_QUERY",
                        payload: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2 mb-6">
                <Label>Category</Label>
                <Select
                  value={state.selectedCategory}
                  onValueChange={(value) =>
                    dispatch({ type: "SET_CATEGORY_FILTER", payload: value })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2 mb-6">
                <Label>Type</Label>
                <Select
                  value={state.typeFilter}
                  onValueChange={(value: "all" | "sell" | "rent") =>
                    dispatch({ type: "SET_TYPE_FILTER", payload: value })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sell">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4 mb-6">
                <Label>
                  Price Range: ₹{localPriceRange[0]} - ₹{localPriceRange[1]}
                </Label>
                <Slider
                  value={localPriceRange}
                  onValueChange={(value) =>
                    setLocalPriceRange(value as [number, number])
                  }
                  onValueCommit={(value) =>
                    dispatch({
                      type: "SET_PRICE_RANGE",
                      payload:
                        value.length === 2
                          ? ([value[0], value[1]] as [number, number])
                          : localPriceRange,
                    })
                  }
                  max={5000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-muted-foreground">
                Showing {filteredFurniture.length} of{" "}
                {furnitureWithImages.length} items
              </p>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}>
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}>
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
              {filteredFurniture.map((furniture) => (
                <Card
                  key={furniture.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={furniture.images[0]}
                        alt={furniture.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white transition-colors duration-200"
                        onClick={() => handleToggleWishlist(furniture.id)}>
                        <Heart
                          className={`w-4 h-4 ${
                            state.wishlist.includes(furniture.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                      {furniture.type === "both" && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold">
                          Sale & Rent
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <Link to={`/furniture/${furniture.id}`} className="block">
                      <h3 className="font-semibold text-lg mb-2 hover:text-accent transition-colors">
                        {furniture.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {furniture.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-medium ml-1">
                          {furniture.rating}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        ({furniture.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {furniture.price && (
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">
                            ₹{furniture.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Purchase
                          </span>
                        </div>
                      )}
                      {furniture.rentPrice && (
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-lg font-bold text-accent">
                              ₹{furniture.rentPrice}/mo
                            </span>
                            {furniture.deposit && (
                              <span className="text-sm text-muted-foreground block">
                                + ₹{furniture.deposit} deposit
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Rental
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex gap-2">
                    {furniture.price && (
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(furniture, "sell")}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy
                      </Button>
                    )}
                    {furniture.rentPrice && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(furniture, "rent")}
                        className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold">
                        <Calendar className="w-4 h-4 mr-2" />
                        Rent
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredFurniture.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">
                  No furniture found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
                    dispatch({ type: "SET_CATEGORY_FILTER", payload: "all" });
                    dispatch({ type: "SET_TYPE_FILTER", payload: "all" });
                    dispatch({ type: "SET_PRICE_RANGE", payload: [0, 5000] });
                  }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureListing;
