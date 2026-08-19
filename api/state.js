let memoryStore = null;

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
      // Vercel auto-parses JSON body when Content-Type is application/json
      let body = req.body;

      // If body is a string (raw), parse it manually
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      // If body is not yet parsed (raw stream), read it manually
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
        res.status(200).json({ success: true, timestamp: Date.now() });
        return;
      }

      res.status(400).json({ error: 'Empty or invalid body' });
    } catch (err) {
      res.status(400).json({ error: 'Invalid JSON body', detail: err.message });
    }
    return;
  }

  if (req.method === 'GET') {
    if (memoryStore && memoryStore.plans) {
      res.status(200).json(memoryStore);
    } else {
      res.status(200).json({ empty: true });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
