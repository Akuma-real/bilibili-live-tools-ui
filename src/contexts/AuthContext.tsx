import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  apiKey: string | null;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 简单的加密函数
const encrypt = (text: string): string => {
  return btoa(text); // 使用 base64 加密，你可以使用更复杂的加密方法
};

// 解密函数
const decrypt = (text: string): string => {
  try {
    return atob(text);
  } catch {
    return '';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // 从 localStorage 获取加密的 API key
    const encryptedKey = localStorage.getItem('apiKey');
    if (encryptedKey) {
      const decryptedKey = decrypt(encryptedKey);
      setApiKey(decryptedKey);
      setIsAuthenticated(true);
    } else {
      // 如果没有 API key，重定向到登录页面
      navigate('/login');
    }
  }, [navigate]);

  const login = (key: string) => {
    const encryptedKey = encrypt(key);
    localStorage.setItem('apiKey', encryptedKey);
    setApiKey(key);
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('apiKey');
    setApiKey(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
