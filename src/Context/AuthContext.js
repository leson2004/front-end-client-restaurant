import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const authState = useSelector(state => state.auth);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        if (user && token) {
            setCurrentUser(JSON.parse(user));
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    }, [authState]); // Thêm authState vào dependency array

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}