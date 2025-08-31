'use client';

import { FC, FormEvent, PropsWithChildren, ReactNode } from 'react';
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
  padding?: boolean;
  maxWidth?: string;
  gap?: string;
}

export const Container: FC<ContainerProps> = ({
  children,
  flow = 'row',
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  padding = true,
  maxWidth,
  gap,
}) => (
  <div
    data-flow={flow}
    data-align-items={alignItems}
    data-justify-content={justifyContent}
    data-padding={padding}
    data-max-width={maxWidth}
    data-gap={gap}
    className={style.container}
  >
    {children}
  </div>
);

interface ContainerFormProps {
  className: string;
  children?: ReactNode;
  onSubmitAction: (data: FormEvent) => Promise<void>;
}

export const FormContainer: FC<ContainerFormProps> = ({
  children,
  onSubmitAction,
}) => (
  <form
    onSubmit={onSubmitAction}
    style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
    className={style.formContainer}
  >
    {children}
  </form>
);

export const CardContainer: FC<ContainerProps> = ({ children }) => (
  <div className={style.cartContainer}>{children}</div>
);

export const HorizontalScrollContainer: FC<ContainerProps> = ({ children }) => (
  <div className={style.horizontalScrollContainer}>
    <div className={style.scrollWrapper}>{children}</div>
  </div>
);
export const Title: FC<ContainerProps> = ({ children }) => (
  <h2 className={style.title}>{children}</h2>
);
