import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(onSuccess) {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '347589405886-e0af02uaf6j4p15f0q1aimp7b577mjfo.apps.googleusercontent.com',
        expoClientId: 'https://auth.expo.io/@alexanderswcho/prompt-chat'
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (onSuccess) onSuccess(authentication);
        }
    }, [response, onSuccess]);

    return { request, promptAsync };
}