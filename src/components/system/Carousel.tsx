import React from 'react';

import { IProduct } from '@/types/product.types';
import styles from '@/styles/system/Carousel.module.scss';
import { Carousel as _Carousel, Image } from 'antd';

interface CarouselProps {
  products: IProduct[];
}

const Carousel: React.FC<CarouselProps> = ({ products }) => {
  return (
    <div className={styles.carouselContainer}>
      <_Carousel autoplay autoplaySpeed={5000} dots>
        {products.map((product: IProduct) => (
          <div key={product._id}>
            <div className={styles.image}>
              <Image
                width="auto"
                src={product.imageUrl}
                className={styles.image}
              />
            </div>
            <span className={styles.textContainer}>
              <h2 className={styles.title}>{product.name}</h2>
              <h3 className={styles.description}>{product.description}</h3>
            </span>
          </div>
        ))}
      </_Carousel>
    </div>
  );
};
export default Carousel;
