const Url = require('../models/Url');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Get all URLs
const getAllUrls = async (req, res) => {
  const urls = await Url.find({}).sort({ createdAt: -1 });
  res.status(200).json(urls);
};

// Get a single URL by ID
const getUrl = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such URL' });
  }

  const url = await Url.findById(id);

  if (!url) {
    return res.status(404).json({ error: 'No such URL' });
  }

  res.status(200).json(url);
};

// Create a new URL
const createUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    // Check if the URL already exists
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.status(200).json(url);
    }

    // Generate a short URL
    const shortUrl = crypto.randomBytes(6).toString('hex');

    // Add to the database
    url = await Url.create({ originalUrl, shortUrl });
    res.status(200).json(url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a URL
const deleteUrl = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such URL' });
  }

  const url = await Url.findOneAndDelete({ _id: id });

  if (!url) {
    return res.status(400).json({ error: 'No such URL' });
  }

  res.status(200).json(url);
};

// Redirect to the original URL
const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    // Find the URL in the database by the short URL
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllUrls,
  getUrl,
  createUrl,
  deleteUrl,
  redirectUrl,
};
