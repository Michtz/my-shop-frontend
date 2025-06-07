import React, { useState } from 'react';
import style from '@/styles/system/CategoryNavigation.module.scss';
import AssetIcon, { IconType } from '@/app/components/system/AssetIocn';

interface CategoryNavigationProps {}

const CategoryNavigation: React.FC<
  CategoryNavigationProps
> = (): React.ReactElement => {
  const [activeItem, setActiveItem] = useState<string>('');

  const categories = [
    { icon: 'tamper', label: 'Tamper' },
    { icon: 'milk-jug', label: 'Milchkannen' },
    { icon: 'tool', label: 'Tools' },
    { icon: 'coffee-cup', label: 'Kaffeetassen' },
    { icon: 'cleaning-tool', label: 'Filter Zubereitung' },
    { icon: 'scale', label: 'Waage' },
  ];

  const handleItemClick = (iconName: string) => {
    setActiveItem(iconName);
  };

  return (
    <div className={style.categoryNavigationContainer}>
      {categories.map(({ icon, label }) => (
        <div
          key={icon}
          className={`${style.categoryNavigationItem} ${
            activeItem === icon ? style.active : ''
          }`}
          onClick={() => handleItemClick(icon)}
        >
          <AssetIcon
            icon={icon as IconType}
            size="big"
            color={activeItem === icon ? 'white' : '#4C4B4B'}
          />
          <span className={style.categoryLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryNavigation;
