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
import { useTranslation } from 'react-i18next';

interface FormFields {
  quantity: number;
}

const getDefaultValues = (): any => {
  return {
    quantity: 1,
  };
};

const ProductOverview: FC = () => {
  const { t } = useTranslation();
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
  const { sessionData, isSessionReady } = useAuth();
  const { cart, cartItems } = useCart();
  const { showFeedback } = useFeedback();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: getDefaultValues(),
  });

  const watchedQuantity = watch('quantity', 1);

  const submit = async (data: any) => {
    try {
      if (isOutOfStock) {
        showFeedback(t('product.outOfStock'), 'error');
        return;
      }

      if (availableStock < data.quantity) {
        showFeedback(
          t('product.onlyXAvailable', { count: availableStock }),
          'error',
        );
        return;
      }

      if (!isSessionReady || !sessionData?.sessionId) {
        showFeedback('feedback.session-not-ready', 'error');
        return;
      }

      const result = await addToCart(
        sessionData.sessionId,
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
      if (!cartItems || !isSessionReady || !sessionData?.sessionId) {
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


  const ConnectionStatus: FC = () => {
    if (!isConnected) {
      return (
        <div style={{ color: 'orange', fontSize: '12px', marginBottom: '8px' }}>
          ⚠️ {t('product.connectionLost')}
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
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {t('product.soldOut')}
          </span>
        ) : isLowStock ? (
          <span style={{ color: 'orange', fontWeight: 'bold' }}>
            {t('product.onlyXLeft', { count: availableStock })}
          </span>
        ) : (
          <span style={{ color: 'green' }}>
            {t('product.xAvailable', { count: availableStock })}
          </span>
        )}
      </div>

      {cartCount > 0 && (
        <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
          🛒 {t('product.othersInCart', { count: cartCount })}
        </div>
      )}

      {/*/!* Stock Conflicts *!/*/}
      {/*{hasReservationConflicts && (*/}
      {/*  <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>*/}
      {/*    ⚠️ {t('product.stockChanged')}*/}
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
          <p>{t('product.price', { price: product?.price })}</p>
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
              {t('product.onlyXAvailableShort', { count: availableStock })}
            </div>
          )}

          <Button
            loading={isSubmitting}
            size={'big'}
            flex
            type={'submit'}
            disabled={isOutOfStock || isQuantityTooHigh}
          >
            {isOutOfStock ? t('product.soldOut') : t('product.addToCart')}
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
      <h1 className={style.addTitle}>{t('product.otherCustomersBought')}</h1>
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
