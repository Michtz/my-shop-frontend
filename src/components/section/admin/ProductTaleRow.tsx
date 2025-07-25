import React from 'react';
import Button from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import { IProduct } from '@/types/product.types';
import style from '@/styles/admin/AdminProductList.module.scss';
import { Controller } from 'react-hook-form';
import Checkbox from '@/components/system/Checkbox';
import { useTranslation } from 'react-i18next';

interface ProductTableRowProps {
  product: IProduct;
  isSelected: boolean;
  handleSelectProduct: (productId: string, checked: boolean) => void;
  onEditProduct: (product: IProduct) => void;
  onDeleteProduct: (product: IProduct) => Promise<void>;
  getStockStatus: (stock: number) => { text: string; class: string };
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  isSelected,
  handleSelectProduct,
  onEditProduct,
  onDeleteProduct,
  getStockStatus,
}) => {
  const { t } = useTranslation();
  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <tr key={product._id} className={style.productRow}>
      <td className={style.imageCell}>
        <div className={style.productImage}>
          {product?.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className={style.imagePlaceholder}>
              <MaterialIcon icon="image" />
            </div>
          )}
        </div>
      </td>
      {product.name && (
        <td className={style.nameCell}>
          <div>
            <div className={style.productName}>{product.name}</div>
            <div className={style.productDescription}>
              {product.description && product?.description.length > 60
                ? `${product.description.substring(0, 60)}...`
                : product.description}
            </div>
          </div>
        </td>
      )}
      {product.category && (
        <td>
          <span className={style.categoryBadge}>{product.category}</span>
        </td>
      )}
      {product.price && (
        <td className={style.priceCell}>CHF {product.price.toFixed(2)}</td>
      )}
      {product.stockQuantity && (
        <td className={style.stockCell}>
          <div className={style.stockInfo}>
            <span className={style.stockNumber}>{product.stockQuantity}</span>
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
            {product.isActive
              ? t('admin.activeStatus')
              : t('admin.inactiveStatus')}
          </span>
        </td>
      )}
      {product.lastUpdated && (
        <td className={style.dateCell}>
          {new Date(product.lastUpdated).toLocaleDateString('de-CH')}
        </td>
      )}
      <td className={style.actionsCell}>
        <div className={style.actionButtons}>
          <Button
            appearance="icon"
            variant="ghost"
            icon="edit"
            onClick={() => onEditProduct(product)}
            title={t('admin.editButton')}
          />
          <Button
            appearance="icon"
            variant="ghost"
            icon="delete"
            onClick={() => onDeleteProduct(product)}
            title={t('admin.deleteButton')}
          />
        </div>
      </td>
    </tr>
  );
};
