'use client';
import '@/styles/globals.scss';
import ProductList from '@/app/components/ProductList';
import SWRProvider from '@/providers/SWRProvider';

export default function Home() {
  return (
    <SWRProvider>
      <main>
        <h1>Unsere Produkte</h1>
        <ProductList />
      </main>
    </SWRProvider>
  );
}
