const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ComicK API base URL
const COMICK_API_BASE = 'https://api.comick.io';

// Route to fetch top manga from ComicK API
app.get('/top', async (req, res) => {
  try {
    console.log('Fetching top manga from ComicK API...');
    
    const response = await axios.get(`${COMICK_API_BASE}/top`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('Successfully fetched data from ComicK API');
    res.json(response.data);
    
  } catch (error) {
    console.error('Error fetching data from ComicK API:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        error: 'Failed to fetch data from ComicK API',
        status: error.response.status,
        message: error.response.statusText
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: 'No response received from ComicK API',
        message: 'The ComicK API server is not responding'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ComicK API server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ComicK API Server',
    endpoints: {
      '/top': 'Get top manga from ComicK API',
      '/health': 'Health check endpoint'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ComicK API server running on port ${PORT}`);
  console.log(`📖 Top manga endpoint: http://localhost:${PORT}/top`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
}); 