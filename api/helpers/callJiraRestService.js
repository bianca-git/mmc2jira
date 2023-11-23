
const axios = require('axios');
const process = require('process');

const callJiraRestService = async (issueBody, callType = 'newIssue', key = null) => {
  const endpoint = process.env.ATLASSIAN_ENDPOINT;
  const username = process.env.ATLASSIAN_USER_ID;
  const password = process.env.ATLASSIAN_API_TOKEN;
  const encoded = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  // Define headers for the API call
  const myHeaders = {
    "Accept": "application/json",
    "Authorization": `Basic ${encoded}`,
    "Content-Type": "application/json"
  };

  try {
    let response;
    if (callType === 'newIssue') {
      response = await axios.post(`https://${endpoint}/rest/api/3/issue?returnIssue=true`,
        JSON.stringify(issueBody), { headers: myHeaders });
    }
    else if (callType === 'updateIssue') {
      response = await axios.put(`https://${endpoint}/rest/api/3/issue/${key}?returnIssue=true`,
        issueBody, { headers: myHeaders });
    }
    else if (callType === 'transitionIssue') {
      response = await axios.post(`https://${endpoint}/rest/api/3/issue/${key}/transitions?returnIssue=true`,
        JSON.stringify(issueBody), { headers: myHeaders });
    }
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
};
module.exports = {callJiraRestService};
