const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

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

// Start server
app.listen(port, () => {
    console.log(`API listening at ${apiUrl}:${port}`);
});

