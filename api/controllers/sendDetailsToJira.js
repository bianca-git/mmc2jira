
require('dotenv').config();
const { jiraIssuesApiCall } = require('../services/jiraIssuesApiCall');
const FileHero = require('../helpers/FileHero');

const sendDetailsToJira = async (ticketData) => {
  try {
    const allIssues = await jiraIssuesApiCall(ticketData.allIssues);
    return {
      allIssues
    };
  } catch (error) {
    console.log(error);
    FileHero.appendToJsonArrayFile('./data/errorLog.json', JSON.stringify(error));
    throw error;
  }
}

module.exports = { sendDetailsToJira };
