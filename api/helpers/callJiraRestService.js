const axios = require('axios');
const process = require('process');

const callJiraRestService = async (issueBody, key = null, callType = 'newIssue') => {
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

  if (callType === 'newIssue') {
    return await axios.post(`https://${endpoint}/rest/api/3/issue`,
      JSON.stringify(issueBody), { headers: myHeaders })
      .then(function (response) {
        return { data: response.data, status: response.status };
      });
  }
  else if (callType === 'updateIssue') {
    return await axios.put(`https://${endpoint}/rest/api/3/issue/${key}`,
      JSON.stringify(issueBody), { headers: myHeaders })
      .then(function (response) {
        return { data: response.data, status: response.status };
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        throw error
      });
  }
  else if (callType === 'transitionIssue') {
    return await axios.post(`https://${endpoint}/rest/api/3/issue/${key}/transitions`,
      JSON.stringify(issueBody), { headers: myHeaders })
      .then(function (response) {
        return { data: response.data, status: response.status };
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        throw error
      });
  }
};
exports.callJiraRestService = callJiraRestService;
