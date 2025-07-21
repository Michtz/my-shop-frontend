'use client';

import React, { useState } from 'react';
import Button from '@/components/system/Button';
import style from '@/styles/admin/AdminProduct.module.scss';
import AdminProductList from '@/components/section/admin/AdminProductList';
import { Container } from '@/components/system/Container';
import { ModalProvider } from '@/hooks/ModalProvide';
import ProductForm from '@/components/section/admin/ProductFormComponent';
import Feedback from '@/components/system/Feedback';
import { IProduct } from '@/types/product.types';

const AdminProductsContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct>();

  const handleCreateProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  if (showForm) {
    return (
      <div className={style.adminContainer}>
        <ProductForm product={editingProduct} onClose={handleCloseForm} />
      </div>
    );
  }

  return (
    <>
      <div className={style.pageHeader}>
        <h1>Produktverwaltung</h1>
      </div>
      <AdminProductList
        onEditProduct={handleEditProduct}
        onCreateProduct={handleCreateProduct}
      />
    </>
  );
};

const AdminProducts: React.FC = () => {
  return (
    <ModalProvider>
      <Container flow="column" alignItems="center">
        <AdminProductsContent />
      </Container>
    </ModalProvider>
  );
};

export default AdminProducts;
