import React, { useState, useMemo } from 'react';
import { useModal } from '@/hooks/ModalProvide';
import { createConfirmModal } from '@/components/modals/ConfirmModal';
import useProducts from '@/hooks/useProducts';
import { deleteProduct } from '@/requests/products.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { IProduct, ProductResponse } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { ProductTable } from './ProductTable';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import MaterialIcon from '@/components/system/MaterialIcon';
import Button, { ButtonContainer } from '@/components/system/Button';

interface AdminProductListProps {
  onEditProduct: (product: IProduct) => void;
  onCreateProduct: () => void;
}

const AdminProductList: React.FC<AdminProductListProps> = ({
  onEditProduct,
  onCreateProduct,
}) => {
  const { products, isLoading, error } = useProducts();
  const { awaitModalResult } = useModal();
  const { showFeedback } = useFeedback();
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IProduct | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });

  const sortedProducts = useMemo(() => {
    const sortableItems = [...products];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);


  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId),
    );
  };

  const handleDeleteProduct = async (product: IProduct) => {
    try {
      const confirmed = await awaitModalResult(
        createConfirmModal(
          t('products.delete.title'),
          <>
            {t('products.delete.confirmMessage', { productName: product.name })}
          </>,
          { confirmText: t('products.delete.confirmButton') },
        ),
      );

      if (!confirmed) return;

      const result: ProductResponse = await deleteProduct(product._id);
      showFeedback('feedback.data-saved-success', 'success');
      await mutate('product', result);
    } catch (e) {
      console.error('Failed to delete product:', e);
      showFeedback('feedback.data-saved-error', 'error');
    }
  };

  const handleSort = (key: keyof IProduct) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof IProduct) => {
    if (sortConfig.key !== key) return 'unfold_more';
    return sortConfig.direction === 'asc'
      ? 'keyboard_arrow_up'
      : 'keyboard_arrow_down';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { text: t('products.stock.outOfStock'), class: 'out' };
    if (stock <= 10)
      return { text: t('products.stock.lowStock'), class: 'low' };
    return { text: t('products.stock.available'), class: 'available' };
  };

  if (isLoading) {
    return (
      <div className={style.productList}>
        <p>{t('products.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.productList}>
        <p>
          {t('products.loadError')} {error}
        </p>
      </div>
    );
  }

  return (
    <div className={style.productList}>
      <ProductListHeader
        productCount={products.length}
        onCreateProduct={onCreateProduct}
      />

      <div className={style.tableContainer}>
        {products.length > 0 ? (
          <ProductTable
            products={sortedProducts}
            selectedProducts={selectedProducts}
            handleSelectProduct={handleSelectProduct}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            onEditProduct={onEditProduct}
            onDeleteProduct={handleDeleteProduct}
            getStockStatus={getStockStatus}
          />
        ) : (
          <EmptyState onCreateProduct={onCreateProduct} />
        )}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  onCreateProduct: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateProduct }) => {
  const { t } = useTranslation();

  return (
    <div className={style.emptyState}>
      <MaterialIcon icon="inventory_2" iconSize="huge" />
      <h3>{t('adminProducts.noProductsFound')}</h3>
      <p>{t('adminProducts.noProductsDescription')}</p>
      <Button variant="primary" icon="add" onClick={onCreateProduct}>
        {t('adminProducts.createFirstProduct')}
      </Button>
    </div>
  );
};

interface ProductListHeaderProps {
  productCount: number;
  onCreateProduct: () => void;
}

export const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  productCount,
  onCreateProduct,
}) => {
  const { t } = useTranslation();

  return (
    <div className={style.listHeader}>
      <div className={style.headerActions}>
        <h2>{t('adminProducts.productsCount', { count: productCount })}</h2>
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
};

export default AdminProductList;
