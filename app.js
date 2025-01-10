require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');
const { redirectUrl } = require('./controllers/urlController');

// Express app
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes for API
app.use('/api/urls', urlRoutes);  // API routes are prefixed with /api

// Home route (for your view)
app.get('/', (req, res) => {
  res.render('index');
});

// Redirect route for shortened URLs (without /api prefix) -> This will handle the redirection logic
app.get('/urls/:shortUrl', redirectUrl);  

// Connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Connected to database & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
