'use client';
import { FC } from 'react';
import dotenv from 'dotenv';
import MainContainer from '@/components/containers/MainContainer';
dotenv.config();

const Home: FC = () => <MainContainer />;
export default Home;
