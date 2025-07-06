export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: ProductCategoryOptions;
  isActive: boolean;
  imageUrl?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  availableQuantity: number;
}

export type ProductCategoryOptions =
  | 'Tamper'
  | 'Milk'
  | 'Tools'
  | 'Coffee Cups'
  | 'Scales'
  | '';

export interface ProductResponse {
  success: boolean;
  data?: IProduct[] | null;
  error?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  category?: string;
}

export interface UpdateStockRequest {
  stockQuantity: number;
}

export interface ProductFilters {
  isActive?: boolean;
  category?: string;
  [key: string]: any;
}
