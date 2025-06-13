'use client';

import style from '@/styles/admin/ProductForm.module.scss';
import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import MaterialIcon from '@/components/system/MaterialIcon';
import { createProduct, updateProduct } from '@/requests/products.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { IProduct, ProductCategoryOptions } from '@/types/product.types';

interface ProductFormProps {
  onClose: () => void;
  product?: IProduct;
}

interface FormField {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: ProductCategoryOptions | string;
  isActive: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose, product }) => {
  const { showFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    product?.imageUrl,
  );
  const [isDragging, setIsDragging] = useState(false);
  const categories: string[] = [
    'Tampers',
    'Milk Jugs',
    'Tools',
    'Coffee Cups',
    'Scales',
    'Cleaning Tools',
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormField>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stockQuantity: product?.stockQuantity || 0,
      category: product?.category || '',
      isActive: true,
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(undefined);
  }, []);
  //
  // const onSubmit: SubmitHandler<IProduct> = async (data) => {
  //   setIsLoading(true);
  //   setSubmitError(null);
  //
  //   try {
  //     const productData = {
  //       name: data.name.trim(),
  //       description: data.description.trim(),
  //       price: data.price,
  //       stockQuantity: data.stockQuantity,
  //       category: data.category,
  //       isActive: data.isActive,
  //     };
  //
  //     const response = await createProduct(productData, imageFile || undefined);
  //     console.log(response);
  //
  //     //   reset(); for better testing
  //     setImageFile(null);
  //     setImagePreview(null);
  //     showFeedback('feedback.data-saved-success', 'success');
  //   } catch (error) {
  //     console.error('Failed to create product:', error);
  //     setSubmitError(
  //       error instanceof Error
  //         ? error.message
  //         : 'Fehler beim Erstellen des Artikels. Bitte versuchen Sie es erneut.',
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        stockQuantity: data.stockQuantity,
        category: data.category,
        isActive: data.isActive,
      };

      if (product && product._id) {
        // Produkt aktualisieren
        await updateProduct(product._id, productData, imageFile || undefined);
        showFeedback('Produkt erfolgreich aktualisiert!', 'success');
      } else {
        // Neues Produkt erstellen
        await createProduct(productData, imageFile || undefined);
        showFeedback('Produkt erfolgreich erstellt!', 'success');
      }

      // Formular schliessen und übergeordnete Komponente benachrichtigen
      onClose();
    } catch (error: any) {
      console.error('Operation failed:', error);
      setSubmitError(
        error.message ||
          'Fehler bei der Operation. Bitte versuchen Sie es erneut.',
      );
      showFeedback('Fehler bei der Operation!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.productForm}>
      <div className={style.formHeader}>
        <h2 className={style.formTitle}>Neuen Artikel anlegen</h2>
      </div>

      <div className={style.formContent}>
        <div className={style.formGroup}>
          <label className={style.label}>Produktbild</label>
          <div
            className={`${style.dropZone} ${isDragging ? style.dragging : ''} ${imagePreview ? style.hasImage : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className={style.imagePreviewContainer}>
                <img
                  src={imagePreview}
                  alt="Vorschau"
                  className={style.imagePreview}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className={style.removeImageButton}
                  aria-label="Bild entfernen"
                >
                  <MaterialIcon icon="close" iconSize="small" />
                </button>
              </div>
            ) : (
              <div className={style.dropZoneContent}>
                <MaterialIcon icon="cloud_upload" iconSize="big" />
                <p className={style.dropZoneText}>
                  Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen
                </p>
                <p className={style.dropZoneHint}>JPG, PNG, WebP • Max. 5MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className={style.fileInput}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Name Field */}
        <div className={style.formGroup}>
          <label htmlFor="name" className={style.label}>
            Artikelname *
          </label>
          <input
            id="name"
            type="text"
            className={`${style.input} ${errors.name ? style.inputError : ''}`}
            {...register('name', {
              required: 'Artikelname ist erforderlich',
              minLength: {
                value: 3,
                message: 'Artikelname muss mindestens 3 Zeichen lang sein',
              },
            })}
            disabled={isLoading}
          />
          {errors.name && (
            <span className={style.errorMessage}>{errors.name.message}</span>
          )}
        </div>

        {/* Description Field */}
        <div className={style.formGroup}>
          <label htmlFor="description" className={style.label}>
            Beschreibung *
          </label>
          <textarea
            id="description"
            className={`${style.textarea} ${errors.description ? style.inputError : ''}`}
            rows={4}
            {...register('description', {
              required: 'Beschreibung ist erforderlich',
              minLength: {
                value: 10,
                message: 'Beschreibung muss mindestens 10 Zeichen lang sein',
              },
            })}
            disabled={isLoading}
          />
          {errors.description && (
            <span className={style.errorMessage}>
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Price and Stock Row */}
        <div className={style.formRow}>
          <div className={style.formGroup}>
            <label htmlFor="price" className={style.label}>
              Preis (CHF) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              className={`${style.input} ${errors.price ? style.inputError : ''}`}
              {...register('price', {
                required: 'Preis ist erforderlich',
                min: {
                  value: 0.01,
                  message: 'Preis muss größer als 0 sein',
                },
                valueAsNumber: true,
              })}
              disabled={isLoading}
            />
            {errors.price && (
              <span className={style.errorMessage}>{errors.price.message}</span>
            )}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="stockQuantity" className={style.label}>
              Lagerbestand *
            </label>
            <input
              id="stockQuantity"
              type="number"
              className={`${style.input} ${errors.stockQuantity ? style.inputError : ''}`}
              {...register('stockQuantity', {
                required: 'Lagerbestand ist erforderlich',
                min: {
                  value: 0,
                  message: 'Lagerbestand kann nicht negativ sein',
                },
                valueAsNumber: true,
              })}
              disabled={isLoading}
            />
            {errors.stockQuantity && (
              <span className={style.errorMessage}>
                {errors.stockQuantity.message}
              </span>
            )}
          </div>
        </div>

        {/* Category Field */}
        <div className={style.formGroup}>
          <label htmlFor="category" className={style.label}>
            Kategorie *
          </label>
          <select
            id="category"
            className={`${style.select} ${errors.category ? style.inputError : ''}`}
            {...register('category', {
              required: 'Kategorie ist erforderlich',
            })}
            disabled={isLoading}
          >
            <option value="">Bitte wählen...</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className={style.errorMessage}>
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Active Checkbox */}
        <div className={style.formGroup}>
          <label className={style.checkboxLabel}>
            <input
              type="checkbox"
              className={style.checkbox}
              {...register('isActive')}
              disabled={isLoading}
            />
            <span>Artikel ist aktiv</span>
          </label>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className={style.submitError}>
            <MaterialIcon icon="error" iconSize="small" />
            <span>{submitError}</span>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className={style.formActions}>
        <button
          type="button"
          onClick={onClose}
          className={style.cancelButton}
          disabled={isLoading}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className={style.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <MaterialIcon icon="hourglass_empty" iconSize="small" />
              <span>Wird gespeichert...</span>
            </>
          ) : (
            <>
              <MaterialIcon icon="save" iconSize="small" />
              <span>Artikel anlegen</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
