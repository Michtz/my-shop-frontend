export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

export interface SessionData {
  preferences: {
    theme: 'dark' | 'light';
    language: string;
  };
  lastActivity: string;
}

export interface SessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    isAuthenticated: boolean;
    data: SessionData;
    expires: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  sessionId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sessionId: string;
}
