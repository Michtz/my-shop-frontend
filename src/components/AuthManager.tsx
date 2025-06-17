'use client';

// Achtung ki test nonsins
import React, { useState } from 'react';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';

const AuthManager: React.FC = () => {
  const {
    user,
    sessionData, // ✅ FIX: sessionData statt sessionId
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    clearError,
  } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  // ✅ ENTFERNT: handleCreateSession - nicht mehr nötig

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ FIX: Neue API - separate Parameter
      await login(loginData.email, loginData.password);
    } catch (err) {
      Logger.error('Login failed:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ FIX: Neue API - separate Parameter
      await register(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName,
      );
    } catch (err) {
      Logger.error('Registration failed:', err);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cookie-Based Authentication</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-red-900">
            ×
          </button>
        </div>
      )}

      {/* ✅ FIX: Session info - zeigt jetzt sessionData statt sessionId */}
      {sessionData && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          <p className="text-sm text-blue-600">
            Session Theme: {sessionData.preferences?.theme || 'default'}
          </p>
          <p className="text-sm text-blue-600">
            Language: {sessionData.preferences?.language || 'default'}
          </p>
        </div>
      )}

      {/* ✅ ENTFERNT: Create Session Button - passiert automatisch */}

      {!isAuthenticated && (
        <div className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <h3 className="font-semibold">Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Login
            </button>
          </form>

          <form onSubmit={handleRegister} className="space-y-4">
            <h3 className="font-semibold">Register</h3>
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({ ...registerData, firstName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({ ...registerData, lastName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Register
            </button>
          </form>
        </div>
      )}

      {isAuthenticated && user && (
        <div className="space-y-4">
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <h3 className="font-semibold text-green-800">
              Welcome {user.firstName}!
            </h3>
            <p className="text-sm text-green-600">Role: {user.role}</p>
            <p className="text-sm text-green-600">Email: {user.email}</p>
            <p className="text-sm text-green-600">🍪 Cookie-authenticated</p>
          </div>

          {sessionData && (
            <div className="p-3 bg-gray-100 border border-gray-300 rounded">
              <h4 className="font-semibold text-gray-800">Session Data:</h4>
              <pre className="text-xs text-gray-600 mt-1">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthManager;

// only for testing
