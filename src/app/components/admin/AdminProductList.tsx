import React, { useState } from 'react';
import { useAdminProducts, Product } from '@/hooks/AdminContentProductProvider';
import Button from '@/app/components/system/Button';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import style from '@/styles/AdminProductList.module.scss';
import { useModal } from '@/hooks/ModalProvide';
import { createConfirmModal } from '@/app/components/modals/ConfirmModal';

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onCreateProduct: () => void;
}

const AdminProductList: React.FC<ProductListProps> = ({
  onEditProduct,
  onCreateProduct,
}) => {
  const {
    getFilteredProducts,
    selectedProducts,
    setSelectedProducts,
    deleteProduct,
    bulkDelete,
    isLoading,
    filters,
    setFilters,
  } = useAdminProducts();

  const { awaitModalResult } = useModal();
  const [sortColumn, setSortColumn] = useState<string>('');

  const products = getFilteredProducts();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev: string[]) => [...prev, productId]);
    } else {
      setSelectedProducts((prev: string[]) =>
        prev.filter((id) => id !== productId),
      );
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = await awaitModalResult(
      createConfirmModal(
        'Produkt löschen',
        <>
          Möchten Sie <strong>{product.name}</strong> wirklich löschen?
        </>,
        { variant: 'error', confirmText: 'Löschen' },
      ),
    );

    if (confirmed) {
      await deleteProduct(product._id);
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await awaitModalResult(
      createConfirmModal(
        'Produkte löschen',
        `Möchten Sie ${selectedProducts.length} Produkte wirklich löschen?`,
        { variant: 'error', confirmText: 'Alle löschen' },
      ),
    );

    if (confirmed) {
      await bulkDelete(selectedProducts);
    }
  };

  const handleSort = (column: string) => {
    const newOrder =
      filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters({ sortBy: column as any, sortOrder: newOrder });
    setSortColumn(column);
  };

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return 'unfold_more';
    return filters.sortOrder === 'asc'
      ? 'keyboard_arrow_up'
      : 'keyboard_arrow_down';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Nicht verfügbar', class: 'out' };
    if (stock <= 10) return { text: 'Niedrig', class: 'low' };
    return { text: 'Verfügbar', class: 'available' };
  };

  return (
    <div className={style.productList}>
      <div className={style.listHeader}>
        <div className={style.headerActions}>
          <h2>Produkte ({products.length})</h2>
          <div className={style.actionButtons}>
            {selectedProducts.length > 0 && (
              <Button
                variant="error"
                icon="delete"
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                {selectedProducts.length} löschen
              </Button>
            )}
            <Button variant="primary" icon="add" onClick={onCreateProduct}>
              Neues Produkt
            </Button>
          </div>
        </div>
      </div>

      <div className={style.tableContainer}>
        <table className={style.productTable}>
          <thead>
            <tr>
              <th className={style.checkboxCell}>
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Bild</th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('name')}
              >
                Name
                <MaterialIcon icon={getSortIcon('name')} iconSize="small" />
              </th>
              <th>Kategorie</th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('price')}
              >
                Preis
                <MaterialIcon icon={getSortIcon('price')} iconSize="small" />
              </th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('stockQuantity')}
              >
                Lager
                <MaterialIcon
                  icon={getSortIcon('stockQuantity')}
                  iconSize="small"
                />
              </th>
              <th>Status</th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('lastUpdated')}
              >
                Zuletzt aktualisiert
                <MaterialIcon
                  icon={getSortIcon('lastUpdated')}
                  iconSize="small"
                />
              </th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stockQuantity);

              return (
                <tr key={product._id} className={style.productRow}>
                  <td className={style.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={(e) =>
                        handleSelectProduct(product._id, e.target.checked)
                      }
                    />
                  </td>
                  <td className={style.imageCell}>
                    <div className={style.productImage}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className={style.imagePlaceholder}>
                          <MaterialIcon icon="image" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={style.nameCell}>
                    <div>
                      <div className={style.productName}>{product.name}</div>
                      <div className={style.productDescription}>
                        {product.description.length > 60
                          ? `${product.description.substring(0, 60)}...`
                          : product.description}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={style.categoryBadge}>
                      {product.category}
                    </span>
                  </td>
                  <td className={style.priceCell}>
                    CHF {product.price.toFixed(2)}
                  </td>
                  <td className={style.stockCell}>
                    <div className={style.stockInfo}>
                      <span className={style.stockNumber}>
                        {product.stockQuantity}
                      </span>
                      <span
                        className={`${style.stockStatus} ${style[stockStatus.class]}`}
                      >
                        {stockStatus.text}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${style.statusBadge} ${product.isActive ? style.active : style.inactive}`}
                    >
                      {product.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className={style.dateCell}>
                    {new Date(product.lastUpdated).toLocaleDateString('de-CH')}
                  </td>
                  <td className={style.actionsCell}>
                    <div className={style.actionButtons}>
                      <Button
                        appearance="icon"
                        variant="ghost"
                        icon="edit"
                        onClick={() => onEditProduct(product)}
                        title="Bearbeiten"
                      />
                      <Button
                        appearance="icon"
                        variant="ghost"
                        icon="delete"
                        onClick={() => handleDeleteProduct(product)}
                        title="Löschen"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className={style.emptyState}>
            <MaterialIcon icon="inventory_2" iconSize="huge" />
            <h3>Keine Produkte gefunden</h3>
            <p>
              Erstellen Sie Ihr erstes Produkt oder passen Sie die Filter an.
            </p>
            <Button variant="primary" icon="add" onClick={onCreateProduct}>
              Erstes Produkt erstellen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
