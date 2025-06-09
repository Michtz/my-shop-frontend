// import { Header, Footer } from 'antd/es/layout/layout';

import { Header, Footer } from 'antd/es/layout/layout';
import { Carousel, Image, Layout, Menu, MenuProps } from 'antd';
import { CSSProperties } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { CardContainer } from '@/app/components/system/Container';
import useProducts from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import CategoryNavigation from '@/app/components/system/CategoryNavigation';
import { getProducts } from '@/requests/products.request';
import { IProduct } from '@/types/product.types';

const LandingPage = () => {
  const { products, isLoading, error } = useProducts();
  const router = useRouter();
  console.log(products);
  const carouselContentStyle: CSSProperties = {
    height: '400px',
  };

  const handletest = async () => {
    const test = getProducts();
    console.log(test);
  };
  const imageStyle: CSSProperties = {
    height: '400px',
    objectFit: 'cover',
    display: 'block',
  };
  const textContainerStyle: CSSProperties = {
    position: 'relative',
    top: '-120px',

    marginRight: '30px',
  };
  const titleStyle: CSSProperties = {
    fontSize: '24px',

    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '30px',
  };
  const descriptionStyle: CSSProperties = {
    fontSize: '14px',

    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '30px',
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',

    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  const footerStyle: CSSProperties = {
    textAlign: 'center',
    height: 164,
    paddingInline: 48,
    lineHeight: '64px',

    bottom: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));

  const handleAddToCart = (e: any, product: IProduct) => {
    e.stopPropagation();
    console.log('handleAddToCart', product.name);
  };
  const handleOpenCart = (e: any) => {
    e.stopPropagation();
    console.log('handleAddToCart');
  };

  const handleCardClick = (product: IProduct) => {
    router.push(`/products/${product._id}`);
  };

  return (
    <Layout>
      <Header style={headerStyle}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
        <IconButton
          aria-flowto="right"
          color="primary"
          aria-label="shopping cart"
          onClick={(e) => handleOpenCart(e)}
        >
          <ShoppingBasketIcon />
        </IconButton>
      </Header>
      <Carousel autoplay autoplaySpeed={5000} dots>
        {products.map((product: IProduct) => (
          <div key={product._id}>
            <div style={carouselContentStyle}>
              <Image
                width="auto"
                src="https://www.espresso-factory.ch/WebRoot/Store/Shops/168527/623C/4066/C453/842C/FF53/0A01/080E/9E68/BiancaV3_ml.png"
                style={imageStyle}
              />
            </div>
            <span style={textContainerStyle}>
              <h2 style={titleStyle}>{product.name}</h2>
              <h3 style={descriptionStyle}>{product.description}</h3>
            </span>
          </div>
        ))}
      </Carousel>
      <CategoryNavigation />
      <CardContainer>
        {products.map((product: IProduct) => {
          return (
            <div
              key={product._id}
              onClick={() => handleCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={product.imageUrl}
                  title={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {product.description}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', padding: '8px 16px' }}>
                  <IconButton
                    aria-flowto="right"
                    color="primary"
                    aria-label="add to shopping cart"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingBasketIcon />
                  </IconButton>
                </Box>
              </Card>
            </div>
          );
        })}
      </CardContainer>
      <Footer style={footerStyle}>
        this will be the footer at some time soooooon :D
      </Footer>
    </Layout>
  );
};

export default LandingPage;
