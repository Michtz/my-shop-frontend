'use client';
import '../styles/globals.scss';
import ProductList from '@/app/components/section/ProductList';
import SWRProvider from '@/providers/SWRProvider';
import { FC } from 'react';
import dotenv from 'dotenv';

import LandingPage from '@/app/components/section/LandingPage'; // test if this is nesessaire ? is should be for jwt in the backend.
dotenv.config();
const Home: FC = () => (
  <SWRProvider>
    <LandingPage />
    {/*<main>*/}
    {/*  <h1>Unsere Produkte</h1>*/}
    {/*  <ProductList />*/}
    {/*</main>*/}
  </SWRProvider>
);
export default Home;
