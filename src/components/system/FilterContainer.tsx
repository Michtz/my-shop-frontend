'use client';
import { FC, useRef, useState } from 'react';
import style from '@/styles/system/FilterContainer.module.scss';
import * as React from 'react';
import Button from '@/components/system/Button';

export type FilterType = { value: string; code: FilterOptionCode };
type FilterOptionCode = 'relevance' | 'down' | 'up';
export type PriceRangeType = { max: number; min: number };
interface FilterContainerProps {
  setActiveSort: (value: FilterType) => void;
  activeSort: FilterType;
  setPriceRange?: ({ max, min }: PriceRangeType) => void;
  priceRange?: PriceRangeType;
}
const FilterContainer: FC<FilterContainerProps> = ({
  setActiveSort,
  activeSort,
  // setPriceRange,
  // priceRange,
}) => {
  const sortRefDropdown = useRef<HTMLLIElement>(null);
  // const priceRangeRef = useRef<HTMLLIElement>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  // const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const handleSort = (opt: FilterType) => {
    setActiveSort(opt);
    setIsSortOpen(false);
  };

  const CATEGORIES: FilterType[] = [
    { value: 'Relevanz', code: 'relevance' },
    { value: 'Preis absteigend', code: 'down' },
    { value: 'Preis aufsteigend', code: 'up' },
  ];
  return (
    <>
      <div className={style.optionContainer}>
        <span
          className={`${style.navItem} ${style.languageDropdown}`}
          ref={sortRefDropdown}
        >
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
              Sortieren
            </Button>
          </span>
          {isSortOpen && (
            <div className={style.dropdownMenu}>
              {CATEGORIES.map((opt) => (
                <span
                  key={opt.code}
                  className={`${style.dropdownItem} ${activeSort.code === opt.code ? style.activeLanguage : ''}`}
                  onClick={() => handleSort(opt)}
                >
                  {opt.value}
                </span>
              ))}
            </div>
          )}
        </span>
        {/* Todo: finish price range filter option*/}
        {/*<span*/}
        {/*  className={`${style.navItem} ${style.languageDropdown}`}*/}
        {/*  ref={sortRefDropdown}*/}
        {/*>*/}
        {/*  <span*/}
        {/*    onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}*/}
        {/*    className={style.sortIcon}*/}
        {/*  >*/}
        {/*    <MaterialIcon icon={'euro'} /> Preisspanne*/}
        {/*  </span>*/}

        {/*  {isPriceRangeOpen && (*/}
        {/*    <div className={style.dropdownMenu}>*/}
        {/*      <PriceRangeSlider*/}
        {/*        minPrice={priceRange?.min}*/}
        {/*        maxPrice={priceRange?.max}*/}
        {/*        onClose={() => setIsPriceRangeOpen(false)}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</span>*/}
      </div>
    </>
  );
};

export default FilterContainer;
