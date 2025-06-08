'use client';

import { FC, PropsWithChildren, ReactNode } from 'react';
import style from '@/styles/Container.module.scss';

interface ContainerProps extends PropsWithChildren {
  children?: ReactNode;
  flow?: 'row' | 'column';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

export const Hr: FC<ContainerProps> = ({}) => (
  <div
    style={{ height: '1px', backgroundColor: '#c3c3c3', width: '95%' }}
  ></div>
);
