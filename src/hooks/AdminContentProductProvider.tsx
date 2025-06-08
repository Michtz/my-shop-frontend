import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  isActive: boolean;
  lastUpdated: Date;
  image?: any;
}

export interface ProductFilters {
  search: string;
  category: string;
  isActive: string; // 'all' | 'true' | 'false'
  stockLevel: string; // 'all' | 'low' | 'out'
  sortBy: 'name' | 'price' | 'stockQuantity' | 'lastUpdated';
  sortOrder: 'asc' | 'desc';
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  isActive: boolean;
  image?: File | null;
}

interface AdminProductContextType {
  products: Product[];
  filters: ProductFilters;
  selectedProducts: string[];
  isLoading: boolean;
  editingProduct: Product | null;

  // Product management
  loadProducts: () => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<boolean>;
  updateProduct: (
    id: string,
    data: Partial<ProductFormData>,
  ) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;

  // UI state
  setFilters: (filters: Partial<ProductFilters>) => void;
  setSelectedProducts: any; // needs a type
  setEditingProduct: (product: Product | null) => void;

  // Utils
  getFilteredProducts: () => Product[];
  getCategories: () => string[];
}

const defaultFilters: ProductFilters = {
  search: '',
  category: 'all',
  isActive: 'all',
  stockLevel: 'all',
  sortBy: 'lastUpdated',
  sortOrder: 'desc',
};

// Mock data for development
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Espresso Bohnen Premium',
    description: 'Hochwertige Espresso Bohnen aus Italien',
    price: 24.9,
    stockQuantity: 45,
    category: 'Kaffee',
    isActive: true,
    lastUpdated: new Date('2024-01-15'),
  },
  {
    _id: '2',
    name: 'Kaffeemaschine Deluxe',
    description: 'Professionelle Kaffeemaschine für den Hausgebrauch',
    price: 299.0,
    stockQuantity: 3,
    category: 'Maschinen',
    isActive: true,
    lastUpdated: new Date('2024-01-10'),
  },
  {
    _id: '3',
    name: 'Latte Macchiato Mix',
    description: 'Cremiger Latte Macchiato zum Selbermachen',
    price: 12.5,
    stockQuantity: 0,
    category: 'Getränke',
    isActive: false,
    lastUpdated: new Date('2024-01-05'),
  },
];

const AdminProductContext = createContext<AdminProductContextType | undefined>(
  undefined,
);

export const AdminProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filters, setFiltersState] = useState<ProductFilters>(defaultFilters);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Placeholder API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (data: ProductFormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Placeholder API call
      const newProduct: Product = {
        _id: Date.now().toString(),
        ...data,
        price: Number(data.price),
        stockQuantity: Number(data.stockQuantity),
        lastUpdated: new Date(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      return true;
    } catch (error) {
      console.error('Failed to create product:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    data: Partial<ProductFormData>,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Placeholder API call
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id
            ? { ...product, ...data, lastUpdated: new Date() }
            : product,
        ),
      );
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Placeholder API call
      setProducts((prev) => prev.filter((product) => product._id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDelete = async (ids: string[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Placeholder API call
      setProducts((prev) =>
        prev.filter((product) => !ids.includes(product._id)),
      );
      setSelectedProducts([]);
      return true;
    } catch (error) {
      console.error('Failed to bulk delete products:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setFilters = (newFilters: Partial<ProductFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const getFilteredProducts = (): Product[] => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === filters.category,
      );
    }

    // Active filter
    if (filters.isActive !== 'all') {
      filtered = filtered.filter(
        (product) => product.isActive === (filters.isActive === 'true'),
      );
    }

    // Stock level filter
    if (filters.stockLevel === 'low') {
      filtered = filtered.filter(
        (product) => product.stockQuantity > 0 && product.stockQuantity <= 10,
      );
    } else if (filters.stockLevel === 'out') {
      filtered = filtered.filter((product) => product.stockQuantity === 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'lastUpdated') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const getCategories = (): string[] => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return categories.sort();
  };

  return (
    <AdminProductContext.Provider
      value={{
        products,
        filters,
        selectedProducts,
        isLoading,
        editingProduct,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        bulkDelete,
        setFilters,
        setSelectedProducts,
        setEditingProduct,
        getFilteredProducts,
        getCategories,
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProducts = (): AdminProductContextType => {
  const context = useContext(AdminProductContext);
  if (!context) {
    throw new Error(
      'useAdminProducts must be used within AdminProductProvider',
    );
  }
  return context;
};
