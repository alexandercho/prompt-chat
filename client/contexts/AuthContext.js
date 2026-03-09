import { createContext, useContext, useEffect, useState } from 'react';
import { authGoogle } from '@/util/api';
import { Platform } from 'react-native';
import { setItemAsync } from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [loading] = useState(false);

    const logout = () => {
        AsyncStorage.setItem('user', null)
            .then(() => setUser(null))
            .then(() => {
                if (typeof document === 'undefined') return;
                const cookies = document.cookie.split(';');
                cookies.forEach(cookie => {
                    const eqPos = cookie.indexOf('=');
                    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                });
            })
    };

    const login = async newUser => {
        if (newUser) {
            const data = authGoogle(newUser?.idToken)
            setUser(newUser);
            await AsyncStorage.setItem('user', JSON.stringify(newUser))
            if (Platform.OS !== 'web') {
                await setItemAsync('sessionToken', data.sessionToken)
            }
        }
    }

    useEffect(() => {
        AsyncStorage.getItem('user')
            .then(JSON.parse)
            .then(login)
            .catch(logout)
    }, [])


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