'use client';

import React, { useState } from 'react';
import {
  AdminProductProvider,
  useAdminProducts,
  Product,
} from '@/hooks/AdminContentProductProvider';

import Button from '@/app/components/system/Button';
import style from '@/styles/admin/AdminProduct.module.scss';
import AdminProductForm from '@/app/components/admin/AdminProductForm';
import AdminProductFilters from '@/app/components/admin/AdminFilteredProducts';
import AdminProductList from '@/app/components/admin/AdminProductList';
import { Container } from '@/app/components/system/Container';
import { ModalProvider } from '@/hooks/ModalProvide';

const AdminProductsContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { loadProducts } = useAdminProducts();

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    // Optionally reload products
    // loadProducts();
  };

  if (showForm) {
    return (
      <div className={style.adminContainer}>
        <div className={style.breadcrumb}>
          <Button variant="ghost" icon="arrow_back" onClick={handleCloseForm}>
            Zurück zur Produktliste
          </Button>
        </div>

        <AdminProductForm
          product={editingProduct}
          onCancel={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className={style.adminContainer}>
      <div className={style.pageHeader}>
        <div className={style.headerContent}>
          <div>
            <h1>Produktverwaltung</h1>
            <p>Verwalten Sie Ihr Produktsortiment</p>
          </div>
          <Button variant="primary" icon="add" onClick={handleCreateProduct}>
            Neues Produkt
          </Button>
        </div>
      </div>

      <AdminProductFilters />

      <AdminProductList
        onEditProduct={handleEditProduct}
        onCreateProduct={handleCreateProduct}
      />
    </div>
  );
};

const AdminProducts: React.FC = () => {
  return (
    <ModalProvider>
      <AdminProductProvider>
        <Container flow="column" alignItems="center">
          <AdminProductsContent />
        </Container>
      </AdminProductProvider>
    </ModalProvider>
  );
};

export default AdminProducts;
