import React, { useEffect, useState } from 'react';
import useProducts from '@/hooks/ProductsHook';
import { useParams, useRouter } from 'next/navigation';
import CategoryNavigation from '@/components/system/CategoryNavigation';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import {
  Container,
  HorizontalScrollContainer,
} from '@/components/system/Container';
import { updateCartItem } from '@/requests/cart.request';
import { IProduct } from '@/types/product.types';
import { Params } from 'next/dist/server/request/params';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useAuth } from '@/hooks/AuthHook';
import image1 from '@/assets/Slide2_Homepage.webp';
import image2 from '@/assets/Homepage_Wellness2.webp';
import image3 from '@/assets/Firmenangebot.webp';
import FilterContainer, {
  FilterOptionCode,
} from '@/components/system/FilterContainer';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';

const filteredProducts = (
  items: IProduct[],
  category: string | undefined,
): IProduct[] => {
  if (!category) return items;
  return items.filter((product) => product.category === category);
};

const MainContainer: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { showFeedback } = useFeedback();
  const params: Params = useParams();
  const { translate } = useContentTranslate();
  const { sessionData, isSessionReady } = useAuth();
  const [activeSort, setActiveSort] = useState<FilterOptionCode>('relevance');

  const category: string | undefined = getCategoryName(
    params?.category as string,
  );

  const [articles, setArticles] = useState<IProduct[]>(
    filteredProducts(products, category),
  );
  const [sortedArticles, setSortedArticles] = useState<IProduct[]>(
    filteredProducts(products, category),
  );

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const filteredProductsState: IProduct[] = filteredProducts(
      products,
      category,
    );
    setSortedArticles(filteredProductsState);
    setArticles(filteredProductsState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, category]);

  const slides: CarouselItem[] = [
    {
      image: image1,
      alt: 'vf',
      title: '',
      description: '',
    },
    {
      image: image2,
      alt: 'def',
      title: '',
      description: '',
    },
    {
      image: image3,
      alt: 'abcd',
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
      if (!isSessionReady || !sessionData?.sessionId) {
        showFeedback('feedback.session-not-ready', 'error');
        return;
      }
      await updateCartItem(sessionData.sessionId, id, 1);
      showFeedback('feedback.add-to-cart-success', 'success');
    } catch {
      showFeedback('feedback.data-saved-error', 'error');
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
      <h2 style={{ marginTop: '2rem' }}>{category}</h2>
      {!category && <Carousel items={slides} controls={false} />}
      <HorizontalScrollContainer>
        {articles?.map((product, i: number) => {
          if (i > 3) return;
          return (
            <ProductCard
              key={product._id}
              id={product._id}
              title={translate(product.name)}
              description={translate(product.description)}
              image={product.imageUrl}
              price={product.price}
              onCardClick={() => handleCardClick(product._id)}
              onIconClick={() => handleAddToCart(product._id)}
            />
          );
        })}
      </HorizontalScrollContainer>
      {category && <Carousel items={slides} controls={false} />}
      <CategoryNavigation activeCategory={category} />

      <FilterContainer
        items={sortedArticles}
        setItems={setSortedArticles}
        sortCode={activeSort}
        setSortCode={(newCode: FilterOptionCode) => setActiveSort(newCode)}
      />

      <CartsContainer>
        {sortedArticles?.map((product) => {
          return (
            <ProductCard
              key={product._id}
              id={product._id}
              title={translate(product.name)}
              description={translate(product.description)}
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
