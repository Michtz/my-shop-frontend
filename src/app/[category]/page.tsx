'use client';

import { Container, Typography } from '@mui/material';
import ProductList from '@/components/section/ProductList';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import { getCategoryName } from '@/functions/common';

const CategoryPage = () => {
  const params: Params = useParams();

  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 4, mb: 3 }}
      >
        {getCategoryName(params.category as string)}
      </Typography>
      <ProductList category={params.category as string} />
    </Container>
  );
};
export default CategoryPage;
