// Fast Serverless state handler for Vercel / Cloud deployment
const fs = require('fs');
const path = require('path');

let memoryStore = null;

function getBundledState() {
  try {
    const data = require('./state.json');
    if (data && (data.plans || data.clientFollowups)) return data;
  } catch (e) {}
  try {
    const data = require('../state.json');
    if (data && (data.plans || data.clientFollowups)) return data;
  } catch (e) {}

  const possiblePaths = [
    path.join(process.cwd(), 'state.json'),
    path.join(__dirname, '..', 'state.json'),
    path.join(__dirname, 'state.json')
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const parsed = JSON.parse(content);
        if (parsed && (parsed.plans || parsed.clientFollowups)) {
          return parsed;
        }
      }
    } catch (err) {}
  }
  return null;
}

const DEFAULT_JSONBIN_BIN_ID = '6a8ab672da38895dfe0651b0';
const DEFAULT_JSONBIN_API_KEY = '$2a$10$SH3ipH.SexSWrF8ysnUreett9IOPI/oPRIkf1pZAV32RuIfmSPDEq';

async function fetchWithTimeout(url, options = {}, timeoutMs = 1500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    return null;
  }
}

async function getFromJsonBin() {
  const binId = process.env.JSONBIN_BIN_ID || DEFAULT_JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY || DEFAULT_JSONBIN_API_KEY;
  if (!binId || !apiKey) return null;
  try {
    const res = await fetchWithTimeout(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { 'X-Master-Key': apiKey }
    }, 1500);
    if (!res || !res.ok) return null;
    const json = await res.json();
    return json.record || null;
  } catch (err) {
    return null;
  }
}

async function saveToJsonBin(data) {
  const binId = process.env.JSONBIN_BIN_ID || DEFAULT_JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY || DEFAULT_JSONBIN_API_KEY;
  if (!binId || !apiKey) return false;
  try {
    const res = await fetchWithTimeout(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey
      },
      body: JSON.stringify(data)
    }, 2500);
    return res ? res.ok : false;
  } catch (err) {
    return false;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      if (!body || typeof body !== 'object') {
        const rawBody = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => { data += chunk.toString(); });
          req.on('end', () => resolve(data));
          req.on('error', reject);
        });
        body = JSON.parse(rawBody);
      }

      if (body && typeof body === 'object') {
        memoryStore = body;

        // Non-blocking background save
        saveToJsonBin(body).catch(() => {});

        res.status(200).json({ 
          success: true, 
          timestamp: Date.now(), 
          storage: 'memory+jsonbin' 
        });
        return;
      }

      res.status(400).json({ error: 'Empty or invalid body' });
    } catch (err) {
      res.status(400).json({ error: 'Invalid JSON body', detail: err.message });
    }
    return;
  }

  if (req.method === 'GET') {
    // 1. Instant response if in memoryStore
    if (memoryStore && (memoryStore.plans || memoryStore.clientFollowups)) {
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).json({ ...memoryStore, _source: 'memory' });
    }

    // 2. Instant response from bundled state.json
    const bundled = getBundledState();
    if (bundled && (bundled.plans || bundled.clientFollowups)) {
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).json({ ...bundled, _source: 'bundled' });
    }

    // 3. Fallback with fast timeout to JSONBin
    const binData = await getFromJsonBin();
    if (binData && binData.plans) {
      memoryStore = binData;
      return res.status(200).json({ ...binData, _source: 'jsonbin' });
    }

    return res.status(200).json({ empty: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
