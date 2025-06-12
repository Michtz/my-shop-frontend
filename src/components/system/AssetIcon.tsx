import React from 'react';
import style from '@/styles/system/AssetIcon.module.scss';
import { CleaningToolIcon } from '@/components/icons/CleaningToolIcon';
import { CoffeeCupIcon } from '@/components/icons/CoffeeCupIcon';
import { MilkJugIcon } from '@/components/icons/MilkJugIcon';
import { ScaleIcon } from '@/components/icons/ScaleIcon';
import { TamperIcon } from '@/components/icons/TamperIcon';
import { ToolIcon } from '@/components/icons/ToolIcon';

export type IconType =
  | 'cleaning-tool'
  | 'coffee-cup'
  | 'milk-jug'
  | 'scale'
  | 'tamper'
  | 'tool';

export type ComponentSize = 'extra-small' | 'small' | 'normal' | 'big' | 'huge';

interface AssetIconProps {
  icon: IconType;
  size?: ComponentSize;
  color?: string;
  placeholder?: boolean;
}

const AssetIcon: React.FC<AssetIconProps> = ({
  icon,
  size = 'huge',
  color = '#4C4B4B',
  placeholder = false,
}): React.ReactElement => {
  let effSize: number;
  switch (size) {
    case 'extra-small':
      effSize = 16;
      break;
    case 'small':
      effSize = 24;
      break;
    case 'normal':
      effSize = 28;
      break;
    case 'big':
      effSize = 42;
      break;
    case 'huge':
      effSize = 66;
      break;
    default:
      effSize = 72;
  }

  if (placeholder) {
    return (
      <span
        data-cy={'asset-icon'}
        data-size={size}
        className={style.assetIconContainer}
        style={{ width: `${effSize}px` }}
      />
    );
  }

  const iconComponents = {
    'cleaning-tool': CleaningToolIcon,
    'coffee-cup': CoffeeCupIcon,
    'milk-jug': MilkJugIcon,
    scale: ScaleIcon,
    tamper: TamperIcon,
    tool: ToolIcon,
  };

  const IconComponent = iconComponents[icon];

  if (!IconComponent) return <></>;

  return (
    <span
      data-cy={'asset-icon'}
      data-cy-icon={icon}
      data-size={size}
      className={style['asset-icon-container']}
    >
      <IconComponent
        width={effSize}
        height={effSize}
        color={color}
        className={style.assetIcon}
      />
    </span>
  );
};

export default AssetIcon;
