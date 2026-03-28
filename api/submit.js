module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID  = 'appQMp6086JTVyWG6';
  const TABLE_ID = 'tblp0cmKXsgQIhBqj';

  if (!AIRTABLE_API_KEY) return res.status(500).json({ error: 'Missing API key' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  // Map camelCase form fields → exact Airtable column names
  const fields = {
    'Full Name':        body.fullName        || '',
    'Email':            body.email           || '',
    'Primary Platform': body.primaryPlatform || '',
    'Social Handle':    body.socialHandle    || '',
    'TikTok Handle':    body.tiktokHandle    || '',
    'Following Size':   body.followingSize   || '',
    'User Type':        body.userType        || '',
    'State':            body.state           || '',
    'Why Ambassador':   body.whyAmbassador   || '',
    'Content Style':    body.contentStyle    || '',
    'Applied At':       body.appliedAt       || new Date().toISOString(),
    'Status':           'Pending'
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
