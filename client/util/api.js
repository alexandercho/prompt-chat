const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const headers = { 'Content-Type': 'application/json' };

export const setApiPrompt = async (prompt) => {
    const res = await fetch(`${API_BASE}/set-prompt`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
        throw new Error('Failed to set prompt');
    }
};

export const sendMessage = async ({ text }) => {
    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text }),
        });

        if (!res.ok) {
            throw new Error();
        }

        return await res.json();
    } catch {
        return {
            reply:
                'This is a demo project.\n\nTo try the full version, contact me here:\nhttps://alexandercho.github.io/contact',
        };
    }
};
