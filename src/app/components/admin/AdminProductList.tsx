import React, { useEffect, useState } from 'react';
import { useAdminProducts, Product } from '@/hooks/AdminContentProductProvider';
import Button from '@/app/components/system/Button';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import style from '@/styles/admin/AdminProductList.module.scss';
import { useModal } from '@/hooks/ModalProvide';
import { createConfirmModal } from '@/app/components/modals/ConfirmModal';
import useProducts from '@/hooks/useProducts';
import { Container } from '@/app/components/system/Container';

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

    deleteProduct,
    bulkDelete,
    // isLoading,
    filters,
    setFilters,
  } = useAdminProducts();
  const { products, isLoading, error } = useProducts();
  const { awaitModalResult } = useModal();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortProducts, setSortProducts] = useState<Product[]>(products);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    setSortProducts(products);
  }, [products]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allProductIds: string[] = products.map((product) => product._id);

      console.log(allProductIds);
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      console.log(selectedProducts);
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
  //
  // const handleBulkDelete = async () => {
  //   const confirmed = await awaitModalResult(
  //     createConfirmModal(
  //       'Produkte löschen',
  //       `Möchten Sie ${selectedProducts.length} Produkte wirklich löschen?`,
  //       { variant: 'error', confirmText: 'Alle löschen' },
  //     ),
  //   );
  //
  //   if (confirmed) {
  //     await bulkDelete(selectedProducts);
  //   }
  // };

  const handleSort = (column: string) => {
    const sorted: Product[] = [...products].sort((a, b) => {
      const aVal = (a as Record<string, any>)[column];
      const bVal = (b as Record<string, any>)[column];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setSortProducts(sorted);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
            {/*{selectedProducts.length > 0 && (*/}
            {/*  <Button*/}
            {/*    variant="error"*/}
            {/*    icon="delete"*/}
            {/*    onClick={handleBulkDelete}*/}
            {/*    disabled={isLoading}*/}
            {/*  >*/}
            {/*    {selectedProducts.length} löschen*/}
            {/*  </Button>*/}
            {/*)}*/}
            <Button
              variant="primary"
              icon="add"
              appearance={'icon'}
              onClick={onCreateProduct}
            ></Button>
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
              <th>
                <span>Bild</span>
              </th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('name')}
              >
                <Container padding={false}>
                  Name
                  <MaterialIcon icon={getSortIcon('name')} iconSize="small" />
                </Container>
              </th>
              <th>Kategorie</th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('price')}
              >
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
                  <MaterialIcon
                    icon={getSortIcon('stockQuantity')}
                    iconSize="small"
                  />
                </Container>
              </th>
              <th>Status</th>
              <th
                className={style.sortableHeader}
                onClick={() => handleSort('lastUpdated')}
              >
                <Container padding={false}>
                  Zuletzt aktualisiert
                  <MaterialIcon
                    icon={getSortIcon('lastUpdated')}
                    iconSize="small"
                  />
                </Container>
              </th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sortProducts.map((product) => {
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
                    {/*<div className={style.productImage}>*/}
                    {/*  {product?.image ? (*/}
                    {/*    <img src={product.image} alt={product.name} />*/}
                    {/*  ) : (*/}
                    {/*    <div className={style.imagePlaceholder}>*/}
                    {/*      <MaterialIcon icon="image" />*/}
                    {/*    </div>*/}
                    {/*  )}*/}
                    {/*</div>*/}
                  </td>
                  {product.name && (
                    <td className={style.nameCell}>
                      <div>
                        <div className={style.productName}>{product.name}</div>
                        <div className={style.productDescription}>
                          {product.description &&
                          product?.description.length > 60
                            ? `${product.description.substring(0, 60)}...`
                            : product.description}
                        </div>
                      </div>
                    </td>
                  )}
                  {product.category && (
                    <td>
                      <span className={style.categoryBadge}>
                        {product.category}
                      </span>
                    </td>
                  )}
                  {product.price && (
                    <td className={style.priceCell}>
                      CHF {product.price.toFixed(2)}
                    </td>
                  )}
                  {product.stockQuantity && (
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
                  )}
                  {product.isActive && (
                    <td>
                      <span
                        className={`${style.statusBadge} ${product.isActive ? style.active : style.inactive}`}
                      >
                        {product.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                  )}
                  {product.lastUpdated && (
                    <td className={style.dateCell}>
                      {new Date(product.lastUpdated).toLocaleDateString(
                        'de-CH',
                      )}
                    </td>
                  )}
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
