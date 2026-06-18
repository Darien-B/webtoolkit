// Simple local server with built-in CORS proxy for Web Toolkit
// Run: node server.js
// Then open: http://localhost:3030

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3030;
const DIR = __dirname;

function getMimeType(ext) {
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  return types[ext] || 'application/octet-stream';
}

function fetchRemote(targetUrl, res, redirectCount) {
  if (redirectCount > 5) {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    }
    res.end('Too many redirects');
    return;
  }

  const parsedUrl = new URL(targetUrl);
  const client = parsedUrl.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 15000,
  };

  const proxyReq = client.request(options, (proxyRes) => {
    // Follow redirects
    if ([301, 302, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
      proxyRes.resume(); // Drain the response
      const redirectUrl = new URL(proxyRes.headers.location, targetUrl).href;
      fetchRemote(redirectUrl, res, redirectCount + 1);
      return;
    }

    res.writeHead(proxyRes.statusCode, {
      'Content-Type': proxyRes.headers['content-type'] || 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    }
    res.end('Proxy error: ' + err.message);
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    }
    res.end('Proxy timeout');
  });

  proxyReq.end();
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  // CORS proxy endpoint: /proxy?url=https://example.com
  if (reqUrl.pathname === '/proxy') {
    const targetUrl = reqUrl.searchParams.get('url');
    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      res.end('Missing url parameter');
      return;
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      });
      res.end();
      return;
    }

    fetchRemote(targetUrl, res, 0);
    return;
  }

  // Static file serving
  let filePath = reqUrl.pathname === '/' ? '/index.html' : reqUrl.pathname;
  filePath = path.join(DIR, filePath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': getMimeType(ext) });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  Web Toolkit running at: http://localhost:${PORT}\n`);
  console.log(`  Built-in CORS proxy at: http://localhost:${PORT}/proxy?url=<target>\n`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
