import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Erreur de chargement Auth:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (jwt, userData) => {
    try {
      setToken(jwt);
      setUser(userData);
      await AsyncStorage.setItem('token', jwt);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.log('Erreur de sauvegarde: ', e);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.log('Erreur suppression obj: ', e);
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (res.ok) {
        await login(data.token, data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (e) {
      return { success: false, error: 'Serveur injoignable.' };
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, googleLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
