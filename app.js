const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');

// Importing controllers
const {getAnnouncements} = require('./api/controllers/getAnnouncements');
const {searchRelatedIssues} = require('./api/controllers/searchRelatedIssues');
const sendDetailsToJira = require('./api/controllers/sendDetailsToJira');
const {updateLastImportDate} = require('./api/controllers/updateLastImportDate');

// Setting up default options
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Route for saving service announcements
app.get('/getAnnouncements', (req, res) => {
  // Call the function and send the response
  getAnnouncements().then(data => {
    res.send(JSON.parse(JSON.stringify(data)));
  })
});

// Route for searching related issues
app.post('/searchRelatedIssues', (req, res) => {
  searchRelatedIssues(bodyParser.json(req.body)).then(data => {
    res.send(data);
  })
})

// Route for creating new Jira issue
app.post('/sendDetailsToJira', async (req, res) => {
  await sendDetailsToJira(bodyParser.json(req.body)).then(data => {
    console.log(data);
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
