// Serverless multi-tier state handler for Vercel / Cloud deployment
let memoryStore = null;

async function getFromKv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/sokrio_tracker_state`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (json && json.result) {
      return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    }
  } catch (err) {
    console.error('KV get error:', err);
  }
  return null;
}

async function saveToKv(data) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/set/sokrio_tracker_state`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(data))
    });
    return res.ok;
  } catch (err) {
    console.error('KV set error:', err);
    return false;
  }
}

async function getFromJsonBin() {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;
  if (!binId || !apiKey) return null;
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { 'X-Master-Key': apiKey }
    });
    const json = await res.json();
    return json.record || null;
  } catch (err) {
    console.error('JSONBin get error:', err);
    return null;
  }
}

async function saveToJsonBin(data) {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;
  if (!binId || !apiKey) return false;
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.error('JSONBin save error:', err);
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

        let persistedTo = 'memory';
        if (await saveToKv(body)) {
          persistedTo = 'kv';
        } else if (await saveToJsonBin(body)) {
          persistedTo = 'jsonbin';
        }

        res.status(200).json({ 
          success: true, 
          timestamp: Date.now(), 
          storage: persistedTo 
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
    // 1. Try KV
    const kvData = await getFromKv();
    if (kvData && kvData.plans) {
      return res.status(200).json({ ...kvData, _source: 'kv' });
    }

    // 2. Try JSONBin
    const binData = await getFromJsonBin();
    if (binData && binData.plans) {
      return res.status(200).json({ ...binData, _source: 'jsonbin' });
    }

    // 3. Fallback to memoryStore
    if (memoryStore && memoryStore.plans) {
      return res.status(200).json({ ...memoryStore, _source: 'memory' });
    }

    return res.status(200).json({ empty: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
