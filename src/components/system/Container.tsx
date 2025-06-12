'use client';

import { FC, PropsWithChildren, ReactNode } from 'react';
import style from '@/styles/Container.module.scss';
import { padding } from '@mui/system';

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
  padding?: boolean;
}

export const Container: FC<ContainerProps> = ({
  children,
  flow = 'row',
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  padding = true,
}) => (
  <div
    data-flow={flow}
    data-align-items={alignItems}
    data-justify-content={justifyContent}
    data-padding={padding}
    className={style.container}
  >
    {children}
  </div>
);

export const CardContainer: FC<ContainerProps> = ({ children }) => (
  <div className={style.cartContainer}>{children}</div>
);
