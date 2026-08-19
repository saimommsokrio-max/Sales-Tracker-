const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join('/tmp', 'state.json');
const LOCAL_STATE_FILE = path.join(__dirname, '..', 'state.json');
let memoryStore = null;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      if (body) {
        memoryStore = body;
        try { fs.writeFileSync(STATE_FILE, JSON.stringify(body, null, 2)); } catch(e) {}
        try { fs.writeFileSync(LOCAL_STATE_FILE, JSON.stringify(body, null, 2)); } catch(e) {}
        return res.status(200).json({ success: true, timestamp: Date.now() });
      }
    } catch(err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  if (req.method === 'GET') {
    if (memoryStore) {
      return res.status(200).json(memoryStore);
    }
    if (fs.existsSync(STATE_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        memoryStore = data;
        return res.status(200).json(data);
      } catch(e) {}
    }
    if (fs.existsSync(LOCAL_STATE_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(LOCAL_STATE_FILE, 'utf8'));
        memoryStore = data;
        return res.status(200).json(data);
      } catch(e) {}
    }
    return res.status(200).json({ empty: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
