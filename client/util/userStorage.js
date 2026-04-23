import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserKey = user =>
    user?.googleId ?? user?.sub ?? user?.email ?? null;

const getPromptStorageKey = user => {
    const userKey = getUserKey(user);
    return userKey ? `prompt:${userKey}` : 'prompt';
};

export const loadPromptForUser = async user => {
    const promptStorageKey = getPromptStorageKey(user);
    const prompt = await AsyncStorage.getItem(promptStorageKey);
    if (prompt !== null) {
        return prompt;
    }
    if (promptStorageKey === 'prompt') {
        return '';
    }
    const legacyPrompt = await AsyncStorage.getItem('prompt');
    if (legacyPrompt !== null) {
        await AsyncStorage.setItem(promptStorageKey, legacyPrompt);
        return legacyPrompt;
    }
    return '';
};

export const savePromptForUser = async (user, prompt) =>
    AsyncStorage.setItem(getPromptStorageKey(user), prompt);
