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
        memoryStore = {
          state: body,
          updatedAt: Date.now()
        };
        return res.status(200).json({ success: true, timestamp: memoryStore.updatedAt });
      }
    } catch(err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  if (req.method === 'GET') {
    if (memoryStore && memoryStore.state) {
      return res.status(200).json(memoryStore.state);
    }
    return res.status(200).json({ empty: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
