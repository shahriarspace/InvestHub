import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            }
            catch (e) {
                console.error('Failed to parse stored user', e);
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            }
        }
        setIsLoading(false);
    }, []);
    const login = (newUser, token) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('authToken', token);
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
