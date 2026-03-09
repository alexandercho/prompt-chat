import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(onSuccess) {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '347589405886-e0af02uaf6j4p15f0q1aimp7b577mjfo.apps.googleusercontent.com',
        expoClientId: 'https://auth.expo.io/@alexanderswcho/prompt-chat',
        responseType: 'id_token',
        scopes: ['openid', 'profile', 'email']
    });

    useEffect(() => {
        if (response?.type === 'success') {
            if (onSuccess) onSuccess({
                idToken: response.params.id_token,
                accessToken: response.authentication?.accessToken
            });;
        }
    }, [response, onSuccess]);

    return { request, promptAsync };
}