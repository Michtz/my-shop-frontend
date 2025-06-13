import React, { useState } from 'react';
import style from '@/styles/system/CategoryNavigation.module.scss';
import AssetIcon, { IconType } from '@/components/system/AssetIcon';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface CategoryNavigationProps {}

const CategoryNavigation: React.FC<
  CategoryNavigationProps
> = (): React.ReactElement => {
  const router = useRouter();
  const { t } = useTranslation(['common']);
  const [activeItem, setActiveItem] = useState<string>('');

  const categories = [
    { icon: 'tampers', label: t('common:products.category.tamper') },
    { icon: 'milk-jugs', label: t('common:products.category.milchkannen') },
    { icon: 'tools', label: t('common:products.category.tools') },
    { icon: 'coffee-cups', label: t('common:products.category.kaffeetassen') },
    { icon: 'cleaning-tools', label: t('common:products.category.cleaning') },
    { icon: 'scales', label: t('common:products.category.waage') },
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
