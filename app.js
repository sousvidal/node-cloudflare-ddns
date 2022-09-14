const express = require('express');
const cron = require('node-cron');
const dotenv = require('dotenv').config();

const updateCloudflare = require('./tasks/update-cloudflare');

const app = express();
app.use(express.json());

// schedule tasks to be run on the server
cron.schedule('* * * * *', () => {
  updateCloudflare();
});

// force the server to run the task on startup
updateCloudflare();

module.exports = app;
