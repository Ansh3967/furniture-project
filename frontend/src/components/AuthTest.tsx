import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/authService';

const AuthTest = () => {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testUserRegister = async () => {
    try {
      addResult('Testing user registration...');
      const response = await authService.userRegister({
        firstName: 'Test',
        lastName: 'User',
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        phone: '1234567890'
      });
      addResult(`✅ User registration successful: ${response.message}`);
    } catch (error: any) {
      addResult(`❌ User registration failed: ${error.message}`);
      if (error.response) {
        addResult(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const testUserLogin = async () => {
    try {
      addResult('Testing user login...');
      const response = await authService.userLogin({
        email: 'testuser@example.com',
        password: 'password123'
      });
      addResult(`✅ User login successful: ${response.user.firstName}`);
    } catch (error: any) {
      addResult(`❌ User login failed: ${error.message}`);
      if (error.response) {
        addResult(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const testAdminRegister = async () => {
    try {
      addResult('Testing admin registration...');
      const response = await authService.adminRegister({
        username: `testadmin${Date.now()}`,
        email: `testadmin${Date.now()}@example.com`,
        password: 'password123'
      });
      addResult(`✅ Admin registration successful: ${response.message}`);
    } catch (error: any) {
      addResult(`❌ Admin registration failed: ${error.message}`);
      if (error.response) {
        addResult(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const testAdminLogin = async () => {
    try {
      addResult('Testing admin login...');
      const response = await authService.adminLogin({
        email: 'admin@test.com',
        password: 'password123'
      });
      addResult(`✅ Admin login successful: ${response.admin.username}`);
    } catch (error: any) {
      addResult(`❌ Admin login failed: ${error.message}`);
      if (error.response) {
        addResult(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testUserRegister}>Test User Register</Button>
          <Button onClick={testUserLogin}>Test User Login</Button>
          <Button onClick={testAdminRegister}>Test Admin Register</Button>
          <Button onClick={testAdminLogin}>Test Admin Login</Button>
          <Button onClick={clearResults} variant="outline">Clear</Button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          {results.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click a button above to test authentication.</p>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
