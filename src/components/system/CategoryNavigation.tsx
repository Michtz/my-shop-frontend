import React, { useState } from 'react';
import style from '@/styles/system/CategoryNavigation.module.scss';
import AssetIcon, { IconType } from '@/components/system/AssetIcon';
import { useRouter } from 'next/navigation';

interface CategoryNavigationProps {}

const CategoryNavigation: React.FC<
  CategoryNavigationProps
> = (): React.ReactElement => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>('');

  const categories = [
    { icon: 'tampers', label: 'Tamper' },
    { icon: 'milk-jugs', label: 'Milchkannen' },
    { icon: 'tools', label: 'Tools' },
    { icon: 'coffee-cups', label: 'Kaffeetassen' },
    { icon: 'cleaning-tools', label: 'Filter Zubereitung' },
    { icon: 'scales', label: 'Waage' },
  ];

  const handleItemClick = (iconName: string) => {
    setActiveItem(iconName);
    router.push(`/${iconName}`);
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
