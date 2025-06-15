import React, { useEffect, useState } from 'react';
import useProducts from '@/hooks/useProducts';
import { useParams, useRouter } from 'next/navigation';
import CategoryNavigation from '@/components/system/CategoryNavigation';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import { Container } from '@/components/system/Container';
import { addToCart, replaceCartItems } from '@/requests/cart.request';
import { sessionTestId } from '@/components/containers/ProductContainer';
import useCart from '@/hooks/useCart';
import { mutate } from 'swr';
import { IProduct } from '@/types/product.types';
import { Params } from 'next/dist/server/request/params';
import { Hr } from '@/components/system/Hr';
import { useFeedback } from '@/hooks/FeedbackHook';

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
  const category: string | undefined = getCategoryName(
    params?.category as string,
  );
  const [articles, setArticles] = useState<IProduct[]>(
    filteredProducts(products, category),
  );
  const { cartItems } = useCart(sessionTestId);
  const router = useRouter();

  useEffect(() => {
    setArticles(filteredProducts(products, category));
  }, [isLoading]);

  const slides: CarouselItem[] = [
    {
      image:
        'https://res.cloudinary.com/de2rhuwpw/image/upload/v1749664954/myshop/products/products/84e271a8-f42c-4a62-815c-f146e783a790.webp.jpg',
      alt: products[0]?.name,
      title: products[0]?.name,
      description: products[0]?.description,
    },
    {
      image:
        'https://res.cloudinary.com/de2rhuwpw/image/upload/v1749664970/myshop/products/products/a0c8e8d1-54b3-46a7-80d9-0415dc0cf5b4.webp.jpg',
      alt: products[0]?.name,
      title: products[0]?.name,
      description: products[0]?.description,
    },
    {
      image:
        'https://res.cloudinary.com/de2rhuwpw/image/upload/v1749664795/myshop/products/products/066fcfed-c11e-4878-b87c-54f4a7e6bcc5.webp.jpg',
      alt: products[0]?.name,
      title: products[0]?.name,
      description: products[0]?.description,
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
      const result = await addToCart(sessionTestId, id, 1);
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
    >
      <Carousel items={slides} />
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
