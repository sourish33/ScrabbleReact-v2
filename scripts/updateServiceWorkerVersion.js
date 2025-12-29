const fs = require('fs');
const path = require('path');

// Read package.json to get the version
const packageJson = require('../package.json');
const version = packageJson.version;

// Generate cache name with version and timestamp
const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
const cacheName = `tortoise-scrabble-v${version}-${timestamp}`;

// Path to service worker
const serviceWorkerPath = path.join(__dirname, '../public/service-worker.js');

// Read the service worker file
let serviceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf8');

// Replace the CACHE_NAME line
serviceWorkerContent = serviceWorkerContent.replace(
  /const CACHE_NAME = ['"]tortoise-scrabble-v[^'"]*['"];/,
  `const CACHE_NAME = '${cacheName}';`
);

// Write back to the file
fs.writeFileSync(serviceWorkerPath, serviceWorkerContent);

console.log(`✓ Service worker updated to version: ${cacheName}`);
