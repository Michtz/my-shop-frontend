import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useProducts from '@/hooks/ProductsHook';
import { useParams, useRouter } from 'next/navigation';
import CategoryNavigation from '@/components/system/CategoryNavigation';
import Carousel, { CarouselItem } from '@/components/system/Carousel';
import { getCategoryName } from '@/functions/common';
import ProductCard, { CartsContainer } from '@/components/system/ProductCard';
import {
  Container,
  HorizontalScrollContainer,
  Title,
} from '@/components/system/Container';
import { getCart, updateCartItem } from '@/requests/cart.request';
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
import useCart, { CartItem } from '@/hooks/CartHook';

const MainContainer: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { cartItems, mutate } = useCart();
  const { showFeedback } = useFeedback();
  const { t } = useTranslation();
  const params: Params = useParams();
  const { translate } = useContentTranslate();
  const { sessionData, isSessionReady, userSessionData } = useAuth();
  const [activeSort, setActiveSort] = useState<FilterOptionCode>('relevance');

  const category: string | undefined = getCategoryName(
    params?.category as string,
  );

  const [articles, setArticles] = useState<IProduct[]>(products);
  const [sortedArticles, setSortedArticles] = useState<IProduct[]>(products);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    setSortedArticles(products);
    setArticles(products);
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
        showFeedback(t('feedback.session-not-ready'), 'error');
        return;
      }

      let quantity: number = 1;
      let cartItem: CartItem | undefined = cartItems?.find(
        (item) => item.productId === id,
      );

      if (!cartItem) {
        const response = await getCart(
          sessionData.sessionId,
          userSessionData?.user.id,
        );
        cartItem = response?.data.data.items?.find(
          (item: CartItem) => item.productId === id,
        );
      }
      if (cartItem) quantity = cartItem.quantity + 1;
      await updateCartItem(
        sessionData.sessionId,
        id,
        quantity,
        userSessionData?.user?.id || '',
      );
      mutate('cart');
      showFeedback(t('feedback.add-to-cart-success'), 'success');
    } catch {
      showFeedback(t('feedback.data-saved-error'), 'error');
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  let previewItemsCount: number = 3;
  return (
    <Container
      flow={'column'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      padding={false}
      maxWidth={'1150'}
      gap={'2'}
    >
      {category && <Title>{category}</Title>}
      {!category && (
        <Carousel items={slides} controls={false} interval={7000} indicators />
      )}
      <HorizontalScrollContainer>
        {articles?.map((product, i: number) => {
          if (i > previewItemsCount) return;
          if (product.stockQuantity === 0) {
            previewItemsCount = previewItemsCount++;
          }
          const matchingItem = cartItems?.find(
            (item) => item?.productId === product._id,
          );
          const disabled = matchingItem
            ? matchingItem.quantity >= product.stockQuantity
            : false;
          return (
            <ProductCard
              key={product._id}
              id={product._id}
              title={translate(product.name)}
              description={translate(product.description)}
              image={product.imageUrl}
              price={product.price}
              disabled={disabled}
              onCardClick={() => handleCardClick(product._id)}
              onIconClick={() => handleAddToCart(product._id)}
            />
          );
        })}
      </HorizontalScrollContainer>
      {category && <Carousel items={slides} controls={false} />}
      <CategoryNavigation activeCategory={category} />

      <FilterContainer
        setItems={setSortedArticles}
        sortCode={activeSort}
        setSortCode={(newCode: FilterOptionCode) => setActiveSort(newCode)}
      />
      <CartsContainer>
        {sortedArticles?.map((product) => {
          const matchingItem = cartItems?.find(
            (item) => item?.productId === product._id,
          );
          const disabled = matchingItem
            ? matchingItem.quantity >= product.stockQuantity
            : false;
          return (
            <ProductCard
              key={product._id}
              id={product._id}
              title={translate(product.name)}
              description={translate(product.description)}
              image={product.imageUrl}
              price={product.price}
              disabled={disabled}
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
