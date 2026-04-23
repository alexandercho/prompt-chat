import { createContext, useContext, useEffect, useState } from 'react';
import { authGoogle } from '@/util/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getStoredSessionToken,
    removeStoredSessionToken,
    setStoredSessionToken
} from '@/util/sessionToken';
const AuthContext = createContext();
const USER_STORAGE_KEY = 'user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
        await removeStoredSessionToken();
        setUser(null);

        if (typeof document === 'undefined') return;

        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    };

    const login = async newUser => {
        if (!newUser?.idToken) {
            return;
        }

        const data = await authGoogle(newUser.idToken);

        if (!data?.user) {
            await logout();
            return;
        }

        setUser(data.user);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

        if (data.sessionToken) {
            await setStoredSessionToken(data.sessionToken);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const restoreUser = async () => {
            try {
                const [storedUser, storedSessionToken] = await Promise.all([
                    AsyncStorage.getItem(USER_STORAGE_KEY),
                    getStoredSessionToken()
                ]);

                if (!storedUser || !storedSessionToken) {
                    await AsyncStorage.removeItem(USER_STORAGE_KEY);

                    if (isMounted) {
                        setUser(null);
                    }

                    return;
                }

                if (isMounted) {
                    setUser(JSON.parse(storedUser));
                }
            } catch {
                await AsyncStorage.removeItem(USER_STORAGE_KEY);
                await removeStoredSessionToken();

                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        restoreUser();

        return () => {
            isMounted = false;
        };
    }, []);


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
