// ProductListHeader.tsx
import React from 'react';
import Button, { ButtonContainer } from '@/components/system/Button'; // Adjust import path
import style from '@/styles/admin/AdminProductList.module.scss'; // Use shared style

interface ProductListHeaderProps {
  productCount: number;
  onCreateProduct: () => void;
}

export const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  productCount,
  onCreateProduct,
}) => (
  <div className={style.listHeader}>
    <div className={style.headerActions}>
      <h2>Produkte ({productCount})</h2>
      <ButtonContainer>
        <Button
          variant="primary"
          icon="add"
          appearance={'icon'}
          onClick={onCreateProduct}
        />
      </ButtonContainer>
    </div>
  </div>
);
