import { FC } from 'react';

import style from '@/styles/ProductCard.module.scss';

interface ProductCardProps {
  image?: string;
  title?: string;
  description?: string;
}
const ProductCard: FC<ProductCardProps> = ({ image, description, title }) => (
  <div className={style.cardContainer}>
    <img src={image} />
    <h1>{title}</h1>
    <div>{description}</div>
    <hr />
    <button>go to article</button>
  </div>
);
export default ProductCard;
