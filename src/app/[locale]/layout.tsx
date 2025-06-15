'use client';

import ThemeRegistry from '@/providers/ThemeRegistry';
import SWRProvider from '@/providers/SWRProvider';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import TranslationProvider from '@/providers/TranslationProvider';
import React, { CSSProperties } from 'react';
import { Menu, MenuProps } from 'antd';
import { IconButton } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import './globals.css';
import Footer from '@/components/section/Footer';
import Header from '@/components/section/Header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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

  const handleOpenCart = (e: any) => {
    e.stopPropagation();
    console.log('handleopencart');
  };

  return (
    <ThemeRegistry>
      <TranslationProvider>
        <FeedbackProvider>
          <html lang="de" suppressHydrationWarning>
            <head>
              <title>myShop</title>
            </head>
            <body>
              <Header />
              <SWRProvider>{children}</SWRProvider>
              <Footer />
            </body>
          </html>
        </FeedbackProvider>
      </TranslationProvider>
    </ThemeRegistry>
  );
};

export default RootLayout;
