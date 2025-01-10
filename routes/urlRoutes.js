const express = require('express');
const router = express.Router();
const {
  getAllUrls,
  getUrl,
  createUrl,
  deleteUrl,
  redirectUrl,
} = require('../controllers/urlController');

// Get all URLs (API route)
router.get('/', getAllUrls);

// Get a single URL by ID (API route)
router.get('/:id', getUrl);

// Create a new URL (API route)
router.post('/', createUrl);

// Delete a URL (API route)
router.delete('/:id', deleteUrl);

// Redirect to the original URL (non-API route)
router.get('/:shortUrl', redirectUrl);

module.exports = router;
