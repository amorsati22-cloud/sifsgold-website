export default async function handler(req, res) {
if (req.method !== ‘POST’) {
return res.status(405).json({ error: ‘Method not allowed’ });
}

const key = process.env.AIRTABLE_API_KEY;
const url = ‘https://api.airtable.com/v0/appQMp6086JTVyWG6/tblp0cmKXsgQIhBqj’;

const body = req.body || {};

const payload = {
fields: {
‘Full Name’: body.fullName || ‘’,
‘Email’: body.email || ‘’,
‘Primary Platform’: body.primaryPlatform || ‘’,
‘Social Handle’: body.socialHandle || ‘’,
‘TikTok Handle’: body.tiktokHandle || ‘’,
‘Following Size’: body.followingSize || ‘’,
‘User Type’: body.userType || ‘’,
‘State’: body.state || ‘’,
‘Why Ambassador’: body.whyAmbassador || ‘’,
‘Content Style’: body.contentStyle || ‘’,
‘Applied At’: new Date().toISOString(),
‘Status’: ‘Pending’
}
};

const response = await fetch(url, {
method: ‘POST’,
headers: {
‘Authorization’: ’Bearer ’ + key,
‘Content-Type’: ‘application/json’
},
body: JSON.stringify(payload)
});

const data = await response.json();
return res.status(response.status).json(data);
}