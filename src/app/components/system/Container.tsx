'use client';

import { FC, PropsWithChildren, ReactNode } from 'react';
import style from '@/styles/Container.module.scss';

interface ContainerProps extends PropsWithChildren {
  children?: ReactNode;
  flow?: 'row' | 'column';
}
export const Container: FC<ContainerProps> = ({ children, flow = 'row' }) => (
  <div data-flow={flow} className={style.container}>
    {children}
  </div>
);
export const CardContainer: FC<ContainerProps> = ({ children }) => (
  <div className={style.cartContainer}>{children}</div>
);
