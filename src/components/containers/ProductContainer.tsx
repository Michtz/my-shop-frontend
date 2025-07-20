'use client';

import React, { FC } from 'react';
import useProduct from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import { addToCart, replaceCartItems } from '@/requests/cart.request';
import { useRouter } from 'next/navigation';
import style from '@/styles/OverviewProduct.module.scss';
import { mutate } from 'swr';
import Image from 'next/image';
import NumberStepper from '@/components/system/NumberStepper';
import { Container, FormContainer } from '@/components/system/Container';
import { Controller, useForm } from 'react-hook-form';
import { useFeedback } from '@/hooks/FeedbackHook';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import useProducts from '@/hooks/useProducts';
import { Hr } from '@/components/system/Hr';
import { useAuth } from '@/hooks/AuthHook';
import { Logger } from '@/utils/Logger.class';
import Button, { ButtonContainer } from '@/components/system/Button';

interface FormFields {
  quantity: number;
}

const getDefaultValues = (product = {} as any): any => {
  return {
    quantity: 1,
  };
};

const ProductOverview: FC = () => {
  const {
    product,
    isConnected,
    availableStock,
    cartCount,
    isLowStock,
    isOutOfStock,
  } = useProduct();
  const router = useRouter();
  const { products } = useProducts();
  const { sessionData } = useAuth();
  const { cart, cartItems, hasReservationConflicts } = useCart();
  const { showFeedback } = useFeedback();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: getDefaultValues(product),
  });

  const watchedQuantity = watch('quantity', 1);

  const submit = async (data: any) => {
    try {
      if (isOutOfStock) {
        showFeedback('Produkt ist ausverkauft', 'error');
        return;
      }

      if (availableStock < data.quantity) {
        showFeedback(`Nur noch ${availableStock} auf Lager verfügbar`, 'error');
        return;
      }

      const result = await addToCart(
        sessionData?.sessionId as string,
        product?._id as string,
        data.quantity,
      );
      await mutate('cart', result);
      showFeedback('feedback.add-to-cart-success', 'success');
    } catch (error) {
      showFeedback('feedback.data-saved-error', 'error');
      Logger.error('Failed to update cart:', error);
      await mutate('cart', cart);
    }
  };

  const handleAddToCart = async (id: string) => {
    try {
      if (!cartItems || !sessionData?.sessionId) {
        console.warn('Cart items or session not available');
        return;
      }

      const existingItem = cartItems.find((item: any) => item.productId === id);
      let updatedItems: {
        productId: string;
        quantity: number;
        product?: any;
      }[];

      if (existingItem) {
        updatedItems = cartItems.map((item: any) =>
          item.productId === id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const newItem = {
          productId: id,
          quantity: 1,
          product: products.find((item: any) => item._id === id),
        };

        updatedItems = [...cartItems, newItem];
      }

      const result = await replaceCartItems(
        sessionData.sessionId,
        updatedItems as { productId: string; quantity: number }[],
      );

      await mutate('product', result);
    } catch (error) {
      console.error('Add to cart error:', error);
      await mutate('product', cartItems);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  const formatReservationTimer = (): string | null => {
    if (!cartItems) return null;

    const cartItem = cartItems.find(
      (item: any) => item.productId === product?._id,
    );
    if (!cartItem?.reservationTimeLeft) return null;

    const minutes = Math.floor(cartItem.reservationTimeLeft / 60);
    const seconds = cartItem.reservationTimeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const ConnectionStatus: FC = () => {
    if (!isConnected) {
      return (
        <div style={{ color: 'orange', fontSize: '12px', marginBottom: '8px' }}>
          ⚠️ Verbindung unterbrochen - Daten werden möglicherweise nicht live
          aktualisiert
        </div>
      );
    }
    return null;
  };

  const StockInfo: FC = () => (
    <div className={style.stockInfo}>
      <ConnectionStatus />

      <div className={style.stockDisplay}>
        {isOutOfStock ? (
          <span style={{ color: 'red', fontWeight: 'bold' }}>Ausverkauft</span>
        ) : isLowStock ? (
          <span style={{ color: 'orange', fontWeight: 'bold' }}>
            Nur noch {availableStock} verfügbar
          </span>
        ) : (
          <span style={{ color: 'green' }}>{availableStock} verfügbar</span>
        )}
      </div>

      {cartCount > 0 && (
        <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
          🛒 {cartCount} andere haben das im Warenkorb
        </div>
      )}

      {/*/!* Stock Conflicts *!/*/}
      {/*{hasReservationConflicts && (*/}
      {/*  <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>*/}
      {/*    ⚠️ Lagerbestand hat sich geändert*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );

  const DescriptionContainer: FC = () => (
    <div className={style.descriptionContainer}>
      <h1>{product?.name}</h1>
      <div>
        <p>{product?.description}</p>
        <span className={style.descriptionInfo}>
          <StockInfo />
          <p>Preis: €{product?.price}</p>
        </span>
      </div>
    </div>
  );

  const InformationContainer: FC = () => {
    const isQuantityTooHigh = watchedQuantity > availableStock;

    return (
      <FormContainer
        onSubmitAction={handleSubmit(submit)}
        className={style.textContainer}
      >
        <DescriptionContainer />
        <ButtonContainer>
          <Controller
            name="quantity"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <NumberStepper
                quantity={field.value}
                onQuantityChange={field.onChange}
                min={1}
                max={Math.max(1, availableStock)}
              />
            )}
          />

          {isQuantityTooHigh && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              Nur {availableStock} verfügbar
            </div>
          )}

          <Button
            loading={isSubmitting}
            size={'big'}
            flex
            type={'submit'}
            disabled={isOutOfStock || isQuantityTooHigh}
          >
            {isOutOfStock ? 'Ausverkauft' : 'Add to cart'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    );
  };

  return (
    <Container flow={'column'} padding={false} maxWidth={'1150'}>
      <div className={style.overviewContainer}>
        <span className={style.imageContainer}>
          {product?.imageUrl && (
            <Image
              src={product?.imageUrl as string}
              alt={product?.name || 'Product image'}
              fill
              className={style.productImage}
              priority
            />
          )}
        </span>
        <InformationContainer />
      </div>
      <Hr />
      <h1 className={style.addTitle}>Das kauften andere Kunden</h1>
      <CartsContainer>
        {products?.map((product) => {
          return (
            <ProductCard
              key={product._id}
              id={product._id}
              title={product.name}
              description={product.description}
              image={product.imageUrl}
              price={product.price}
              onCardClick={() => handleCardClick(product._id)}
              onIconClick={() => handleAddToCart(product._id)}
            />
          );
        })}
      </CartsContainer>
    </Container>
  );
};

export default ProductOverview;
