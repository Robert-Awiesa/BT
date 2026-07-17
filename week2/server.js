const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Custom Logging Middleware (Bonus requirement)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// JSON and URL-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET / fallback logic:
// If a CLI/API tool (like curl) requests plain text or JSON, respond with text.
// Otherwise, fall through to serving static dashboard files from 'public'.
app.get('/', (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('html')) {
    next(); // Continue to express.static for browser HTML
  } else {
    res.send('My Week 2 API!'); // Direct text response for API tools
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// POST /user -> Accepts { name, email }, responds "Hello, [name]!"
app.post('/user', (req, res) => {
  const { name, email } = req.body;
  if (!name || !name.trim() || !email || !email.trim()) {
    return res.status(400).json({ error: 'Missing name or email' });
  }
  res.send(`Hello, ${name}!`);
});

// GET /user/:id -> responds "User [id] profile"
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  if (!id || !id.trim()) {
    return res.status(400).json({ error: 'Missing user ID' });
  }
  res.send(`User ${id} profile`);
});

// Global syntax error handler (e.g. malformed JSON payloads)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload format' });
  }
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Week 2 Express server running on port: ${PORT}`);
  console.log(` Interface: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
