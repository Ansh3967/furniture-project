import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Search, Filter, Eye, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { categoryService, Category } from '@/services/categoryService';

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rentPrice?: number;
  deposit?: number;
  type: 'sell' | 'rent' | 'both';
  availability: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

const ItemManagement = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    rentPrice: 0,
    deposit: 0,
    type: 'sell' as 'sell' | 'rent' | 'both',
    availability: true,
    images: [] as File[]
  });
  const { toast } = useToast();

  // Load items from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load categories first
        console.log('Loading categories...');
        const categoriesResponse = await categoryService.adminGetAllCategories();
        console.log('Categories loaded:', categoriesResponse);
        setCategories(categoriesResponse.categories);
        
        // Load items
        const response = await adminService.getItems();
        setItems(response.items || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
        // Show empty state on error
        setItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleAddItem = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Title, Description, Category).",
          variant: "destructive",
        });
        return;
      }

      // Create item data object
      const itemData = {
        name: formData.title, // Backend expects 'name' not 'title'
        description: formData.description,
        category: formData.category, // This should be a category ID
        availability: formData.availability ? 'available' : 'out_of_stock',
        saleType: formData.type === 'sell' ? 'sale' : formData.type === 'rent' ? 'rent' : 'both',
        price: formData.price || undefined,
        rentPrice: formData.rentPrice || undefined,
        depositPrice: formData.deposit || 0,
        condition: 'new',
        isFeatured: false,
        viewCount: 0
      };

      console.log('Creating item with data:', itemData);
      console.log('Available categories:', categories);

      // API call to add item
      const response = await adminService.createItem(itemData);
      const newItem = response.item;
      
      // Transform the response to match frontend structure
      const transformedItem = {
        _id: newItem._id,
        title: newItem.name,
        description: newItem.description,
        category: newItem.category?.name || formData.category,
        price: newItem.price || 0,
        rentPrice: newItem.rentPrice || 0,
        deposit: newItem.depositPrice || 0,
        type: newItem.saleType === 'sale' ? 'sell' : newItem.saleType === 'rent' ? 'rent' : 'both',
        availability: newItem.availability === 'available',
        images: newItem.images || ['/placeholder.svg'],
        rating: 0,
        reviewCount: 0,
        createdAt: newItem.createdAt
      };
      
      setItems([...items, transformedItem]);
      setIsAddDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: 0,
        rentPrice: 0,
        deposit: 0,
        type: 'sell',
        availability: true,
        images: []
      });
      
      toast({
        title: "Item Added",
        description: "New furniture item has been created successfully.",
      });
    } catch (error: any) {
      console.error('Add item error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = "Failed to add item. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;
    
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Title, Description, Category).",
          variant: "destructive",
        });
        return;
      }

      // Create item data object
      const itemData = {
        name: formData.title, // Backend expects 'name' not 'title'
        description: formData.description,
        category: formData.category, // This should be a category ID
        availability: formData.availability ? 'available' : 'out_of_stock',
        saleType: formData.type === 'sell' ? 'sale' : formData.type === 'rent' ? 'rent' : 'both',
        price: formData.price || undefined,
        rentPrice: formData.rentPrice || undefined,
        depositPrice: formData.deposit || 0
      };

      // API call to update item
      const response = await adminService.updateItem(editingItem._id, itemData);
      const updatedItem = response.item;
      
      // Transform the response to match frontend structure
      const transformedItem = {
        _id: updatedItem._id,
        title: updatedItem.name,
        description: updatedItem.description,
        category: updatedItem.category?.name || formData.category,
        price: updatedItem.price || 0,
        rentPrice: updatedItem.rentPrice || 0,
        deposit: updatedItem.depositPrice || 0,
        type: updatedItem.saleType === 'sale' ? 'sell' : updatedItem.saleType === 'rent' ? 'rent' : 'both',
        availability: updatedItem.availability === 'available',
        images: updatedItem.images || editingItem.images,
        rating: editingItem.rating,
        reviewCount: editingItem.reviewCount,
        createdAt: updatedItem.createdAt
      };
      
      setItems(items.map(item => 
        item._id === editingItem._id ? transformedItem : item
      ));
      
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: 0,
        rentPrice: 0,
        deposit: 0,
        type: 'sell',
        availability: true,
        images: []
      });
      
      toast({
        title: "Item Updated",
        description: "Furniture item has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Edit item error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update item. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      // API call to delete item
      await adminService.deleteItem(itemId);
      setItems(items.filter(item => item._id !== itemId));
      
      toast({
        title: "Item Deleted",
        description: "Furniture item has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
      rentPrice: item.rentPrice || 0,
      deposit: item.deposit || 0,
      type: item.type,
      availability: item.availability,
      images: []
    });
    setIsEditDialogOpen(true);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Item Management</h1>
          <p className="text-muted-foreground">
            Manage your furniture inventory and product listings
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Create a new furniture item for your inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter item title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter item description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="rentPrice">Rent Price (₹)</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type">Item Type</Label>
                <Select value={formData.type} onValueChange={(value: 'sell' | 'rent' | 'both') => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sell">Sell Only</SelectItem>
                    <SelectItem value="rent">Rent Only</SelectItem>
                    <SelectItem value="both">Both Sell & Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={formData.availability}
                  onCheckedChange={(checked) => setFormData({ ...formData, availability: checked })}
                />
                <Label htmlFor="availability">Available for purchase/rent</Label>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <Label htmlFor="images">Item Images</Label>
                <div className="mt-2">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload multiple images for the item. Supported formats: JPG, PNG, GIF. Max size: 10MB per file.
                  </p>
                </div>
                
                {/* Preview uploaded images */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <Label>Preview Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
            <DialogFooter className="flex-shrink-0">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({filteredItems.length})</CardTitle>
          <CardDescription>
            Manage your furniture inventory and product listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{item.price}</p>
                      {item.rentPrice && (
                        <p className="text-sm text-muted-foreground">
                          Rent: ₹{item.rentPrice}/mo
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.type === 'both' ? 'Sell & Rent' : item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.availability ? "default" : "secondary"}>
                      {item.availability ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{item.rating}</span>
                      <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the item
                              and remove it from your inventory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(item._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the item information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Item Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter item title"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-rentPrice">Rent Price (₹)</Label>
                <Input
                  id="edit-rentPrice"
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) => setFormData({ ...formData, rentPrice: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-deposit">Deposit (₹)</Label>
                <Input
                  id="edit-deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-type">Item Type</Label>
              <Select value={formData.type} onValueChange={(value: 'sell' | 'rent' | 'both') => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sell">Sell Only</SelectItem>
                  <SelectItem value="rent">Rent Only</SelectItem>
                  <SelectItem value="both">Both Sell & Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-availability"
                checked={formData.availability}
                onCheckedChange={(checked) => setFormData({ ...formData, availability: checked })}
              />
              <Label htmlFor="edit-availability">Available for purchase/rent</Label>
            </div>
            
            {/* Image Upload Section for Edit */}
            <div>
              <Label htmlFor="edit-images">Update Item Images</Label>
              <div className="mt-2">
                <Input
                  id="edit-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload new images to replace existing ones. Supported formats: JPG, PNG, GIF. Max size: 10MB per file.
                </p>
              </div>
              
              {/* Preview uploaded images for edit */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <Label>New Images Preview</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemManagement;
