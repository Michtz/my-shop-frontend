'use client';
import React, {
  FC,
  JSX,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  useRef,
} from 'react';
import style from '@/styles/system/Form.module.scss';

interface FormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  className?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLFormElement>) => void;
}

export const validateEmail = (email: string | undefined) => {
  if (!email) return 'required';
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email) || 'noValidEmail';
};

export const validatePassword = (password: string | undefined) => {
  if (!password) return 'required';
  return password.length >= 6 || 'minLength';
};

export const checkIfSamePassword = (
  password: string | undefined,
  ogPassword: string,
) => {
  if (!password) return 'required';
  if (password !== ogPassword) return 'notTheSamePassword';

  return password.length >= 6 || 'minLength';
};

export const validatePhoneNumber = (phone: string | undefined) => {
  if (!phone) return true; // Allow empty when not required
  const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
  return phoneRegex.test(phone) || 'invalidPhoneNumber';
};
/**
 * Form system component can be used as a wrapper for a form
 */

const Form: React.FC<FormProps> = ({
  className = '',
  onSubmit,
  onKeyDown,
  ...props
}): JSX.Element => {
  const locked: MutableRefObject<number> = useRef<number>(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    // This prevents the form from being submitted on enter press
    // When the enter key was pressed less than 10ms before the submit event
    // then the submit event was caused by this key-event and should be
    // prevented
    if (Date.now() - locked.current <= 10) event.preventDefault();
    else if (onSubmit) onSubmit(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.code === 'Enter') locked.current = Date.now();
    if (onKeyDown) onKeyDown(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={className}
      {...props}
    />
  );
};

/**
 * FormRow system component which can be used to specify a row in a form. Rows defined
 * in a FormRow will vertically collapse as soon as the screen width is too small for responsiveness' sake
 */

interface FormRowProps {
  children?: ReactNode;
  className?: string;
  gap?: 'small' | 'medium' | 'large';
  align?: 'start' | 'center' | 'end' | 'stretch';
  direction?: 'row' | 'column';
}

export const FormRow: FC<FormRowProps> = ({
  children,
  className,
  gap = 'medium',
  align = 'stretch',
  direction = 'column',
}) => {
  const classes = [
    style.formRow,
    style[`gap-${gap}`],
    style[`align-${align}`],
    style[`direction-${direction}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

/**
 * FormTitle system component which can be used to specify a title in a form
 */
interface FormTitleProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export const FormTitle: React.FC<FormTitleProps> = ({
  title,
  description,
}): JSX.Element => {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};

export default Form;
