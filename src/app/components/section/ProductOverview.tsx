'use client';

import { FC, FormEvent, useEffect } from 'react';
import useProduct from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import { replaceCartItems } from '@/requests/cart.request';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import style from '@/styles/OverviewProduct.module.scss';
import { log } from 'node:util';

export const sessionTestId: string = 'sess_nrls9zo5e9076bl9vuw8zt';

const ProductOverview: FC = () => {
  const { product, isLoading } = useProduct();
  const { cart, items, mutate } = useCart(sessionTestId);
  const params: Params = useParams();

  console.log(params);

  useEffect(() => {
    console.log(cart, items);
  }, [cart]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if item already exists in cart
    const existingItem = items.find(
      (item: any) => item.productId === params.id,
    );

    let updatedItems;

    if (existingItem) {
      // Item exists - update quantity
      updatedItems = items.map((item: any) =>
        item.productId === params.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      // Item doesn't exist - add new item
      const newItem = {
        productId: params.id,
        quantity: 1,
        // Add other required fields if needed
        product: product, // or just the necessary product data
      };

      updatedItems = [...items, newItem];
    }

    try {
      const result = await replaceCartItems(sessionTestId, updatedItems);
      console.log('Cart updated:', result);
      mutate();
    } catch (error) {
      console.error('Failed to update cart:', error);
      mutate();
    }
  };

  if (isLoading) return <>is loading</>;

  return (
    <div className={style.overviewContainer}>
      <span className={style.imageContainer}>
        <img
          alt={'beschriftung'}
          title="Klicken zum Vergrössern"
          width="300"
          height={'auto'}
          loading="lazy"
          src="https://www.espresso-factory.ch/WebRoot/Store/Shops/168527/623C/4066/C453/842C/FF53/0A01/080E/9E68/BiancaV3_ml.png"
        />
      </span>
      <span className={style.textContainer}>
        <h1>{product?.name}</h1>

        <div>
          <p>{product?.description}</p>
          <p>Preis: €{product?.price}</p>
          <p>Verfügbar: {product?.stockQuantity}</p>
        </div>
        <button onClick={handleSubmit}>Add to cart</button>
      </span>
    </div>
  );
};

export default ProductOverview;
