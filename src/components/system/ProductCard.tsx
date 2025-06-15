import { FC, MouseEventHandler, PropsWithChildren } from 'react';
import style from '@/styles/ProductCard.module.scss';
import Button, { ButtonContainer } from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  price?: string | number;
  onCardClick: (id: string) => void;
  onIconClick?: (id: string) => Promise<void>;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  image,
  description,
  title,
  price,
  onCardClick,
  onIconClick,
}) => (
  <div onClick={() => onCardClick(id)} className={style.cardContainer}>
    <div className={style.imageContainer}>
      {image && (
        <Image
          src={image}
          alt={title || 'Product image'}
          fill
          className={style.productImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      )}
    </div>
    <h1 className={style.title}>{title}</h1>
    <p className={style.description}>{description}</p>
    <span className={style.priceContainer}>
      {onIconClick && (
        <ButtonContainer>
          <Button
            variant={'ghost'}
            appearance={'icon'}
            onClick={() => onIconClick(id)}
          >
            <MaterialIcon icon={'shopping_basket'} />
          </Button>
        </ButtonContainer>
      )}

      <p className={style.price}>CHF {price} / stk.</p>
    </span>
  </div>
);

export const CartsContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className={style.cardsContainer}>{children}</div>
);
export default ProductCard;
