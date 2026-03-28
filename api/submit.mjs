export default async function handler(req, res) {
var key = process.env.AIRTABLE_API_KEY;
var url = “https://api.airtable.com/v0/appQMp6086JTVyWG6/tblp0cmKXsgQIhBqj”;
var body = req.body || {};
var payload = {
fields: {
“Full Name”: body.fullName || “”,
“Email Address”: body.email || “”,
“Primary Platform”: body.primaryPlatform || “”,
“Social Handle”: body.socialHandle || “”,
“TikTok Handle”: body.tiktokHandle || “”,
“Following Size”: body.followingSize || “”,
“User Type”: body.userType || “”,
“State”: body.state || “”,
“Why Ambassador”: body.whyAmbassador || “”,
“Content Style”: body.contentStyle || “”,
“Applied At”: new Date().toISOString(),
“Status”: “Pending”
}
};
var response = await fetch(url, {
method: “POST”,
headers: {
“Authorization”: “Bearer “ + key,
“Content-Type”: “application/json”
},
body: JSON.stringify(payload)
});
var data = await response.json();
return res.status(response.status).json(data);
}