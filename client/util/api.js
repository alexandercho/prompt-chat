import { Alert, Platform } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const headers = { 'Content-Type': 'application/json' };

export const setApiPrompt = async (prompt) => {
    try {
        const res = await fetch(`${API_BASE}/set-prompt`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ prompt })
        });
        if (!res.ok) {
            throw new Error('Failed to set prompt');
        }
    } catch {
        if (Platform.OS === 'web') {
            window.alert('You are running in offline mode.')
        } else {
            Alert.alert('You are running in offline mode.')
        }
    }

};

export const sendMessage = async ({ text }) => {
    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            throw new Error();
        }

        return await res.json();
    } catch {
        return {
            reply:
                'This is a demo project.\n\nTo try the full version, contact me here:\nhttps://alexandercho.github.io/contact'
        };
    }
};

export const authGoogle = async idToken => {
    const errorMessage = 'Your account is not authorized for full access. This app is currently a personal project and most features are restricted to approved accounts. You can continue using the app in demo mode. If you’re interested in trying the full version, feel free to reach out through https://alexandercho.github.io/contact'
    try {
        const res = await fetch(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ idToken })
        });

        if (!res.ok) {
            throw new Error();
        }

        return await res.json();
    } catch {
        if (Platform.OS === 'web') {
            window.alert(errorMessage)
        } else {
            Alert.alert(errorMessage)
        }
    }
};