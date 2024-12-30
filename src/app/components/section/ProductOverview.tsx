'use client';

import { FC, useState } from 'react';
import { useProduct } from '@/hooks/useProduct';

const ProductOverview: FC = () => {
  const { product, isLoading } = useProduct();

  const handleClick = () => {};

  return (
    <>
      <h1>{product?.name}</h1>
      <div>
        {/*  <img src={product?.imageUrl} alt={product?.name} />*/}
        <p>{product?.description}</p>
        <p>Preis: €{product?.price}</p>
        <p>Verfügbar: {product?.stockQuantity}</p>
      </div>
      <button onClick={handleClick}>Add to cart</button>
    </>
  );
};

export default ProductOverview;
