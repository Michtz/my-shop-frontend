import { FC } from 'react';

import style from '@/styles/ProductCard.module.scss';
import CartList from '@/app/components/section/CartList';

interface ProductCardProps {}
const ProductCard: FC<ProductCardProps> = ({}) => {
  return <CartList />;
};
export default ProductCard;
