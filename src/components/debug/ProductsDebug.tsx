'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/requests/products.request';
import { ProductResponse } from '@/types/product.types';

const ProductsDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<{
    loading: boolean;
    response?: ProductResponse;
    error?: any;
    rawResponse?: any;
  }>({
    loading: true
  });

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🔍 Testing API call...');
        const response = await getProducts();
        console.log('📦 Products response:', response);
        
        setDebugInfo({
          loading: false,
          response,
          rawResponse: response
        });
      } catch (error) {
        console.error('❌ API call failed:', error);
        setDebugInfo({
          loading: false,
          error
        });
      }
    };

    testApi();
  }, []);

  if (debugInfo.loading) {
    return <div>🔄 Testing API connection...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🐛 Products API Debug Info</h3>
      
      {debugInfo.error && (
        <div style={{ color: 'red' }}>
          <h4>❌ Error:</h4>
          <pre>{JSON.stringify(debugInfo.error, null, 2)}</pre>
        </div>
      )}
      
      {debugInfo.response && (
        <div style={{ color: 'green' }}>
          <h4>✅ Success!</h4>
          <p><strong>Success:</strong> {debugInfo.response.success ? 'true' : 'false'}</p>
          <p><strong>Products count:</strong> {debugInfo.response.data?.length || 0}</p>
          
          {debugInfo.response.data && debugInfo.response.data.length > 0 && (
            <div>
              <h5>First Product:</h5>
              <pre>{JSON.stringify(debugInfo.response.data[0], null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      
      <details>
        <summary>Raw Response</summary>
        <pre>{JSON.stringify(debugInfo.rawResponse, null, 2)}</pre>
      </details>
    </div>
  );
};

export default ProductsDebug;