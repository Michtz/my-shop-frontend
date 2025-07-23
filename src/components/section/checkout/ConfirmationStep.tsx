'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/system/Container';
import Button from '@/components/system/Button';
import { axiosInstance } from '@/requests/base.request';
import { Logger } from '@/utils/Logger.class';

interface OrderData {
  orderNumber: string;
  status: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    product?: {
      name: string;
      _id: string;
    };
  }>;
  customerInfo?: {
    guestInfo?: {
      email: string;
      firstName: string;
      lastName: string;
    };
    selectedAddress?: {
      street: string;
      houseNumber: string;
      city: string;
      zipCode: string;
      country: string;
    };
  };
  paidAt: string;
}

const ConfirmationStep: React.FC = () => {
  const { orderNumber } = useParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(orderNumber);
    if (orderNumber) {
      fetchOrderDetails(orderNumber as string);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async (orderNum: string) => {
    try {
      const response = await axiosInstance.get(`/api/order/${orderNum}`);
      console.log(response); // Todo: fix response from backend
      if (response) {
        setOrderData(response.data);
      }
    } catch (error) {
      Logger.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container justifyContent="center" padding={true}>
        <div>Loading order details...</div>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container justifyContent="center" padding={true}>
        <div>Order not found</div>
        <Button onClick={() => router.push('/')}>Back to Shop</Button>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container flow="column" alignItems="center" maxWidth="600" padding={true}>
      {/* Success Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ color: '#28a745', marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Thank you for your purchase!
        </p>
      </div>

      {/* Order Number */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          width: '100%',
        }}
      >
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Order Number</h3>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: '#007bff',
          }}
        >
          {orderData.orderNumber}
        </div>
        <p
          style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}
        >
          Order placed on {formatDate(orderData.paidAt)}
        </p>
      </div>

      {/* Order Summary */}
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <h3 style={{ textAlign: 'left', marginBottom: '1rem' }}>
          Order Summary
        </h3>

        {orderData.items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>
                {item.product?.name || `Product ${item.productId}`}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                Quantity: {item.quantity} × €{item.price.toFixed(2)}
              </div>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              €{(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Total */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          <span>Total</span>
          <span>€{orderData.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Information */}
      {orderData.customerInfo?.selectedAddress && (
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <h3 style={{ textAlign: 'left', marginBottom: '1rem' }}>
            Delivery Address
          </h3>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              textAlign: 'left',
            }}
          >
            {orderData.customerInfo.guestInfo && (
              <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {orderData.customerInfo.guestInfo.firstName}{' '}
                {orderData.customerInfo.guestInfo.lastName}
              </div>
            )}
            <div>
              {orderData.customerInfo.selectedAddress.street}{' '}
              {orderData.customerInfo.selectedAddress.houseNumber}
            </div>
            <div>
              {orderData.customerInfo.selectedAddress.zipCode}{' '}
              {orderData.customerInfo.selectedAddress.city}
            </div>
            <div>
              {orderData.customerInfo.selectedAddress.country.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* What's Next */}
      <div
        style={{
          width: '100%',
          padding: '1.5rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h4 style={{ margin: '0 0 1rem 0', color: '#1976d2' }}>What's Next?</h4>
        <ul
          style={{
            textAlign: 'left',
            margin: 0,
            paddingLeft: '1.5rem',
            color: '#666',
          }}
        >
          <li>You'll receive an email confirmation shortly</li>
          <li>We'll notify you when your order ships</li>
          <li>Expected delivery: 3-5 business days</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <Button onClick={() => router.push('/')} style={{ flex: 1 }}>
          Continue Shopping
        </Button>
        <Button
          onClick={() => window.print()}
          variant="secondary"
          style={{ flex: 1 }}
        >
          Print Order
        </Button>
      </div>

      {/* Footer Note */}
      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#999',
          textAlign: 'center',
        }}
      >
        Questions about your order? Contact us at support@myshop.com
      </p>
    </Container>
  );
};

export default ConfirmationStep;
