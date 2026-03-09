import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { useEffect } from 'react';

const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const expoClientId = process.env.EXPO_PUBLIC_EXPO_CLIENT_ID;
const redirectUri = process.env.EXPO_PUBLIC_WEB_URL
maybeCompleteAuthSession();

export function useGoogleAuth(onSuccess) {
    const [request, response, promptAsync] = useAuthRequest({
        webClientId,
        expoClientId,
        responseType: 'id_token',
        scopes: ['openid', 'profile', 'email'],
        redirectUri
    });

    useEffect(() => {
        if (response?.type === 'success' && onSuccess) {
            onSuccess({
                idToken: response.params.id_token,
                accessToken: response.authentication?.accessToken
            });
        }
    }, [response, onSuccess]);

    return { request, promptAsync };
}