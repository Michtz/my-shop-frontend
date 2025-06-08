import { FC } from 'react';

import style from '@/styles/ProductCard.module.scss';
import CartList from '@/app/components/section/cart/CartList';
import Footer from '@/app/components/section/Footer';

interface ProductCardProps {}
const ProductCard: FC<ProductCardProps> = ({}) => {
  return (
    <>
      <h2>Warenkorb</h2>
      <CartList />
      <Footer />
    </>
  );
};
export default ProductCard;
