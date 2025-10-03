import React, { useState, useEffect } from 'react';
import { itemService } from '../services/itemService';
import { authService } from '../services/authService';
import { categoryService } from '../services/categoryService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const IntegrationTest: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setConnectionStatus('Testing...');
    
    try {
      // Test basic connection by fetching items
      const fetchedItems = await itemService.getAllItems();
      setItems(fetchedItems);
      setConnectionStatus('✅ Connection successful!');
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      setConnectionStatus('❌ Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test auth endpoint (this might fail if no users exist, but should not be a connection error)
      await authService.getUserProfile();
      setConnectionStatus('✅ Auth endpoint accessible!');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setConnectionStatus('✅ Auth endpoint working (401 expected - not logged in)');
      } else {
        setError(err.message || 'Auth test failed');
        setConnectionStatus('❌ Auth test failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const testCategories = async () => {
    setLoading(true);
    setError(null);
    setConnectionStatus('Testing categories...');
    
    try {
      const categories = await categoryService.getAllCategories();
      setConnectionStatus(`✅ Categories API working! Found ${categories.length} categories`);
    } catch (err: any) {
      setError(err.message || 'Categories test failed');
      setConnectionStatus('❌ Categories test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Backend Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testConnection} 
            disabled={loading}
            variant="default"
          >
            Test Items API
          </Button>
          <Button 
            onClick={testAuth} 
            disabled={loading}
            variant="outline"
          >
            Test Auth API
          </Button>
          <Button 
            onClick={testCategories} 
            disabled={loading}
            variant="outline"
          >
            Test Categories API
          </Button>
        </div>
        
        <div className="p-3 bg-gray-100 rounded">
          <strong>Status:</strong> {connectionStatus}
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {items.length > 0 && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            <strong>Items fetched:</strong> {items.length} items found
            <div className="mt-2 text-sm">
              {items.slice(0, 3).map((item, index) => (
                <div key={index}>- {item.name || `Item ${index + 1}`}</div>
              ))}
              {items.length > 3 && <div>... and {items.length - 3} more</div>}
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Backend URL:</strong> http://localhost:5000/api</p>
          <p><strong>Frontend URL:</strong> http://localhost:8080</p>
          <p><strong>Make sure both servers are running:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Backend: <code>cd backend && npm run dev</code></li>
            <li>Frontend: <code>cd frontend && npm run dev</code></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationTest;
