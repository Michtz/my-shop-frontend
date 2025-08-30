export interface CartReservationData {
  productId: string;
  productName: string;
  availableStock: number;
  cartCount: number;
  sessionId: string;
  userId?: string;
}

export interface CartUpdateData {
  cartId: string;
  sessionId: string;
  userId?: string;
  totalItems: number;
  total: number;
  updatedAt: Date;
}

export interface StockConflictData {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableStock: number;
  conflictType:
    | 'insufficient_stock'
    | 'product_unavailable'
    | 'reservation_expired';
}

export interface ProductStockData {
  productId: string;
  name: string;
  stockQuantity: number;
  availableQuantity: number;
  lastUpdated: Date;
}

export interface ProductReservationInfo {
  productId: string;
  cartCount: number;
  availableStock: number;
}

export interface ReservationExpiredData {
  productId: string;
  message: string;
  timestamp: Date;
}

export interface CartSyncData {
  type:
    | 'item_reserved'
    | 'item_released'
    | 'cart_updated'
    | 'stock_conflict'
    | 'reservation_expired';
  data: any;
}

export interface LowStockAlert {
  productId: string;
  name: string;
  availableQuantity: number;
}

export interface OutOfStockAlert {
  productId: string;
  name: string;
}

export interface SocketEventMap {
  // Client → Server Events
  join_session: (sessionId: string) => void;
  leave_session: (sessionId: string) => void;
  join_user: (userId: string) => void;
  leave_user: (userId: string) => void;
  watch_product: (productId: string) => void;
  unwatch_product: (productId: string) => void;
  watch_category: (category: string) => void;
  unwatch_category: (category: string) => void;

  // Server → Client Events
  cart_item_reserved: (data: CartReservationData) => void;
  cart_item_released: (data: CartReservationData) => void;
  cart_updated: (data: CartUpdateData) => void;
  cart_synced: (data: CartSyncData) => void;
  cart_stock_conflict: (data: StockConflictData) => void;
  product_reserved: (data: ProductReservationInfo) => void;
  product_released: (data: ProductReservationInfo) => void;
  product_stock_updated: (data: ProductStockData) => void;
  category_stock_updated: (data: ProductStockData) => void;
  stock_updated: (data: ProductStockData) => void;
  reservation_expired: (data: ReservationExpiredData) => void;
  low_stock_alert: (data: LowStockAlert) => void;
  out_of_stock_alert: (data: OutOfStockAlert) => void;
}

export interface SocketContextType {
  socket: any | null; // Socket instance
  isConnected: boolean;
  joinSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  joinUser: (userId: string) => void;
  leaveUser: (userId: string) => void;
  watchProduct: (productId: string) => void;
  unwatchProduct: (productId: string) => void;
  watchCategory: (category: string) => void;
  unwatchCategory: (category: string) => void;
}

export interface CartSocketData {
  cartCount: { [productId: string]: number };
  stockConflicts: StockConflictData[];
}

export interface ProductSocketData {
  availableStock: number;
  cartCount: number;
  lastStockUpdate: Date;
}
