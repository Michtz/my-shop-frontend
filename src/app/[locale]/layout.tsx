'use client';

import ThemeRegistry from '@/providers/ThemeRegistry';
import SWRProvider from '@/providers/SWRProvider';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import TranslationProvider from '@/providers/TranslationProvider';
import React, { ReactNode } from 'react';
import './globals.css';
import Footer from '@/components/section/Footer';
import Header from '@/components/section/Header';
import Feedback from '@/components/system/Feedback';

const RootLayout = ({ children }: { children: ReactNode }) => (
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
            <Feedback />

            <Footer />
          </body>
        </html>
      </FeedbackProvider>
    </TranslationProvider>
  </ThemeRegistry>
);

export default RootLayout;
