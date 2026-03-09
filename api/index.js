const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('347589405886-e0af02uaf6j4p15f0q1aimp7b577mjfo.apps.googleusercontent.com');

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = process.env.PORT || 3000;
const apiUrl = process.env.API_URL || 'http://localhost';

//TODO: Set up a DB Server to store this data
let chatPrompt = '';
let chatHistory = [];

const ALLOWED_EMAILS = [
    'alexanderswcho@gmail.com'
];

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/set-prompt', (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Invalid prompt' });
    }
    chatPrompt = `You are a helpful assistant. ${prompt}`;
    chatHistory = [];
    console.log('Prompt set to:', chatPrompt);
    res.status(200).json({ message: 'Prompt updated' });
});

app.post('/chat', async (req, res) => {
    const userText = req.body?.text || '';

    chatHistory.push({ role: 'user', content: userText });

    const messages = [
        { role: 'system', content: chatPrompt },
        ...chatHistory
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages
        });

        const aiReply = completion.choices[0].message.content;

        // Add AI reply to history
        chatHistory.push({ role: 'assistant', content: aiReply });

        res.status(200).json({ reply: aiReply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get reply from OpenAI' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.post('/auth/google', async (req, res) => {
    const verifyGoogleUser = async idToken => {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const email = payload.email;
        const emailVerified = payload.email_verified;
        const givenName = payload.given_name;

        if (!emailVerified) {
            throw new Error('Email not verified');
        }

        const isAllowed = ALLOWED_EMAILS.includes(email);

        return {
            email,
            allowed: isAllowed,
            googleId: payload.sub,
            givenName
        };
    }

    const { idToken } = req.body;
    if (!idToken || typeof idToken !== 'string') {
        return res.status(400).json({ error: 'Invalid idToken' });
    }
    const user = await verifyGoogleUser(idToken);

    if (!user.allowed) {
        return res.status(403).json({ error: 'Not authorized', ...user });
    }

    res.status(200).json({ user });
});

// Start server
app.listen(port, () => {
    console.log(`API listening at ${apiUrl}:${port}`);
});

