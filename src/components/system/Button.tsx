import React, { forwardRef } from 'react';
import MaterialIcon from './MaterialIcon';
import Link from './Link';
import style from '@/styles/system/Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'ghost';
  size?: 'small' | 'normal' | 'big';
  appearance?: 'button' | 'icon';
  href?: string;
  icon?: string;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'normal',
      appearance = 'button',
      href,
      icon,
      loading = false,
      disabled = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref,
  ) => {
    const buttonContent = (
      <>
        {children}
        {icon && !loading && <MaterialIcon icon={icon} iconSize={size} />}
        {loading && <span>Loading...</span>}
      </>
    );

    const buttonElement = (
      <button
        ref={ref}
        disabled={disabled || loading}
        onClick={onClick}
        className={`${style['button-container']} ${className}`}
        data-variant={variant}
        data-size={size}
        data-appearance={appearance}
        data-loading={loading}
        {...props}
      >
        {buttonContent}
      </button>
    );

    // If href is provided and not disabled, wrap in Link
    if (href && !disabled) {
      return <Link href={href}>{buttonElement}</Link>;
    }

    return buttonElement;
  },
);

Button.displayName = 'Button';

interface ButtonContainerProps {
  children: React.ReactNode;
  spread?: boolean;
  className?: string;
}

export const ButtonContainer: React.FC<ButtonContainerProps> = ({
  children,
  spread = true,
  className = '',
}) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className={`${style['button-container-container']} ${className}`}
    data-spread={spread}
  >
    {children}
  </div>
);

export default Button;
