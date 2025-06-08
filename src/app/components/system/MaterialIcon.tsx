import React, { HTMLProps, PropsWithChildren } from 'react';
import style from '@/styles/system/MaterialIcon.module.scss';
import Link from '@/app/components/system/Link';
import { ComponentSize } from '@/app/components/system/AssetIcon';

interface MaterialIconProps extends HTMLProps<HTMLSpanElement> {
  icon: string;
  iconSize?: ComponentSize;
  outlined?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  href?: string;
  color?: string; // add type
}

const MaterialIcon: React.FC<MaterialIconProps> = ({
  outlined = true,
  clickable = false,
  href,
  icon,
  iconSize = 'normal',
  onClick,
  color,
  ...props
}): React.ReactElement => {
  return (
    <span
      className={`${outlined ? 'material-icons-outlined' : 'material-icons'} ${style['icon-container']}`}
      data-size={iconSize}
      data-color={color}
      data-clickable={!!onClick || clickable || !!href}
      children={href ? <Link href={href} children={icon} /> : icon}
      onClick={onClick}
      {...props}
    />
  );
};

export const IconContainer: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  return <div className={style['icons-container']} children={children} />;
};

export default MaterialIcon;
