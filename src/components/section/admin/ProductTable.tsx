import React from 'react';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { ProductTableHead } from './ProductTableHead';
import { ProductTableRow } from '@/components/section/admin/ProductTaleRow';

interface ProductTableProps {
  products: IProduct[];
  selectedProducts: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectProduct: (productId: string, checked: boolean) => void;
  handleSort: (column: keyof IProduct) => void;
  getSortIcon: (column: keyof IProduct) => string;
  onEditProduct: (product: IProduct) => void;
  onDeleteProduct: (product: IProduct) => Promise<void>;
  getStockStatus: (stock: number) => { text: string; class: string };
  sortConfig: { key: keyof IProduct | null; direction: 'asc' | 'desc' };
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedProducts,
  handleSelectAll,
  handleSelectProduct,
  handleSort,
  getSortIcon,
  onEditProduct,
  onDeleteProduct,
  getStockStatus,
  sortConfig,
}) => {
  return (
    <table className={style.productTable}>
      <ProductTableHead
        productsLength={products.length}
        selectedProductsLength={selectedProducts.length}
        handleSelectAll={handleSelectAll}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        sortConfig={sortConfig}
      />
      <tbody>
        {products.map((product) => (
          <ProductTableRow
            key={product._id}
            product={product}
            isSelected={selectedProducts.includes(product._id)}
            handleSelectProduct={handleSelectProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            getStockStatus={getStockStatus}
          />
        ))}
      </tbody>
    </table>
  );
};
