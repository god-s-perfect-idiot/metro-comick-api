const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to fetch top manga from ComicK API
app.get("/top", async (req, res) => {
  let browser;
  try {
    console.log("Launching browser to fetch ComicK API data...");
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to the API
    await page.goto('https://api.comick.io/top', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Get the page content
    const content = await page.content();
    
    // Extract JSON from the page
    const data = await page.evaluate(() => {
      return JSON.parse(document.body.textContent);
    });
    
    console.log("Successfully fetched data from ComicK API using Puppeteer");
    res.json(data);
    
  } catch (error) {
    console.error("Puppeteer fetch failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch data from ComicK API",
      message: error.message,
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
});

// Generic fetch endpoint using Puppeteer
app.get("/fetch", async (req, res) => {
  let browser;
  try {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({
        error: "Missing URL parameter",
        message: "Please provide a URL parameter: /fetch?url=https://example.com"
      });
    }

    console.log(`Launching browser to fetch: ${url}`);
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Extract content from the page
    const data = await page.evaluate(() => {
      const contentType = document.contentType || '';
      if (contentType.includes('application/json')) {
        return JSON.parse(document.body.textContent);
      } else {
        return document.body.textContent;
      }
    });
    
    console.log("Successfully fetched data using Puppeteer");
    res.json(data);
    
  } catch (error) {
    console.error("Puppeteer fetch failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch data",
      message: error.message,
    });
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "ComicK API server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Puppeteer Fetch API Server",
    endpoints: {
      "/fetch": "Fetch any URL using Puppeteer: /fetch?url=https://example.com",
      "/health": "Health check endpoint"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer Fetch API server running on port ${PORT}`);
  console.log(`📡 Fetch endpoint: http://localhost:${PORT}/fetch?url=https://example.com`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
