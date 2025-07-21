import React from 'react';
import MaterialIcon from '@/components/system/MaterialIcon';
import { Container } from '@/components/system/Container';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';

interface ProductTableHeadProps {
  handleSort: (column: keyof IProduct) => void;
  getSortIcon: (column: keyof IProduct) => string;
}

export const ProductTableHead: React.FC<ProductTableHeadProps> = ({
  handleSort,
  getSortIcon,
}) => (
  <thead>
    <tr>
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
