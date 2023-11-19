const { callJiraRestService } = require('../helpers/callJiraRestService');
const process = require('process');
const endpoint = process.env.ATLASSIAN_ENDPOINT;

const createNewJiraIssues = async (issueData) => {
  if (!Array.isArray(issueData)) {
    throw new Error('issueData must be an array');
  }
  for (let i = 0; i < issueData.length; i++) {
    try {
      const response = await callJiraRestService(issueData[i]);
      const updateLog = { key: response.data.key, self: `https://${endpoint}/jira/browse/${response.data.key}`, updatedAt: new Date().toLocaleString(), ...issueData[i].fields, response: response.status };
      console.log(`${i} : ${issueData[i].fields.customfield_11501} = ${updateLog.key}`);
      return updateLog;
    } catch (error) {
      const errorLog = { id: issueData[i].id, updatedAt: new Date().toLocaleString(), error: error };
      throw errorLog;
    }
  }
}
exports.createNewJiraIssues = createNewJiraIssues 
