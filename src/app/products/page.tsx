'use client';
import '@/styles/globals.scss';
import ProductList from '@/components/section/ProductList';
import SWRProvider from '@/providers/SWRProvider';
import { FC } from 'react';

const App: FC = () => (
  <SWRProvider>
    <main>
      <h1>Unsere Produkte</h1>
      <ProductList />
    </main>
  </SWRProvider>
);

export default App;
