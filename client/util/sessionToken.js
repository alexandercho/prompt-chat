import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    deleteItemAsync,
    getItemAsync,
    setItemAsync
} from 'expo-secure-store';

const SESSION_TOKEN_STORAGE_KEY = 'sessionToken';

export const getStoredSessionToken = async () => {
    if (Platform.OS === 'web') {
        return AsyncStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    }

    return getItemAsync(SESSION_TOKEN_STORAGE_KEY);
};

export const setStoredSessionToken = async sessionToken => {
    if (Platform.OS === 'web') {
        return AsyncStorage.setItem(SESSION_TOKEN_STORAGE_KEY, sessionToken);
    }

    return setItemAsync(SESSION_TOKEN_STORAGE_KEY, sessionToken);
};

export const removeStoredSessionToken = async () => {
    if (Platform.OS === 'web') {
        return AsyncStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    }

    return deleteItemAsync(SESSION_TOKEN_STORAGE_KEY);
};
