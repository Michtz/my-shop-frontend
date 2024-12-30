'use client';
import '../styles/globals.scss';
import ProductList from '@/app/components/section/ProductList';
import SWRProvider from '@/providers/SWRProvider';
import { FC } from 'react';

const Home: FC = () => (
  <SWRProvider>
    <main>
      <h1>Unsere Produkte</h1>
      <ProductList />
    </main>
  </SWRProvider>
);
export default Home;
