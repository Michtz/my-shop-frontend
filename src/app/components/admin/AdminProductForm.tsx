import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useAdminProducts,
  Product,
  ProductFormData,
} from '@/hooks/AdminContentProductProvider';
import Button from '@/app/components/system/Button';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import style from '@/styles/AdminProductForm.module.scss';

interface ProductFormProps {
  product?: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['Kaffee', 'Maschinen', 'Getränke', 'Zubehör', 'Süßwaren'];

const AdminProductForm: React.FC<ProductFormProps> = ({
  product,
  onCancel,
  onSuccess,
}) => {
  const { createProduct, updateProduct, isLoading } = useAdminProducts();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: CATEGORIES[0],
      isActive: true,
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.category,
        isActive: product.isActive,
      });

      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById(
      'image-upload',
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data: ProductFormData) => {
    const formData = {
      ...data,
      image: imageFile,
    };

    let success = false;
    if (isEditing && product) {
      success = await updateProduct(product._id, formData);
    } else {
      success = await createProduct(formData);
    }

    if (success) {
      onSuccess();
    }
  };

  const stockQuantity = watch('stockQuantity');
  const price = watch('price');

  return (
    <div className={style.formContainer}>
      <div className={style.formHeader}>
        <h2>{isEditing ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</h2>
        <Button
          appearance="icon"
          variant="ghost"
          icon="close"
          onClick={onCancel}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={style.productForm}>
        {/* Image Upload Section */}
        <div className={style.imageSection}>
          <label>Produktbild</label>
          <div className={style.imageUpload}>
            {imagePreview ? (
              <div className={style.imagePreview}>
                <img src={imagePreview} alt="Preview" />
                <div className={style.imageOverlay}>
                  <Button
                    type="button"
                    appearance="icon"
                    variant="ghost"
                    icon="delete"
                    onClick={removeImage}
                  />
                </div>
              </div>
            ) : (
              <label htmlFor="image-upload" className={style.uploadPlaceholder}>
                <MaterialIcon icon="add_photo_alternate" iconSize="big" />
                <span>Bild hochladen</span>
                <small>JPG, PNG bis 5MB</small>
              </label>
            )}

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={style.hiddenInput}
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className={style.formSection}>
          <h3>Grundinformationen</h3>

          <div className={style.formGroup}>
            <label>Produktname*</label>
            <input
              type="text"
              {...register('name', {
                required: 'Produktname ist erforderlich',
                minLength: {
                  value: 2,
                  message: 'Name muss mindestens 2 Zeichen lang sein',
                },
              })}
              className={errors.name ? style.error : ''}
              placeholder="z.B. Espresso Bohnen Premium"
            />
            {errors.name && (
              <span className={style.errorText}>{errors.name.message}</span>
            )}
          </div>

          <div className={style.formGroup}>
            <label>Beschreibung*</label>
            <textarea
              rows={4}
              {...register('description', {
                required: 'Beschreibung ist erforderlich',
                minLength: {
                  value: 10,
                  message: 'Beschreibung muss mindestens 10 Zeichen lang sein',
                },
              })}
              className={errors.description ? style.error : ''}
              placeholder="Detaillierte Produktbeschreibung..."
            />
            {errors.description && (
              <span className={style.errorText}>
                {errors.description.message}
              </span>
            )}
          </div>

          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label>Kategorie*</label>
              <select
                {...register('category', {
                  required: 'Kategorie ist erforderlich',
                })}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className={style.errorText}>
                  {errors.category.message}
                </span>
              )}
            </div>

            <div className={style.formGroup}>
              <label>Status</label>
              <div className={style.toggleGroup}>
                <label className={style.toggleLabel}>
                  <input type="checkbox" {...register('isActive')} />
                  <span className={style.toggleSlider}></span>
                  <span>Produkt ist aktiv</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className={style.formSection}>
          <h3>Preis & Lager</h3>

          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label>Preis (CHF)*</label>
              <div className={style.priceInput}>
                <span className={style.currency}>CHF</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', {
                    required: 'Preis ist erforderlich',
                    min: {
                      value: 0.01,
                      message: 'Preis muss größer als 0 sein',
                    },
                  })}
                  className={errors.price ? style.error : ''}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <span className={style.errorText}>{errors.price.message}</span>
              )}
            </div>

            <div className={style.formGroup}>
              <label>Lagerbestand*</label>
              <input
                type="number"
                min="0"
                {...register('stockQuantity', {
                  required: 'Lagerbestand ist erforderlich',
                  min: {
                    value: 0,
                    message: 'Lagerbestand kann nicht negativ sein',
                  },
                })}
                className={errors.stockQuantity ? style.error : ''}
                placeholder="0"
              />
              {errors.stockQuantity && (
                <span className={style.errorText}>
                  {errors.stockQuantity.message}
                </span>
              )}

              {stockQuantity <= 10 && stockQuantity > 0 && (
                <div className={style.warningText}>
                  <MaterialIcon icon="warning" iconSize="small" />
                  Niedriger Lagerbestand
                </div>
              )}

              {stockQuantity === 0 && (
                <div className={style.errorText}>
                  <MaterialIcon icon="error" iconSize="small" />
                  Produkt nicht verfügbar
                </div>
              )}
            </div>
          </div>

          {/* Price Preview */}
          {price > 0 && (
            <div className={style.pricePreview}>
              <div className={style.priceInfo}>
                <span>
                  Preis inkl. MwSt:{' '}
                  <strong>CHF {Number(price).toFixed(2)}</strong>
                </span>
                <span>
                  Preis exkl. MwSt: CHF {(Number(price) / 1.081).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className={style.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Änderungen speichern' : 'Produkt erstellen'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
