'use client';

import { FC, FormEvent } from 'react';
import useProduct, { Product } from '@/hooks/useProduct';
import { useCreateCart, UseCreateCartProps } from '@/hooks/useCreateCart';
import { useUpdateProduct } from '@/hooks/useUpdateProduct';

const ProductOverview: FC = () => {
  const { product, isLoading } = useProduct();
  const { updateProduct, isUpdating, error } = useUpdateProduct();

  const handleClick = async () => {
    console.log(product?._id);
    const newItem: UseCreateCartProps = {
      quantity: 1,
      id: product?._id,
    };

    try {
      const result = await createCartItem(newItem);
      console.log(result);
    } catch (error) {
      console.error('Error creating cart item:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!product?._id) return;
    try {
      const updatedProduct: Product = await updateProduct({
        id: product._id,
        data: { stockQuantity: 23, name: 'neuer name' },
      });
      console.log(updatedProduct);
    } catch {}
  };

  return (
    <>
      <h1>{product?.name}</h1>
      <div>
        {/*  <img src={product?.imageUrl} alt={product?.name} />*/}
        <p>{product?.description}</p>
        <p>Preis: €{product?.price}</p>
        <p>Verfügbar: {product?.stockQuantity}</p>
      </div>
      <button onClick={handleSubmit}>Add to cart</button>
    </>
  );
};

export default ProductOverview;
