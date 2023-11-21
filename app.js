const express = require('express');
require('dotenv').config();
const path = require('path');
const {json, urlencoded} = require('body-parser');
// Importing controllers
const {getAnnouncements} = require('./api/controllers/getAnnouncements');
const {searchRelatedIssues} = require('./api/controllers/searchRelatedIssues');
const sendDetailsToJira = require('./api/controllers/sendDetailsToJira');
const {updateLastImportDate} = require('./api/controllers/updateLastImportDate');

// Aplication Insights for Azure App services
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APP_INSIGHTS_CNCT)
.setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();

// Setting up default options
const app = express();
const PORT = process.env.PORT || 3000;


app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Route for saving service announcements
app.get('/getAnnouncements', (req, res) => {
  // Call the function and send the response
  getAnnouncements().then(data => {
    res.send(JSON.parse(JSON.stringify(data)));
  })
});

// Route for searching related issues
app.post('/searchRelatedIssues', async (req, res) => {
  await searchRelatedIssues(JSON.parse(JSON.stringify(req.body))).then(data => {
    res.send(data);
  })
})

// Route for creating new Jira issue
app.post('/sendDetailsToJira', async (req, res) => {
  await sendDetailsToJira(req.body).then(data => {
    res.send(data);
  })
})

app.post('/updateLastImportDate', (req, res) => {
  updateLastImportDate().then(data => {
    res.send(data);
  })
})

// Setting up the server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}\nConnecting to data at ${process.env.ATLASSIAN_ENDPOINT}`)
);
