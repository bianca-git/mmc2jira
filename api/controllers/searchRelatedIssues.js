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
  if (!msDataObj || !msDataObj.value) {
    throw new Error('msDataObj or msDataObj.value is undefined');
  }
  await Promise.all(msDataObj.value.map(async (serviceAnnounce) => {
    const relatedIssue = await getRelatedJiraTickets(serviceAnnounce.id);
    if (relatedIssue.newIssue) {
      newTickets.push({issueNew: new NewJiraIssue(serviceAnnounce), index: serviceAnnounce.index, callType: 'newIssue'});
    }
    else if (relatedIssue.status != 'Closed') {
      updateTickets.push({ id: relatedIssue.id, key: relatedIssue.key, issueUpdate: new UpdateJiraIssue(relatedIssue, serviceAnnounce), index: serviceAnnounce.index, callType: 'updateIssue' });
    }
    else {
      transitionTickets.push({ id: relatedIssue.id, key: relatedIssue.key, issueTransition: new TransitionJiraIssue(relatedIssue, serviceAnnounce), index: serviceAnnounce.index, callType: 'transitionIssue' });
    }
    return { ...relatedIssue };
  })).catch(error => {
    console.log(error);
    throw error;
  });
  let allIssues = [...newTickets, ...updateTickets, ...transitionTickets].sort((a, b) => a.index - b.index)
  const reply = {
    new: newTickets.length,
    update: updateTickets.length,
    transtion: transitionTickets.length,
    total: allIssues.length,
    allIssues: allIssues
  }
  const notice = `New: ${reply.new}, Update: ${reply.update}, Transition: ${reply.transtion}, Total: ${reply.total}`
  console.log(notice);
  return reply;
}

module.exports = { searchRelatedIssues }