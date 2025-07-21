'use client';

import style from '@/styles/admin/ProductForm.module.scss';
import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import Input from '@/components/system/Input';
import MaterialIcon from '@/components/system/MaterialIcon';
import { createProduct, updateProduct } from '@/requests/products.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { IProduct, ProductCategoryOptions } from '@/types/product.types';
import { useError } from '@/hooks/ErrorHook';
import { FormContainer } from '@/components/system/Container';
import { FormRow } from '@/components/system/Form';
import Select from '@/components/system/Select';

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
  const { transformFieldError } = useError();
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
    control,
    formState: { errors },
    reset,
  } = useForm<FormField>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stockQuantity: product?.stockQuantity || 0,
      category: product?.category || '',
      isActive: product?.isActive ?? true,
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

  const validatePrice = (price: number | undefined) => {
    if (!price) return 'Preis ist erforderlich';
    return price > 0 || 'Preis muss größer als 0 sein';
  };

  const validateStock = (stock: number | undefined) => {
    if (stock === undefined) return 'Lagerbestand ist erforderlich';
    return stock >= 0 || 'Lagerbestand kann nicht negativ sein';
  };

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

      // Formular schließen und übergeordnete Komponente benachrichtigen
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
    <div className={style.productForm}>
      <div className={style.formHeader}>
        <h2 className={style.formTitle}>
          {product ? 'Artikel bearbeiten' : 'Neuen Artikel anlegen'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className={style.closeButton}
          disabled={isLoading}
        >
          <MaterialIcon icon="close" iconSize="small" />
        </button>
      </div>

      <FormContainer
        className={style.formContainer}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        {/* Error Message */}
        {submitError && (
          <div className={style.errorAlert}>
            <MaterialIcon icon="error" iconSize="small" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Image Upload Section */}
        <FormRow>
          <div className={style.imageUploadSection}>
            <label className={style.sectionLabel}>Produktbild</label>
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
                  <MaterialIcon icon="cloud_upload" iconSize="normal" />
                  <p className={style.dropZoneText}>
                    Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen
                  </p>
                  <p className={style.dropZoneHint}>
                    JPG, PNG, WebP • Max. 5MB
                  </p>
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
        </FormRow>

        {/* Product Name */}
        <FormRow>
          <Input
            label="Artikelname"
            tooltip={{
              text: 'Geben Sie einen aussagekräftigen Namen für das Produkt ein',
            }}
            required
            fullWidth
            clearable
            readOnly={isLoading}
            inputProps={register('name', {
              required: 'required',
              minLength: { value: 3, message: 'minLength' },
            })}
            {...transformFieldError(errors.name)}
          />
        </FormRow>

        {/* Product Description */}
        <FormRow>
          <Input
            label="Beschreibung"
            tooltip={{
              text: 'Detaillierte Beschreibung des Produkts für Kunden',
            }}
            required
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            readOnly={isLoading}
            inputProps={register('description', {
              required: 'required',
              minLength: { value: 10, message: 'minLength' },
            })}
            {...transformFieldError(errors.description)}
          />
        </FormRow>

        {/* Price and Stock Row */}
        <FormRow direction="row">
          <Input
            type="number"
            label="Preis (CHF)"
            tooltip={{ text: 'Verkaufspreis in Schweizer Franken' }}
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('price', {
              required: 'required',
              valueAsNumber: true,
              validate: validatePrice,
            })}
            {...transformFieldError(errors.price)}
          />

          <Input
            type="number"
            label="Lagerbestand"
            tooltip={{ text: 'Aktuelle Anzahl der verfügbaren Artikel' }}
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('stockQuantity', {
              required: 'required',
              valueAsNumber: true,
              validate: validateStock,
            })}
            {...transformFieldError(errors.stockQuantity)}
          />
        </FormRow>

        {/* Category Selection */}
        <FormRow>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Kategorie ist erforderlich' }}
            render={({ field }) => (
              <Select
                label="Kategorie"
                tooltip={{
                  text: 'Wählen Sie die passende Produktkategorie aus',
                }}
                options={categories.map((category) => ({
                  value: category,
                  label: category,
                }))}
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={!!errors.category}
                helperText={errors.category?.message}
                required
                disabled={isLoading}
                placeholder="Bitte wählen..."
                fullWidth
                clearable
              />
            )}
          />
        </FormRow>

        {/* Active Status */}
        <FormRow>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <label className={style.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  className={style.checkbox}
                />
                <div className={style.checkboxContent}>
                  <div className={style.checkboxLabel}>
                    <MaterialIcon icon="visibility" iconSize="small" />
                    Artikel ist aktiv
                  </div>
                  <div className={style.checkboxDescription}>
                    Aktive Artikel sind für Kunden sichtbar und können bestellt
                    werden
                  </div>
                </div>
              </label>
            )}
          />
        </FormRow>

        {/* Submit Buttons */}
        <FormRow direction="row" gap="small">
          <button
            type="button"
            onClick={onClose}
            className={style.cancelButton}
            disabled={isLoading}
          >
            <MaterialIcon icon="close" iconSize="small" />
            Abbrechen
          </button>

          <button
            type="submit"
            className={style.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={style.spinner} />
                Wird gespeichert...
              </>
            ) : (
              <>
                <MaterialIcon icon="save" iconSize="small" />
                {product ? 'Artikel aktualisieren' : 'Artikel anlegen'}
              </>
            )}
          </button>
        </FormRow>
      </FormContainer>
    </div>
  );
};

export default ProductForm;
