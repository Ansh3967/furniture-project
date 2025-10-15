import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-strong">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-primary">Create Account</CardTitle>
            <CardDescription>
              Choose your account type to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/signup/user')}
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-primary hover:opacity-90"
              >
                <User className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Customer Account</div>
                  <div className="text-sm opacity-90">Browse and purchase furniture</div>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/signup/admin')}
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Shield className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Admin Account</div>
                  <div className="text-sm opacity-70">Manage the furniture shop</div>
                </div>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:underline font-medium">
                  Login here
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;