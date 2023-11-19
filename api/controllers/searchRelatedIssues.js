// Load environment variables from .env file
require('dotenv').config();
// Import required modules
const { getRelatedJiraTickets } = require('../services/getRelatedJiraTickets');
const process = require('process');
const { NewJiraIssue, UpdateJiraIssue, TransitionJiraIssue } = require(`${process.cwd()}/api/data/msToJiraConverter`)
const newTickets = [];
const updateTickets = [];
const transitionTickets = [];

const searchRelatedIssues = async (msDataObj) => {
  const relatedIssuesArr = await Promise.all(msDataObj.value.map(async (serviceAnnounce) => {
    const relatedIssue = await getRelatedJiraTickets(serviceAnnounce.id);
    if (relatedIssue.newIssue) {
      newTickets.push(new NewJiraIssue(serviceAnnounce));
    }
    else if (relatedIssue.status != 'Closed') {
      updateTickets.push({ id: relatedIssue.id, key: relatedIssue.key, issueUpdate: new UpdateJiraIssue(relatedIssue, serviceAnnounce) });
    }
    else {
      transitionTickets.push({ id: relatedIssue.id, key: relatedIssue.key, issueUpdate: new TransitionJiraIssue(relatedIssue, serviceAnnounce) });
    }
    return { ...relatedIssue };
  }));
  relatedIssuesArr.sort((item) => item.id);
  const reply = {
    new: newTickets.length,
    newIssues: newTickets,

    update: updateTickets.length,
    updateIssues: updateTickets,

    transtion: transitionTickets.length,
    transitionIssues: transitionTickets,

    total: relatedIssuesArr.length,
    allIssues: relatedIssuesArr,
  }
  return reply;
}

exports.searchRelatedIssues = searchRelatedIssues