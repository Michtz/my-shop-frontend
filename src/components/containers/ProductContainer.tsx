'use client';

import React, { FC, FormEvent, JSX, useEffect, useState } from 'react';
import useProduct from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import {
  addToCart,
  replaceCartItems,
  updateCartItem,
} from '@/requests/cart.request';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import style from '@/styles/OverviewProduct.module.scss';
import { log } from 'node:util';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { IProduct } from '@/types/product.types';
import { mutate } from 'swr';
import Image from 'next/image';
import NumberStepper from '@/components/system/NumberStepper';
import { FormContainer } from '@/components/system/Container';
import { Controller, useForm } from 'react-hook-form';

export const sessionTestId: string = 'sess_ytsdk6q1axj7fezp3bc7v';

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
  const { cart, cartItems } = useCart(sessionTestId);
  const params: Params = useParams();
  const [quantity, setQuantity] = useState(1);

  const { register, reset, control, formState, handleSubmit } =
    useForm<FormFields>({
      mode: 'onChange',
      defaultValues: getDefaultValues(product),
    });

  if (!product) return null;
  // useEffect(() => {
  //   console.log(cart, items);
  // }, [cart]);

  const submit = async (data: any) => {
    try {
      console.log(data);
      // const existingItem = cartItems.find(
      //   (item: any) => item.productId === params.id,
      // );
      // let updatedItems;
      //
      // if (existingItem) {
      //   updatedItems = cartItems.map((item: any) =>
      //     item.productId === params.id
      //       ? { ...item, quantity: item.quantity + data.quantity }
      //       : item,
      //   );
      // } else {
      //   const newItem = {
      //     productId: params.id,
      //     quantity: 1,
      //     product: product,
      //   };
      //
      //   updatedItems = [...cartItems, newItem];
      // }

      const result = await addToCart(sessionTestId, product._id, data.quantity);
      console.log('Cart updated:', result);
      await mutate('cart', result);
    } catch (error) {
      console.error('Failed to update cart:', error);
      await mutate('cart', cart);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    setQuantity(newQuantity);
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
    <div className={style.overviewContainer}>
      <span className={style.imageContainer}>
        {product?.imageUrl && <ImageContainer />}
      </span>
      <InformationContainer />
    </div>
  );
};

export default ProductOverview;
