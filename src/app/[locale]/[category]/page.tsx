'use client';

import { Container, Typography } from '@mui/material';
import ProductList from '@/components/section/ProductList';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';
import { getCategoryName } from '@/functions/common';
import MainContainer from '@/components/containers/MainContainer';

const CategoryPage = () => {
  const params: Params = useParams();
  return (
    <Container>
      <h1>{getCategoryName(params?.category as string)}</h1>
      <MainContainer view={params?.category as string} />
    </Container>
  );
};
export default CategoryPage;
