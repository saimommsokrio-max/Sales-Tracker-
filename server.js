const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const STATE_FILE = path.join(__dirname, 'state.json');

// ── JSONBin Config (auto-sync to cloud) ──────────────────────────────────────
const JSONBIN_API_KEY = '$2a$10$SH3ipH.SexSWrF8ysnUreett9IOPI/oPRIkf1pZAV32RuIfmSPDEq';
const JSONBIN_BIN_ID  = '6a8ab672da38895dfe0651b0';
const JSONBIN_URL     = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// Push data to JSONBin silently in the background
function syncToCloud(data) {
  const body = JSON.stringify(data);
  const url = new URL(JSONBIN_URL);
  const isHttps = url.protocol === 'https:';
  const lib = isHttps ? require('https') : require('http');

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = lib.request(options, (res) => {
    let raw = '';
    res.on('data', chunk => { raw += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`[${new Date().toLocaleTimeString()}] ✅ Cloud sync OK`);
      } else {
        console.warn(`[${new Date().toLocaleTimeString()}] ⚠️  Cloud sync failed: ${res.statusCode} ${raw.slice(0,120)}`);
      }
    });
  });

  req.on('error', (e) => {
    console.warn(`[${new Date().toLocaleTimeString()}] ⚠️  Cloud sync error: ${e.message}`);
  });

  req.write(body);
  req.end();
}

// Pull latest data from JSONBin (used on first GET if local file is missing)
async function syncFromCloud() {
  return new Promise((resolve) => {
    const url = new URL(JSONBIN_URL + '/latest');
    const lib = require('https');
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    };
    const req = lib.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (json && json.record) {
            resolve(json.record);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

// ── MIME Types ────────────────────────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml'
};

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // API Route for State Persistence
  if (reqPath === '/api/state') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    if (req.method === 'GET') {
      if (fs.existsSync(STATE_FILE)) {
        try {
          const content = fs.readFileSync(STATE_FILE, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(content);
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Failed to read state' }));
        }
      }
      // No local file → try cloud
      syncFromCloud().then(cloudData => {
        if (cloudData) {
          // Cache locally
          fs.writeFileSync(STATE_FILE, JSON.stringify(cloudData, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ...cloudData, _source: 'cloud' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ empty: true }));
        }
      });
      return;
    }

    if (req.method === 'POST') {
      let bodyStr = '';
      req.on('data', chunk => {
        bodyStr += chunk.toString();
        if (bodyStr.length > 5 * 1024 * 1024) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Payload too large' }));
          req.destroy();
        }
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(bodyStr);
          if (!data || typeof data !== 'object') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
          // 1. Save locally
          fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), 'utf8');
          // 2. Auto-sync to cloud (non-blocking)
          syncToCloud(data);
          // 3. Respond immediately
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, timestamp: Date.now(), source: 'local+cloud' }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
      });
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  // Safe Static File Serving with Traversal Protection
  let safeReqPath = path.normalize(reqPath === '/' ? '/index.html' : reqPath).replace(/^(\.\.[\\/])+/, '');
  let filePath = path.join(__dirname, safeReqPath);
  const rootDir = path.resolve(__dirname);
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(rootDir + path.sep) && resolvedPath !== rootDir && resolvedPath !== path.join(rootDir, 'index.html')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Sokrio Sales Tracker running at http://localhost:${PORT}/`);
  console.log(`☁️  Auto cloud sync: ENABLED (JSONBin)`);
  console.log(`📁  Local state: ${STATE_FILE}\n`);
});
