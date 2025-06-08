'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/app/components/system/Container';
import useCart from '@/hooks/useCart';
import CartListItem from '@/app/components/section/cart/CartListItem';

const CartList = () => {
  const router = useRouter();

  const sessionTestId: string = 'sess_nrls9zo5e9076bl9vuw8zt';

  const { cart, items, mutate } = useCart(sessionTestId);
  // console.log(cart, items);
  // if (isLoading) {
  //   return (
  //     <Container>
  //       <CircularProgress />
  //     </Container>
  //   );
  // }
  //
  // if (error) {
  //   return (
  //     <Container>
  //       <Typography color="error">{error}</Typography>
  //     </Container>
  //   );
  // }

  const handleClick = (id: string) => {
    console.log(id);
    router.push(`/products/${id}`);
  };

  return (
    <Container flow={'column'}>
      {items?.map((item: any) => (
        <CartListItem
          key={item.productId}
          item={item}
          items={items}
          sessionTestId={sessionTestId}
          mutate={mutate}
        />
      ))}
      {cart?.total}
    </Container>
  );
};
export default CartList;
