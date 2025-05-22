'use client';

import { FC, FormEvent, useEffect } from 'react';
import useProduct, { Product } from '@/hooks/useProduct';
import { useCreateCart, UseCreateCartProps } from '@/hooks/useCreateCart';
import { useUpdateProduct } from '@/hooks/useUpdateProduct';
import useCart from '@/hooks/useCart';
import { getCart, updateCartItem } from '@/requests/cart';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import style from '@/styles/OverviewProduct.module.scss';

export const sessionTestId: string = 'sess_c6elmrk0aau1gtktvzzt55';

const ProductOverview: FC = () => {
  const { product, isLoading } = useProduct();
  const { cart } = useCart(sessionTestId);
  const params: Params = useParams();
  console.log(params);
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Aktuelle Menge im Warenkorb oder 0 falls nicht vorhanden
    const currentQuantity = cart?.stockQuantity ?? 0;
    const newQuantity = currentQuantity + 1;

    console.log(
      `Aktuelle Menge: ${currentQuantity}, Neue Menge: ${newQuantity}`,
    );

    const test = await updateCartItem(
      sessionTestId,
      params.id as string,
      newQuantity,
    );

    console.log(test);
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
          {/*  <img src={product?.imageUrl} alt={product?.name} />*/}
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
