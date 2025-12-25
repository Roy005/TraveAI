import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('traveai_token');
            if (token) {
                try {
                    const data = await authAPI.getProfile();
                    setUser(data.user);
                } catch (err) {
                    // Token invalid, clear it
                    localStorage.removeItem('traveai_token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const register = async (name, email, password) => {
        setError(null);
        try {
            const data = await authAPI.register({ name, email, password });
            localStorage.setItem('traveai_token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const data = await authAPI.login({ email, password });
            localStorage.setItem('traveai_token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('traveai_token');
        setUser(null);
    };

    const updateProfile = async (updates) => {
        try {
            const data = await authAPI.updateProfile(updates);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
