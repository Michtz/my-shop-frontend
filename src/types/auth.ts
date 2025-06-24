export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}
export interface User {
  refreshToken: string;
  token: string;
  user: UserInfo;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
  error?: string;
}

export interface SessionData {
  preferences: {
    theme: 'dark' | 'light';
    language: string;
  };
  lastActivity: string;
  data: {
    sessionId: string;
    isAuthenticated: boolean;
    data: SessionData;
    expires: string;
    createdAt: string;
    updatedAt: string;
  };
  [key: string]: any;
}

export interface SessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    isAuthenticated: boolean;
    data: SessionData;
    expires: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateSessionRequest {
  data: Partial<SessionData>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IAddress {
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  addresses?: IAddress[];
}
