import Button from '@/app/components/system/Button';
import useProducts from '@/hooks/useProducts';
import { createProduct } from '@/requests/products.request';

const CreateProductForm = () => {
  const {
    imageState,
    selectImage,
    removeImage,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    isDragOver,
    fileInputRef,
    openFileDialog,
  } = useImage();

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      selectImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createProduct(formData, imageState.file || undefined);
    if (success) {
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
      });
      removeImage();
      console.log('Product created with image!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-product-form">
      <h2>Create New Product</h2>

      {/* Basic Form Fields */}
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: parseFloat(e.target.value) })
        }
        required
      />

      <input
        type="number"
        placeholder="Stock Quantity"
        value={formData.stockQuantity}
        onChange={(e) =>
          setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })
        }
        required
      />

      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      />

      {/* Image Upload Area */}
      <div className="image-upload-section">
        <h3>Product Image</h3>

        {/* Drag & Drop Area */}
        <div
          className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {imageState.preview ? (
            <div className="image-preview">
              <img src={imageState.preview} alt="Preview" width="200" />
              <button type="button" onClick={removeImage}>
                Remove Image
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <p>Drag & drop an image here or click to select</p>
              <p>Max 5MB • JPG, PNG, WebP</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {imageState.error && (
          <div className="error-message">{imageState.error}</div>
        )}
      </div>

      <Button type="submit" disabled={isCreating || !imageState.isValid}>
        {isCreating ? 'Creating Product...' : 'Create Product'}
      </Button>
    </form>
  );
};
