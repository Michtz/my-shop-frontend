import React from 'react';
import MaterialIcon from '@/components/system/MaterialIcon';
import { Container } from '@/components/system/Container';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';

interface ProductTableHeadProps {
  productsLength: number;
  selectedProductsLength: number;
  handleSelectAll: (checked: boolean) => void;
  handleSort: (column: keyof IProduct) => void;
  getSortIcon: (column: keyof IProduct) => string;
  sortConfig: { key: keyof IProduct | null; direction: 'asc' | 'desc' };
}

export const ProductTableHead: React.FC<ProductTableHeadProps> = ({
  productsLength,
  selectedProductsLength,
  handleSelectAll,
  handleSort,
  getSortIcon,
}) => (
  <thead>
    <tr>
      <th className={style.checkboxCell}>
        <input
          type="checkbox"
          checked={
            selectedProductsLength === productsLength && productsLength > 0
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </th>
      <th>
        <span>Bild</span>
      </th>
      <th className={style.sortableHeader} onClick={() => handleSort('name')}>
        <Container padding={false}>
          Name
          <MaterialIcon icon={getSortIcon('name')} iconSize="small" />
        </Container>
      </th>
      <th>Kategorie</th>
      <th className={style.sortableHeader} onClick={() => handleSort('price')}>
        <Container padding={false}>
          Preis
          <MaterialIcon icon={getSortIcon('price')} iconSize="small" />
        </Container>
      </th>
      <th
        className={style.sortableHeader}
        onClick={() => handleSort('stockQuantity')}
      >
        <Container padding={false}>
          Lager
          <MaterialIcon icon={getSortIcon('stockQuantity')} iconSize="small" />
        </Container>
      </th>
      <th>Status</th>
      <th
        className={style.sortableHeader}
        onClick={() => handleSort('lastUpdated')}
      >
        <Container padding={false}>
          Zuletzt aktualisiert
          <MaterialIcon icon={getSortIcon('lastUpdated')} iconSize="small" />
        </Container>
      </th>
      <th>Aktionen</th>
    </tr>
  </thead>
);
