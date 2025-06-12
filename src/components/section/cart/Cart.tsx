import { FC } from 'react';

import style from '@/styles/ProductCard.module.scss';
import CartList from '@/components/section/cart/CartList';
import Footer from '@/components/section/Footer';

interface ProductCardProps {}
const ProductCard: FC<ProductCardProps> = ({}) => {
  return (
    <>
      <CartList />
      <Footer />
    </>
  );
};
export default ProductCard;
