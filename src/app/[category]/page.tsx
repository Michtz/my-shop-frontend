'use client';

import { Container, Typography } from '@mui/material';
import ProductList from '@/components/section/ProductList';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';

interface PageProps {}

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
        {params.category as string}
      </Typography>
      <ProductList category={params.category as string} />
    </Container>
  );
};
export default CategoryPage;
