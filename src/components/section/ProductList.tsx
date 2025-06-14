'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import React, { useEffect, useState } from 'react';
import useCart from '@/hooks/useCart';
import { IProduct } from '@/types/product.types';
import Carousel from '@/components/system/Carousel';
import { getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import { Container } from '@/components/system/Container';
import { replaceCartItems } from '@/requests/cart.request';
import { sessionTestId } from '@/components/section/ProductOverview';

interface ProductListProps {
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const { products, isLoading, error } = useProducts({
    category: getCategoryName(category as string),
  });
  const { cart, items, mutate } = useCart(sessionTestId);
  const router = useRouter();
  const [articles, setArticles] = useState<IProduct[]>(products);

  // useEffect(() => {
  //   if (products) {
  //     setArticles(products);
  //   }
  // }, [products]);
  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const handleShowArticle = (id: string): void => {
    console.log('clicked', id);
    router.replace(`/products/${id}`);
  };

  const handleAddArticleToCart = async (id: string) => {
    const existingItem = items.find((item: any) => item.productId === id);
    let updatedItems;

    if (existingItem) {
      updatedItems = items.map((item: any) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      const newItem = {
        productId: id,
        quantity: 1,
        product: products.find((item: any) => item.productId === id),
      };

      updatedItems = [...items, newItem];
    }
    console.log(items);
    try {
      const result = await replaceCartItems(sessionTestId, updatedItems);
      console.log('Cart updated:', result);
      mutate();
    } catch (error) {
      console.error('Failed to update cart:', error);
      mutate();
    }
  };

  return (
    <Container>
      {/*<Carousel products={products} />*/}
      <CartsContainer>
        {articles?.map((product) => {
          console.log(product?.imageUrl);
          return (
            <ProductCard
              key={product._id}
              title={product.name}
              description={product.description}
              image={product.imageUrl}
              price={product.price}
              onCardClick={handleShowArticle(product._id)}
              onIconClick={handleAddArticleToCart(product._id)}
            />
          );
        })}
      </CartsContainer>
    </Container>
  );
};
export default ProductList;
