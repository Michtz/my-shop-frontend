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
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {items.map((item) => (
        <_Carousel.Item key={item.image}>
          <div style={{ height: '400px', position: 'relative' }}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority={items.indexOf(item) === 0}
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
