'use client';
import { FC } from 'react';
import { Carousel as _Carousel } from 'react-bootstrap';
import Image from 'next/image';
import style from '@/styles/system/Carousel.module.scss';

export interface CarouselItem {
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  interval?: number;
  controls?: boolean;
  indicators?: boolean;
  fade?: boolean;
  pause?: 'hover' | false;
}

const Carousel: FC<CarouselProps> = ({
  items,
  interval = null,
  controls = true,
  indicators = true,
  fade = false,
  pause = 'hover',
}) => {
  if (!items || items.length === 0) return null;

  return (
    <_Carousel
      interval={interval}
      controls={controls}
      indicators={indicators}
      fade={fade}
      pause={pause}
      className={style.carousel}
    >
      {items.map((item) => (
        <_Carousel.Item key={item.image} className={style.carouselItem}>
          <div style={{ height: '500px', position: 'relative' }}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
              sizes="100vw"
              priority={items.indexOf(item) === 0}
              className={style.image}
            />
          </div>

          {(item.title || item.description) && (
            <_Carousel.Caption className={style.blurContainerLight}>
              {item.title && <h5>{item.title}</h5>}
              {item.description && <p>{item.description}</p>}
            </_Carousel.Caption>
          )}
        </_Carousel.Item>
      ))}
    </_Carousel>
  );
};

export default Carousel;
