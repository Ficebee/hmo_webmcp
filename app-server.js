// Simple HTTP Server for HMO.InnerVoice Frontend
// Run: node app-server.js
// Then open: http://localhost:8080

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const APP_DIR = path.join(__dirname, 'app');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

/**
 * Create HTTP server
 */
const server = http.createServer((req, res) => {
    // Log request
    console.log(`${req.method} ${req.url}`);

    // Root path redirects to index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;

    // Serve from app directory
    filePath = path.join(APP_DIR, filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 Not Found</title>
        <style>
          body { font-family: sans-serif; margin: 40px; color: #333; }
          h1 { color: #d00; }
        </style>
      </head>
      <body>
        <h1>404 Not Found</h1>
        <p>The file you requested was not found.</p>
        <p><a href="/">Go back to homepage</a></p>
      </body>
      </html>
    `);
        return;
    }

    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>500 Server Error</title>
          <style>
            body { font-family: sans-serif; margin: 40px; color: #333; }
            h1 { color: #d00; }
          </style>
        </head>
        <body>
          <h1>500 Server Error</h1>
          <p>An error occurred while serving the file.</p>
          <p><a href="/">Go back to homepage</a></p>
        </body>
        </html>
      `);
            console.error(`Error serving ${filePath}:`, err.message);
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
        });
        res.end(content);
    });
});

/**
 * Start server
 */
server.listen(PORT, () => {
    console.log(`✓ HMO.InnerVoice Frontend Server started`);
    console.log(`✓ Serving from: ${APP_DIR}`);
    console.log(`✓ Open browser: http://localhost:${PORT}`);
    console.log(`✓ Press Ctrl+C to stop`);
});

/**
 * Handle server errors
 */
server.on('error', (err) => {
    console.error('Server error:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port:`);
        console.error(`  PORT=8081 node app-server.js`);
    }
    process.exit(1);
});
