import React, { useState, useMemo } from 'react';
import { useModal } from '@/hooks/ModalProvide';
import { createConfirmModal } from '@/components/modals/ConfirmModal';
import useProducts from '@/hooks/useProducts';
import { deleteProduct } from '@/requests/products.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { IProduct, ProductResponse } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { ProductListHeader } from './ProductListHeader';
import { ProductTable } from './ProductTable';
import { EmptyState } from './EmptyState';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

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
  const { t } = useTranslation(['common']);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IProduct | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });

  const sortedProducts = useMemo(() => {
    let sortableItems = [...products];
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allProductIds = products.map((product) => product._id);
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId),
    );
  };

  const handleDeleteProduct = async (product: IProduct) => {
    try {
      const confirmed = await awaitModalResult(
        createConfirmModal(
          'Produkt löschen',
          <>
            Möchten Sie <strong>{product.name}</strong> wirklich löschen?
          </>,
          { confirmText: 'Löschen' },
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
      return { text: t('common:products.stock.outOfStock'), class: 'out' };
    if (stock <= 10)
      return { text: t('common:products.stock.lowStock'), class: 'low' };
    return { text: t('common:products.stock.available'), class: 'available' };
  };

  if (isLoading) {
    return (
      <div className={style.productList}>
        <p>Produkte werden geladen...</p> {/* Or a proper skeleton loader */}
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.productList}>
        <p>Fehler beim Laden der Produkte: {error}</p>
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
            handleSelectAll={handleSelectAll}
            handleSelectProduct={handleSelectProduct}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            onEditProduct={onEditProduct}
            onDeleteProduct={handleDeleteProduct}
            getStockStatus={getStockStatus}
            sortConfig={sortConfig}
          />
        ) : (
          <EmptyState onCreateProduct={onCreateProduct} />
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
