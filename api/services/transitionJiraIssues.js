const { callJiraRestService } = require('../helpers/callJiraRestService');
const process = require('process');
const endpoint = process.env.ATLASSIAN_ENDPOINT;

const transitionJiraIssues = async (issueData) => {
  if (!Array.isArray(issueData)) {
    throw new Error('issueData must be an array');
  }
  for (let i = 0; i < issueData.length; i++) {
    try {
      const response = await callJiraRestService(issueData[i].issueUpdate, issueData[i].key, 'transitionIssue');
      const updateLog = { key: issueData[i].key, self: `https://${endpoint}/jira/browse/${issueData[i].key}`, updatedAt: new Date().toLocaleString(), fields: issueData[i].issueUpdate.fields, request: request.data, response: response.status };
      console.log(`${i} : ${issueData[i].id} = ${issueData[i].key} (${response.status})`);
      return updateLog;
    } catch (error) {
      const errorLog = { key: issueData[i].key, self: `https://${endpoint}/jira/browse/${issueData[i].key}`, updatedAt: new Date().toLocaleString(),error: error };
      throw errorLog;
    }
  }
}
exports.transitionJiraIssues = transitionJiraIssues
