
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, Subscription } from '../types';

// Mock data
const MOCK_ADMIN_USER: User = { id: 'admin01', email: 'admin@admin.com', name: 'Admin', role: 'admin' };

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  login: (email: string) => void;
  logout: () => void;
  signup: (email: string, name: string) => void;
  subscribe: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    try {
        const storedUser = localStorage.getItem('auth_user');
        const storedSub = localStorage.getItem('auth_subscription');
        if (storedUser && storedSub) {
            const parsedUser = JSON.parse(storedUser);
            const parsedSub = JSON.parse(storedSub);
            
            // Check for expiration
            if (parsedSub.status === 'active' && new Date(parsedSub.endDate) < new Date()) {
                parsedSub.status = 'expired';
                localStorage.setItem('auth_subscription', JSON.stringify(parsedSub));
            }
            
            setUser(parsedUser);
            setSubscription(parsedSub);
        }
    } catch (e) {
        console.error("Failed to parse auth data from storage", e);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_subscription');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    let loggedInUser: User;
    let userSubscription: Subscription;

    if (email.toLowerCase() === MOCK_ADMIN_USER.email) {
      loggedInUser = MOCK_ADMIN_USER;
      userSubscription = { status: 'active', startDate: new Date().toISOString(), endDate: 'never', paymentId: 'adm_sub' };
    } else {
      loggedInUser = { id: `user_${Date.now()}`, email, name: email.split('@')[0], role: 'user' };
      // Simulate existing user with expired sub
      userSubscription = { status: 'expired', startDate: '2023-01-01T00:00:00.000Z', endDate: '2023-01-31T00:00:00.000Z', paymentId: 'sub_expired123' };
    }
    
    setUser(loggedInUser);
    setSubscription(userSubscription);
    localStorage.setItem('auth_user', JSON.stringify(loggedInUser));
    localStorage.setItem('auth_subscription', JSON.stringify(userSubscription));
  };

  const signup = (email: string, name: string) => {
    const newUser: User = { id: `user_${Date.now()}`, email, name, role: 'user' };
    const newSubscription: Subscription = { status: 'pending', startDate: null, endDate: null, paymentId: null };
    setUser(newUser);
    setSubscription(newSubscription);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('auth_subscription', JSON.stringify(newSubscription));
  };
  
  const subscribe = () => {
    if (user) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);
        
        const newSubscription: Subscription = {
            status: 'active',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            paymentId: `as_pay_${Date.now()}`
        };
        setSubscription(newSubscription);
        localStorage.setItem('auth_subscription', JSON.stringify(newSubscription));
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_subscription');
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, subscription, login, logout, signup, subscribe, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
