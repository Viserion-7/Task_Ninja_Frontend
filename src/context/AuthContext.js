import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                // Verify stored credentials with a test API call
                api.get('/tasks/')
                    .then(() => {
                        setUser(userData);
                        setIsAuthenticated(true);
                    })
                    .catch(() => {
                        // If credentials are invalid, clear them
                        localStorage.removeItem('user');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } catch (error) {
                // If stored data is invalid, clear it
                localStorage.removeItem('user');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        if (!userData.username || !userData.password) {
            throw new Error('Invalid login data');
        }
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/'; // Redirect to login
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
