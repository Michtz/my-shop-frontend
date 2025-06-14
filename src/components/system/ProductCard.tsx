import { FC, PropsWithChildren } from 'react';
import style from '@/styles/ProductCard.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import { log } from 'node:util';

interface ProductCardProps {
  image?: string;
  title?: string;
  description?: string;
  price?: string | number;
  onCardClick?: () => void;
  onIconClick?: () => Promise<void>;
}
const ProductCard: FC<ProductCardProps> = ({
  image,
  description,
  title,
  price,
  onCardClick,
  onIconClick,
}) => (
  <div onClick={onCardClick} className={style.cardContainer}>
    <img src={image} className={style.productImage} />
    <h1>{title}</h1>
    <p className={style.description}>{description}</p>
    <span className={style.priceContainer}>
      <ButtonContainer>
        <Button variant={'ghost'} appearance={'icon'} onClick={onIconClick}>
          <MaterialIcon icon={'shopping_basket'} />
        </Button>
      </ButtonContainer>
      <p className={style.price}>CHF {price} / stk.</p>
    </span>
  </div>
);

export const CartsContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className={style.cardsContainer}>{children}</div>
);
export default ProductCard;
