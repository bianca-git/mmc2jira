
// Importing required modules
const Sentry = require('@sentry/node')
const { ProfilingIntegration } = require('@sentry/profiling-node')
const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');

// Importing controllers
const getAnnouncements = require('./api/controllers/getAnnouncements');
const searchRelatedIssues = require('./api/controllers/searchRelatedIssues');
const sendDetailsToJira = require('./api/controllers/sendDetailsToJira');
const updateLastImportDate = require('./api/controllers/updateLastImportDate');

// Setting up default options
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

Sentry.init({
  autoSessionTracking: false, // default: true
  environment: process.env.NODE_ENV,
  dsn: 'https://e42e25082755395109313a62b3671454@o4506167795122176.ingest.sentry.io/4506249814605824',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


// Route for saving service announcements
app.get('/getAnnouncements', (req, res) => {
  // Call the function and send the response
  getAnnouncements().then(data => {
    res.send(JSON.parse(JSON.stringify(data)));
  })
});

// Route for searching related issues
app.post('/searchRelatedIssues', (req, res) => {
  searchRelatedIssues(req.body).then(data => {
    res.send(data);
  })
})

// Route for creating new Jira issue
app.post('/sendDetailsToJira', (req, res) => {
  sendDetailsToJira(req.body).then(data => {
    res.send(data);
  })
})

app.post('/updateLastImportDate', (req, res) => {
  updateLastImportDate().then(data => {
    res.send(data);
  })
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});


// Setting up the server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}\nConnecting to data at ${process.env.ATLASSIAN_ENDPOINT}`)
);
