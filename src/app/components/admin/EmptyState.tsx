// EmptyState.tsx
import React from 'react';
import Button from '@/app/components/system/Button'; // Adjust import path
import MaterialIcon from '@/app/components/system/MaterialIcon'; // Adjust import path
import style from '@/styles/admin/AdminProductList.module.scss'; // Use shared style

interface EmptyStateProps {
  onCreateProduct: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateProduct }) => (
  <div className={style.emptyState}>
    <MaterialIcon icon="inventory_2" iconSize="huge" />
    <h3>Keine Produkte gefunden</h3>
    <p>Erstellen Sie Ihr erstes Produkt oder passen Sie die Filter an.</p>
    <Button variant="primary" icon="add" onClick={onCreateProduct}>
      Erstes Produkt erstellen
    </Button>
  </div>
);
