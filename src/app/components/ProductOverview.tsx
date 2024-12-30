'use client';

import { FC } from 'react';
import { useProduct } from '@/hooks/useProduct';

interface ProductOverviewProps {
  id: string;
}

const ProductOverview: FC<ProductOverviewProps> = ({ id }) => {
  const { product, isLoading, error } = useProduct({ id });

  return (
    <main>
      <h1>{product?.name}</h1>
      <div>
        {/*  <img src={product?.imageUrl} alt={product?.name} />*/}
        <p>{product?.description}</p>
        <p>Preis: €{product?.price}</p>
        <p>Verfügbar: {product?.stockQuantity}</p>
      </div>
    </main>
  );
};

export default ProductOverview;
