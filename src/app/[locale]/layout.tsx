'use client';

import ThemeRegistry from '@/providers/ThemeRegistry';
import SWRProvider from '@/providers/SWRProvider';
import { AuthProvider } from '@/hooks/AuthHook';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import TranslationProvider from '@/providers/TranslationProvider';
import React, { ReactNode } from 'react';
import './globals.scss';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Feedback from '@/components/system/Feedback';
import { ErrorProvider } from '@/hooks/ErrorHook';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <ThemeRegistry>
    <ErrorProvider>
      <TranslationProvider>
        <FeedbackProvider>
          <AuthProvider>
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
          </AuthProvider>
        </FeedbackProvider>
      </TranslationProvider>
    </ErrorProvider>
  </ThemeRegistry>
);

export default RootLayout;
