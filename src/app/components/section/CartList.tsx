'use client';

import { Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Container } from '@/app/components/system/Container';
import useCart from '@/hooks/useCart';

const CartList = () => {
  const { isLoading, error, products } = useCart();
  const router = useRouter();

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
      {products?.map((product) => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <span>{product.description}</span>
        </div>
      ))}
    </Container>
  );
};
export default CartList;
