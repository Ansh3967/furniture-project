import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

const Profile = () => {
  const { state } = useApp();

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
                <Label>Name</Label>
                <Input value={state.user?.name || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={state.user?.email || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={state.user?.phone || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={state.user?.role || ''} readOnly className="capitalize" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={state.user?.address || ''} readOnly />
            </div>
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;