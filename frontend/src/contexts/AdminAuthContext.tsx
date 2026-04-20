import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
}


interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const response = await apiClient.verifyAdminToken();
          if (response.success && response.data) {
            const responseData = response.data as { admin: AdminUser };
            setAdmin(responseData.admin);
          } else {
            localStorage.removeItem('adminToken');
          }
        }
      } catch {
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    setTimeout(checkAuth, 100);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting admin login for:', username);
      const response = await apiClient.loginAdmin({ username, password });
      console.log('🔐 Login response:', response);

      if (response.success && response.data) {
        // Handle the correct response structure from backend
        const responseData = response.data as { admin: AdminUser; token: string };

        if (responseData.token && responseData.admin) {
          const adminData = responseData.admin;
          const token = responseData.token;

          console.log('✅ Login successful, storing token and admin data');
          localStorage.setItem('adminToken', token);
          setAdmin(adminData);
          return true;
        } else {
          console.error('❌ Invalid response structure:', responseData);
          return false;
        }
      } else {
        console.error('❌ Login failed:', response.error || 'Unknown error');
        return false;
      }
    } catch {
      console.error('❌ Login error: Unknown error occurred');
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
  };


  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
