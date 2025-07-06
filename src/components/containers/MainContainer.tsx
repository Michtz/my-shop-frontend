import React, { useEffect, useState } from 'react';
import useProducts from '@/hooks/useProducts';
import { useParams, useRouter } from 'next/navigation';
import CategoryNavigation from '@/components/system/CategoryNavigation';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import { Container } from '@/components/system/Container';
import { addToCart } from '@/requests/cart.request';
import { IProduct } from '@/types/product.types';
import { Params } from 'next/dist/server/request/params';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useAuth } from '@/hooks/AuthHook';
import image1 from '@/assets/Slide2_Homepage.webp';
import image2 from '@/assets/Homepage_Wellness2.webp';
import image3 from '@/assets/Firmenangebot.webp';

interface MainContainerProps {}

const filteredProducts = (
  items: IProduct[],
  category: string | undefined,
): IProduct[] => {
  if (!category) return items;
  return items.filter((product) => product.category === category);
};

const MainContainer: React.FC<MainContainerProps> = () => {
  const { products, isLoading } = useProducts();
  const { showFeedback } = useFeedback();
  const params: Params = useParams();
  const { sessionData } = useAuth();
  const category: string | undefined = getCategoryName(
    params?.category as string,
  );
  const [articles, setArticles] = useState<IProduct[]>(
    filteredProducts(products, category),
  );
  const router = useRouter();

  useEffect(() => {
    setArticles(filteredProducts(products, category));
  }, [isLoading]);

  const slides: CarouselItem[] = [
    {
      image: image1,
      alt: products[0]?.name || '',
      title: '',
      description: '',
    },
    {
      image: image2,
      alt: products[0]?.name || '',
      title: '',
      description: '',
    },
    {
      image: image3,
      alt: products[0]?.name || '',
      title: '',
      description: '',
    },
  ];

  // const slides: CarouselItem[] =
  //   products?.map((product) => ({
  //     id: product._id,
  //     image: product.imageUrl || '/placeholder.jpg',
  //     alt: product.name,
  //     title: product.name,
  //     description: `${product.description} - CHF ${product.price}`,
  //   })) || [];

  const handleAddToCart = async (id: string) => {
    try {
      const result = await addToCart(sessionData?.sessionId as string, id, 1);
      console.log(result);
      showFeedback('feedback.add-to-cart-success', 'success');
    } catch (error) {
      showFeedback('feedback.data-saved-error', 'error');
      console.error('Failed to update cart:', error);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <Container
      flow={'column'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      padding={false}
      maxWidth={'1150'}
      gap={'2'}
    >
      <Carousel items={slides} controls={false} />
      <CartsContainer>
        {category === undefined &&
          articles?.map((product, i: number) => {
            if (i > 4) return;
            return (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.name}
                description={product.description}
                image={product.imageUrl}
                price={product.price}
                onCardClick={() => handleCardClick(product._id)}
                onIconClick={() => handleAddToCart(product._id)}
              />
            );
          })}
      </CartsContainer>
      <CategoryNavigation activeCategory={category} />
      <CartsContainer>
        {articles?.map((product) => {
          return (
            <ProductCard
              key={product._id}
              id={product._id}
              title={product.name}
              description={product.description}
              image={product.imageUrl}
              price={product.price}
              onCardClick={() => handleCardClick(product._id)}
              onIconClick={() => handleAddToCart(product._id)}
            />
          );
        })}
      </CartsContainer>
    </Container>
  );
};

export default MainContainer;
