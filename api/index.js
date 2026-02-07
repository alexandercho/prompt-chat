const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express API!');
});

// Start server
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

