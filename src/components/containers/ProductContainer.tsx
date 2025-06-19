'use client';

import React, { FC, FormEvent, JSX, useEffect, useState } from 'react';
import useProduct from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import { addToCart, replaceCartItems } from '@/requests/cart.request';
import { useParams, useRouter } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
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

interface FormFields {
  quantity: number;
}
const getDefaultValues = (product = {} as any): any => {
  return {
    quantity: 1,
  };
};

const ProductOverview: FC = () => {
  const { product } = useProduct();
  const router = useRouter();
  const { products } = useProducts();
  const { sessionId } = useAuth();
  const { cart, cartItems } = useCart();
  const { showFeedback } = useFeedback();

  const { register, reset, control, handleSubmit } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: getDefaultValues(product),
  });

  // if (!product) return null;
  // useEffect(() => {
  //   console.log(cart, items);
  // }, [cart]);

  const submit = async (data: any) => {
    try {
      console.log(data);
      const result = await addToCart(
        sessionId!,
        product?._id as string,
        data.quantity,
      );
      console.log('Cart updated:', result);
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
      const existingItem = cartItems.find((item: any) => item.productId === id);
      let updatedItems;

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
          product: products.find((item: any) => item.productId === id),
        };

        updatedItems = [...cartItems, newItem];
      }
      const result = await replaceCartItems(sessionId!, updatedItems);
      await mutate('product', result);
    } catch (error) {
      await mutate('product', cartItems);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  const InformationContainer: FC = () => {
    return (
      <FormContainer
        onSubmitAction={handleSubmit(submit)}
        className={style.textContainer}
      >
        <h1>{product?.name}</h1>
        <div>
          <p>{product?.description}</p>
          <p>Preis: €{product?.price}</p>
          <p>Verfügbar: {product?.stockQuantity}</p>
        </div>
        <Controller
          name="quantity"
          control={control}
          defaultValue={1}
          render={({ field }) => (
            <NumberStepper
              quantity={field.value}
              onQuantityChange={field.onChange}
              min={1}
              max={99}
            />
          )}
        />
        <button type={'submit'}>Add to cart</button>
      </FormContainer>
    );
  };
  const ImageContainer: FC = () => {
    return (
      <Image
        src={product?.imageUrl as string}
        alt={product?.name || 'Product image'}
        fill
        className={style.productImage}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
    );
  };

  return (
    <Container flow={'column'}>
      <div className={style.overviewContainer}>
        <span className={style.imageContainer}>
          {product?.imageUrl && <ImageContainer />}
        </span>
        <InformationContainer />
      </div>
      <Hr />
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
