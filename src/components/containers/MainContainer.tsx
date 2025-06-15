import React, { useEffect, useState } from 'react';
import useProducts from '@/hooks/useProducts';
import { useParams, useRouter } from 'next/navigation';
import CategoryNavigation from '@/components/system/CategoryNavigation';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import { Container } from '@/components/system/Container';
import { replaceCartItems } from '@/requests/cart.request';
import { sessionTestId } from '@/components/containers/ProductContainer';
import useCart from '@/hooks/useCart';
import { mutate } from 'swr';
import { IProduct } from '@/types/product.types';
import { Params } from 'next/dist/server/request/params';

interface MainContainerProps {
  view?: string | undefined;
}

const filteredProducts = (
  items: IProduct[],
  category: string | undefined,
): IProduct[] => {
  if (!category) return items;
  return items.filter((product) => product.category === category);
};

const MainContainer: React.FC<MainContainerProps> = ({ view }) => {
  const { products, isLoading } = useProducts();
  const params: Params = useParams();
  const category: string | undefined = params?.category as string;
  const [articles, setArticles] = useState<IProduct[]>(
    filteredProducts(products, getCategoryName(category)),
  );
  const { cartItems } = useCart(sessionTestId);
  const router = useRouter();

  useEffect(() => {
    setArticles(filteredProducts(products, getCategoryName(category)));
  }, [isLoading]);

  const slides: CarouselItem[] =
    products?.map((product) => ({
      id: product._id,
      image: product.imageUrl || '/placeholder.jpg',
      alt: product.name,
      title: product.name,
      description: `${product.description} - CHF ${product.price}`,
    })) || [];

  const handleAddToCart = async (id: string) => {
    try {
      const existingItem = cartItems.find((item: any) => item.productId === id);
      let updatedItems;

      if (existingItem) {
        updatedItems = cartItems.map((item: any) =>
          item.productId === id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const newItem = {
          productId: id,
          quantity: 1,
          product: products.find((item: any) => item.productId === id),
        };

        updatedItems = [...cartItems, newItem];
      }
      const result = await replaceCartItems(sessionTestId, updatedItems);
      await mutate('product', result);
    } catch (error) {
      await mutate('product', cartItems);
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
    >
      <Carousel items={slides} />
      <CategoryNavigation />
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
