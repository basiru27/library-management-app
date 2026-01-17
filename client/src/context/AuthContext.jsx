import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decoding the token locally or verifying with backend is ideal
            // For now, we assume if token exists, we are logged in.
            // In a real app, we might call /api/auth/me if that endpoint existed.
            // Since we don't have a /me endpoint, we can store role/username in localStorage too or decode JWT.
            const storedRole = localStorage.getItem('role');
            const storedUser = localStorage.getItem('username');
            if (storedRole && storedUser) {
                setUser({ username: storedUser, role: storedRole });
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);

            setToken(token);
            setUser({ username, role });
            return true;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, role } = response.data;
            // Auto login after register
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', userData.username);

            setToken(token);
            setUser({ username: userData.username, role });
            return true;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
