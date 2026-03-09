import { createContext, useContext, useState } from 'react';
import { authGoogle } from '@/util/api';
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading] = useState(false);
    const logout = () => setUser(null);

    const login = newUser => {
        authGoogle(newUser?.idToken)
        setUser(newUser);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};