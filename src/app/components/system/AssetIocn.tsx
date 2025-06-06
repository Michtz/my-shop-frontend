import Image, { StaticImageData } from 'next/image';
import React from 'react';
import style from '@/styles/system/AssetIcon.module.scss';

import cleanigToolIcon from '@/assets/cleanig_tool_icon.svg';
import coffeeCupIcon from '@/assets/coffee_cup_icon.svg';
import milkJugIcon from '@/assets/milk_jug.svg';
import scaleIcon from '@/assets/scale_icon.svg';
import tamperIcon from '@/assets/tamper_icon.svg';
import toolIcon from '@/assets/tool_icon.svg';

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
  placeholder?: boolean;
}

const AssetIcon: React.FC<AssetIconProps> = ({
  icon,
  size = 'huge',
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

  let source: StaticImageData;
  switch (icon) {
    case 'cleaning-tool':
      source = cleanigToolIcon;
      break;
    case 'coffee-cup':
      source = coffeeCupIcon;
      break;
    case 'milk-jug':
      source = milkJugIcon;
      break;
    case 'scale':
      source = scaleIcon;
      break;
    case 'tamper':
      source = tamperIcon;
      break;
    case 'tool':
      source = toolIcon;
      break;
    default:
      source = toolIcon;
  }

  return (
    <span
      data-cy={'asset-icon'}
      data-cy-icon={icon}
      data-size={size}
      className={style['asset-icon-container']}
    >
      <Image
        width={effSize}
        height={effSize}
        className={style.assetIcon}
        src={source}
        alt={`Icon: ${icon}`}
      />
    </span>
  );
};

export default AssetIcon;
