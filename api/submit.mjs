export const config = {
api: {
bodyParser: true,
},
};

export default async function handler(req, res) {
if (req.method !== ‘POST’) {
return res.status(405).json({ error: ‘Method not allowed’ });
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID  = ‘appQMp6086JTVyWG6’;
const TABLE_ID = ‘tblp0cmKXsgQIhBqj’;

const body = req.body || {};

const fields = {
‘Full Name’:        body.fullName        || ‘’,
‘Email’:            body.email           || ‘’,
‘Primary Platform’: body.primaryPlatform || ‘’,
‘Social Handle’:    body.socialHandle    || ‘’,
‘TikTok Handle’:    body.tiktokHandle    || ‘’,
‘Following Size’:   body.followingSize   || ‘’,
‘User Type’:        body.userType        || ‘’,
‘State’:            body.state           || ‘’,
‘Why Ambassador’:   body.whyAmbassador   || ‘’,
‘Content Style’:    body.contentStyle    || ‘’,
‘Applied At’:       new Date().toISOString(),
‘Status’:           ‘Pending’
};

const response = await fetch(
`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
{
method: ‘POST’,
headers: {
‘Authorization’: `Bearer ${AIRTABLE_API_KEY}`,
‘Content-Type’: ‘application/json’
},
body: JSON.stringify({ fields })
}
);

const data = await response.json();
return res.status(response.status).json(data);
}