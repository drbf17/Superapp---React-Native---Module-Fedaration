const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8090;

// Enable CORS for all routes
app.use(cors());

// Custom route for the bundle with proper Module Federation headers
app.get('/android/MicroApp.container.js.bundle', (req, res) => {
  const filePath = path.join(__dirname, 'android', 'MicroApp.container.js.bundle');
  
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Serve the file directly from the dev server - no modifications needed
  res.sendFile(filePath);
});

// Custom route for chunk bundles
app.get('/android/:chunkName.chunk.bundle', (req, res) => {
  const filename = req.params.chunkName + '.chunk.bundle';
  const filePath = path.join(__dirname, 'android', filename);
  
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.sendFile(filePath);
});

// Serve other static files with correct MIME types
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.bundle.map')) {
      res.setHeader('Content-Type', 'application/json');
    }
    if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
    // Disable caching for development
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Bundle server running on http://127.0.0.1:${PORT}`);
  console.log(`📦 Android bundle: http://127.0.0.1:${PORT}/android/MicroApp.container.js.bundle`);
  console.log(`📦 iOS bundle: http://127.0.0.1:${PORT}/ios/MicroApp.container.js.bundle`);
});
