'use client';
import '@/styles/globals.scss';
import ProductList from '@/components/section/ProductList';
import { FC } from 'react';

const App: FC = () => (
  <main>
    <h1>Unsere Produkte</h1>
    <ProductList />
  </main>
);

export default App;
