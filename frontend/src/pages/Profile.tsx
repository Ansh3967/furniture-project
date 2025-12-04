import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const Profile = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (state.user) {
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        phone: state.user.phone || '',
        address: state.user.address || ''
      });
    }
  }, [state.user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Add phone number validation
    if (name === 'phone') {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedValue = numericValue.slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    // Add phone validation
    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    
    try {
      setLoading(true);
      const updatedUser = await authService.updateUserProfile(formData);
      
      // Update the user in context
      dispatch({ 
        type: 'USER_LOGIN', 
        payload: {
          ...updatedUser,
          role: 'user'
        }
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (state.user) {
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        phone: state.user.phone || '',
        address: state.user.address || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName"
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName"
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email} 
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone} 
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="Enter 10 digit phone number"
                />
                {isEditing && formData.phone && formData.phone.length !== 10 && (
                  <p className="text-sm text-destructive">Phone number must be exactly 10 digits</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address"
                name="address"
                value={formData.address} 
                onChange={handleInputChange}
                readOnly={!isEditing}
                rows={3}
                placeholder="Enter your address..."
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;