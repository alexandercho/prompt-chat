const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express API!');
});

app.post('/chat', (req, res) => {
  res.status(200).json({
    reply: 'Hello World'
  });
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
  console.log(`API listening at http://localhost:${port}`);
});

