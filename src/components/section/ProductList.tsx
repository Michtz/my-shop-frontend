'use client';

import {
  Grid,
  Card,
  Container,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import React, { useEffect, useState } from 'react';
import { UseCreateCartProps } from '@/hooks/useCreateCart';
import useCart from '@/hooks/useCart';
import { IProduct } from '@/types/product.types';
import Carousel from '@/components/system/Carousel';

interface ProductListProps {
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const { products, isLoading, error } = useProducts({ category: category });
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

  const handleClick = (id: string) => {
    console.log(id);
    router.push(`/products/${id}`);
  };
  return (
    <Container>
      <Carousel products={products} />
      <Grid container spacing={3}>
        {articles?.map((product) => {
          console.log(product?.imageUrl);
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={product._id}
              onClick={() => handleClick(product._id)}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>€{product.price}</Typography>
                  <Typography>Lager: {product.stockQuantity}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
export default ProductList;
