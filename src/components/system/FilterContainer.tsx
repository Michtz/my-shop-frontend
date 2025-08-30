'use client';
import { FC, useState } from 'react';
import style from '@/styles/system/FilterContainer.module.scss';
import Button from '@/components/system/Button';
import { IProduct, transKey } from '@/types/product.types';
import { useTranslation } from 'react-i18next';
import { useContentTranslate } from '@/hooks/ContentTranslationHook';
import useProducts from '@/hooks/ProductsHook';

/*
 * sort button with locig
 */

export type FilterType = { value: string; code: FilterOptionCode };

export type FilterOptionCode = 'relevance' | 'down' | 'up' | 'abc' | 'cba';

interface FilterContainerProps {
  items: IProduct[];
  setItems: (items: IProduct[]) => void;
  sortCode: FilterOptionCode;
  setSortCode: (code: FilterOptionCode) => void;
}

const handleSortArticle = (
  activeSortCode: string,
  sortedArticles: IProduct[],
  setSortedArticles: (items: IProduct[]) => void,
  products: IProduct[],
  translate: (values?: string | transKey, dynamic?: boolean) => string,
) => {
  const sorters: Record<string, (a: IProduct, b: IProduct) => number> = {
    up: (a, b) => a.price - b.price,
    down: (a, b) => b.price - a.price,
    abc: (a, b) => translate(a?.name).localeCompare(translate(b?.name)),
    cba: (a, b) => translate(b?.name).localeCompare(translate(a?.name)),
  };

  if (activeSortCode === 'relevance') {
    setSortedArticles(products);
    return;
  }

  const sorter = sorters[activeSortCode];
  if (sorter) {
    setSortedArticles([...sortedArticles].sort(sorter));
  }
};

// Todo: add price sort when time
const FilterContainer: FC<FilterContainerProps> = ({
  items,
  setItems,
  sortCode,
  setSortCode,
}) => {
  const { t } = useTranslation();
  const { products } = useProducts();
  const { translate } = useContentTranslate();
  const [wasSortTriggert, setWasSortTriggert] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSort = (opt: FilterType) => {
    handleSortArticle(opt.code, items, setItems, products, translate);
    setSortCode(opt.code);
    setIsSortOpen(false);
    if (!wasSortTriggert) setWasSortTriggert(true);
  };

  const filterTypes: FilterType[] = [
    { value: t('common.relevance'), code: 'relevance' },
    { value: t('common.down'), code: 'down' },
    { value: t('common.up'), code: 'up' },
    { value: t('common.abc'), code: 'abc' },
    { value: t('common.cba'), code: 'cba' },
  ];

  return (
    <>
      <div className={style.optionContainer}>
        <span className={`${style.navItem} ${style.languageDropdown}`}>
          <span
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={style.sortIcon}
          >
            <Button
              className={style.sortButton}
              appearance={'button'}
              value={'ghost'}
              icon={'filter_list'}
            >
              {wasSortTriggert
                ? filterTypes.find((type) => type.code === sortCode)?.value
                : t('common.sort')}
            </Button>
          </span>
          {isSortOpen && (
            <div className={style.dropdownMenu}>
              {filterTypes.map((opt) => (
                <span
                  key={opt.code}
                  className={`${style.dropdownItem} ${sortCode === opt.code ? style.activeLanguage : ''}`}
                  onClick={() => handleSort(opt)}
                >
                  {opt.value}
                </span>
              ))}
            </div>
          )}
        </span>
      </div>
    </>
  );
};

export default FilterContainer;
