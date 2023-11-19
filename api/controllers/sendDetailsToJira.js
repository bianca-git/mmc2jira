
require('dotenv').config();
const { createNewJiraIssues } = require('../services/createNewJiraIssues');
const { updateJiraIssues } = require('../services/updateJiraIssues');
const { transitionJiraIssues } = require('../services/transitionJiraIssues');

const sendDetailsToJira = async (ticketData) => {
  const newIssues = ticketData.newIssues;
  const updateIssues = ticketData.updateIssues;
  const transitionIssues = ticketData.transitionIssues;
  try {
    if (newIssues.length > 0) {
      await createNewJiraIssues(newIssues);
    }
    if (updateIssues.length > 0) {
      await updateJiraIssues(updateIssues);
    }    
    if (transitionIssues.length > 0) {
      await transitionJiraIssues(transitionIssues);
    }
    let response = { newIssues: newIssues, updateIssues: updateIssues, transitionIssues: transitionIssues }
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}
exports.sendDetailsToJira = sendDetailsToJira