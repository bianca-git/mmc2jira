const express = require('express');
require('dotenv').config();
const path = require('path');
const { json, urlencoded } = require('body-parser');
const cron = require('node-cron');

// Importing controllers
// const { getAnnouncements } = require('./api/controllers/getAnnouncements');
// const { searchRelatedIssues } = require('./api/controllers/searchRelatedIssues');
// const { sendDetailsToJira } = require('./api/controllers/sendDetailsToJira');
// const { updateLastImportDate } = require('./api/controllers/updateLastImportDate');
const index = require('./api/controllers/index');

// Setting up default options
const app = express();
const port = process.env.PORT || 3000;
const atlassian_env = process.env.ATLASSIAN_ENDPOINT;
const url = process.env.ENVURL || 'http://localhost:3000';
const dashboardUrl = `${url}/dashboard`

app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

cron.schedule('*/15 9-19 * * 1-5', async () => {
  console.log('Running a task every 15 minutes, between 09:00 AM and 07:59 PM UTC Timezone, Monday through Friday')
  await index().then(data => {
    res.send(data);
  })
}, {
  scheduled: true,
  timezone: "UTC"
})

// Route for saving service announcements
// app.get('/getAnnouncements', async (req, res) => {
//   // Call the function and send the response
//   await getAnnouncements().then(data => {
//     res.send(JSON.parse(JSON.stringify(data)));
//   })
// });

// // Route for searching related issues
// app.post('/searchRelatedIssues', async (req, res) => {
//   await searchRelatedIssues(JSON.parse(JSON.stringify(req.body))).then(data => {
//     res.send(data);
//   })
// })

// // Route for creating new Jira issue
// app.post('/sendDetailsToJira', async (req, res) => {
//   await sendDetailsToJira(req.body).then(data => {
//     res.send(data);
//   })
// })

// app.post('/updateLastImportDate', async (req, res) => {
//   await updateLastImportDate().then(data => {
//     res.send(data);
//   })
// })

app.put('/', async (req, res) => {
  await index().then(data => {
    res.send(data);
  })
})

// Setting up the server
app.listen(port, () =>
  console.log(`Server running on port ${port}\nConnecting to data at ${atlassian_env}\nAccess in browser enabled: ${url}\nConnecting to data at ${dashboardUrl}\nDatetime (UTC): ${new Date().toISOString()}\nDatetime (Local): ${new Date().toString()}`)
);
