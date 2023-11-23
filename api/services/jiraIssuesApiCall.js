
const { callJiraRestService } = require('../helpers/callJiraRestService');
const { appendToJsonArrayFile } = require('../helpers/FileHero');
const process = require('process');
const endpoint = process.env.ATLASSIAN_ENDPOINT;


const updatedLogs = (logDetails) => {
  try {
    appendToJsonArrayFile('ticketUpdates.json', logDetails);
  } catch (error) {
    throw error;
  }
};

const jiraIssuesApiCall = async (issueData) => {
  if (!Array.isArray(issueData)) {
    throw new Error('issueData must be an array');
  }
  for (let i = 0; i < issueData.length; i++) {
    try {
      switch (issueData[i].callType) {
        case 'newIssue':
          const newResponse = await callJiraRestService(issueData[i].issueNew);
          const newLog = { key: newResponse.data.key, self: `https://${endpoint}/jira/browse/${newResponse.data.key}`, updatedAt: new Date().toLocaleString(), ...issueData[i].issueNew.fields, response: newResponse.status };
          console.log(`${i} : ${issueData[i].issueNew.fields.customfield_11501} = ${newLog.key} (New)`);
          updatedLogs(newLog)
          break;
        case 'updateIssue':
          const updateResponse = await callJiraRestService(issueData[i].issueUpdate, 'updateIssue', issueData[i].key);
          const updateLog = { key: issueData[i].key, self: `https://${endpoint}/jira/browse/${issueData[i].key}`, updatedAt: new Date().toLocaleString(), ...issueData[i].issueUpdate.fields, response: updateResponse.status };
          console.log(`${i} : ${issueData[i].id} = ${issueData[i].key} (Update)`);
          updatedLogs(updateLog);
          break;
        case 'transitionIssue':
          const transitionResponse = await callJiraRestService(issueData[i].issueTransition, 'transitionIssue', issueData[i].key);
          const transitionLog = { key: issueData[i].key, self: `https://${endpoint}/jira/browse/${issueData[i].key}`, updatedAt: new Date().toLocaleString(), ...issueData[i].issueTransition.fields, response: transitionResponse.status };
          console.log(`${i} : ${issueData[i].id} = ${issueData[i].key} (Transition)`);
          updatedLogs(transitionLog);
          break;
        default:
          break;
      }
    } catch (error) {
      const errorLog = { ...issueData[i], updatedAt: new Date().toLocaleString(), error: error };
      updatedLogs(errorLog);
      throw errorLog;
    }
  }
}
module.exports = { jiraIssuesApiCall } 
